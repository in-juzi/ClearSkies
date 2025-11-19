import { v4 as uuidv4 } from 'uuid';
import {
  Monster,
  Ability,
  MonsterInstance,
  DamageResult,
  AttackResult,
  ActiveBuff,
  BuffApplication,
  StatModifier,
  BuffableStat,
  ModifierType,
  EffectContext
} from '@shared/types';
import { MonsterRegistry } from '../data/monsters/MonsterRegistry';
import { AbilityRegistry } from '../data/abilities/AbilityRegistry';
import { COMBAT_FORMULAS } from '../data/constants/combat-constants';
import { ICombatEntity, PlayerCombatEntity, MonsterCombatEntity, WeaponData } from './combat/CombatEntity';
import effectEvaluator from './effectEvaluator';
import playerCombatService from './playerCombatService';

/**
 * Cached passive ability effects for an entity
 */
interface PassiveEffects {
  armorBonus: number;
  evasionBonus: number;
  critChanceBonus: number;
  damageBonus: number;
  conditionalBonuses: Array<{
    trigger: string;
    effect: string;
    value: number;
  }>;
}

class CombatService {
  // Cache passive ability effects to avoid re-calculating every damage calculation
  private passiveEffectsCache = new Map<string, PassiveEffects>();

  constructor() {
    console.log(`Loaded ${MonsterRegistry.size} monsters from MonsterRegistry (compile-time)`);
    console.log(`Loaded ${AbilityRegistry.size} abilities from AbilityRegistry (compile-time)`);
  }

  /**
   * Get or calculate passive ability effects for an entity
   * Uses cache to avoid repeated iterations over passive abilities
   */
  private getPassiveEffects(entity: any): PassiveEffects {
    // Generate cache key (monsterId for monsters, player _id for players)
    const cacheKey = entity.monsterId || (entity._id ? entity._id.toString() : 'unknown');

    // Check cache first
    if (this.passiveEffectsCache.has(cacheKey)) {
      return this.passiveEffectsCache.get(cacheKey)!;
    }

    // Calculate effects from passive abilities
    const effects: PassiveEffects = {
      armorBonus: 0,
      evasionBonus: 0,
      critChanceBonus: 0,
      damageBonus: 0,
      conditionalBonuses: []
    };

    if (entity.passiveAbilities) {
      for (const ability of entity.passiveAbilities) {
        if (!ability.effects) continue;

        // Accumulate always-active bonuses
        if (ability.effects.armorBonus) {
          effects.armorBonus += ability.effects.armorBonus;
        }
        if (ability.effects.evasionBonus) {
          effects.evasionBonus += ability.effects.evasionBonus;
        }
        if (ability.effects.critChanceBonus) {
          effects.critChanceBonus += ability.effects.critChanceBonus;
        }

        // Handle damage bonuses (may be conditional)
        if (ability.effects.damageBonus) {
          if (ability.effects.trigger) {
            // Conditional bonus (e.g., below_50_percent_hp)
            effects.conditionalBonuses.push({
              trigger: ability.effects.trigger,
              effect: 'damageBonus',
              value: ability.effects.damageBonus
            });
          } else {
            // Always-active bonus
            effects.damageBonus += ability.effects.damageBonus;
          }
        }
      }
    }

    // Cache the result
    this.passiveEffectsCache.set(cacheKey, effects);

    return effects;
  }

  /**
   * Clear passive effects cache for an entity
   * Call this when entity's passive abilities change
   */
  clearPassiveEffectsCache(entity: any): void {
    const cacheKey = entity.monsterId || (entity._id ? entity._id.toString() : 'unknown');
    this.passiveEffectsCache.delete(cacheKey);
  }

  /**
   * Clear entire passive effects cache
   * Useful for testing or when many entities change
   */
  clearAllPassiveEffectsCache(): void {
    this.passiveEffectsCache.clear();
  }

  /**
   * Wrap an entity (player or monster) in the appropriate ICombatEntity wrapper
   */
  private wrapEntity(entity: any, itemService: any): ICombatEntity {
    if (entity.monsterId) {
      return new MonsterCombatEntity(entity);
    } else {
      return new PlayerCombatEntity(entity, itemService);
    }
  }

  /**
   * Get monster definition by ID
   */
  getMonster(monsterId: string): Monster | undefined {
    return MonsterRegistry.get(monsterId);
  }

  /**
   * Get ability definition by ID
   */
  getAbility(abilityId: string): Ability | undefined {
    return AbilityRegistry.get(abilityId);
  }

  /**
   * Get all available abilities for a weapon type
   */
  getAbilitiesForWeapon(skillScalar: string): Ability[] {
    const abilities: Ability[] = [];
    for (const ability of AbilityRegistry.getAll()) {
      if (ability.requirements && ability.requirements.weaponTypes) {
        if (ability.requirements.weaponTypes.includes(skillScalar)) {
          abilities.push(ability);
        }
      }
    }
    return abilities;
  }

  /**
   * Create a monster instance from definition
   */
  createMonsterInstance(monsterId: string): any {
    const monsterDef = this.getMonster(monsterId);
    if (!monsterDef) {
      throw new Error(`Monster not found: ${monsterId}`);
    }

    // Create a deep copy of the monster with current stats
    const instance = {
      monsterId: monsterDef.monsterId,
      name: monsterDef.name,
      level: monsterDef.level,
      stats: {
        health: {
          current: monsterDef.stats.health.max,
          max: monsterDef.stats.health.max
        },
        mana: {
          current: monsterDef.stats.mana.max,
          max: monsterDef.stats.mana.max
        }
      },
      attributes: JSON.parse(JSON.stringify(monsterDef.attributes)),
      skills: JSON.parse(JSON.stringify(monsterDef.skills)),
      equipment: JSON.parse(JSON.stringify(monsterDef.equipment)),
      combatStats: JSON.parse(JSON.stringify(monsterDef.combatStats)),
      passiveAbilities: JSON.parse(JSON.stringify(monsterDef.passiveAbilities || [])),
      lootTables: monsterDef.lootTables,
      goldDrop: monsterDef.goldDrop,
      experience: monsterDef.experience
    };

    return instance;
  }

  /**
   * Parse dice notation (e.g., "1d6", "2d4+2")
   */
  rollDice(diceNotation: string): number {
    const match = diceNotation.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) {
      throw new Error(`Invalid dice notation: ${diceNotation}`);
    }

    const numDice = parseInt(match[1]);
    const numFaces = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    let total = modifier;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * numFaces) + 1;
    }

    return Math.max(COMBAT_FORMULAS.MIN_DAMAGE, total);
  }

  /**
   * Generic combat stat calculation from all sources
   * Consolidates logic for armor, evasion, and future stats
   *
   * @param entity - The entity (player or monster) to calculate stat for
   * @param itemService - Item service for equipment lookups
   * @param player - Player reference for buff calculations
   * @param statName - Name of stat to calculate (armor, evasion, etc.)
   * @param combatStatKey - Key in entity.combatStats (armor, evasion)
   * @param passiveEffectKey - Key in passive ability effects (armorBonus, evasionBonus)
   * @param itemPropertyKey - Key in item properties (armor, evasion)
   * @returns Total stat value after all bonuses applied
   */
  /**
   * Get base stat value from entity's combatStats
   */
  private getBaseCombatStat(entity: any, combatStatKey: string): number {
    if (entity.combatStats && entity.combatStats[combatStatKey] !== undefined) {
      return entity.combatStats[combatStatKey];
    }
    return 0;
  }

  /**
   * Get passive ability bonuses for a stat
   */
  private getPassiveCombatBonus(entity: any, passiveEffectKey: string): number {
    if (!passiveEffectKey) return 0;

    const passiveEffects = this.getPassiveEffects(entity);
    const bonusValue = passiveEffects[passiveEffectKey as keyof PassiveEffects];

    return typeof bonusValue === 'number' ? bonusValue : 0;
  }

  /**
   * Get equipment bonuses from item properties
   */
  private getEquipmentPropertyBonus(
    entity: any,
    itemService: any,
    itemPropertyKey: string
  ): number {
    if (!entity.inventory || !entity.equipmentSlots) {
      return 0;
    }

    const equippedItems = this.getEquippedItems(entity);
    const itemIds = equippedItems.map(item => item.itemId);
    const itemDefinitions = itemService.getItemDefinitions(itemIds);

    let total = 0;
    for (const item of equippedItems) {
      const itemDef = itemDefinitions.get(item.itemId);
      if (itemDef?.properties?.[itemPropertyKey] !== undefined) {
        total += itemDef.properties[itemPropertyKey];
      }
    }

    return total;
  }

  /**
   * Get trait/quality/affix bonuses from effect system
   */
  private getEquipmentEffectBonus(
    entity: any,
    statName: BuffableStat | string,
    baseValue: number
  ): number {
    if (!entity.inventory || !entity.equipmentSlots) {
      return baseValue;
    }

    const contextMap: Record<string, EffectContext> = {
      'damage': EffectContext.COMBAT_DAMAGE,
      'armor': EffectContext.COMBAT_ARMOR,
      'evasion': EffectContext.COMBAT_EVASION,
      'critChance': EffectContext.COMBAT_CRIT_CHANCE,
      'attackSpeed': EffectContext.COMBAT_ATTACK_SPEED,
    };

    const effectContext = contextMap[statName as string];
    if (!effectContext) {
      return baseValue;
    }

    // Calculate current HP percentage for conditional effects
    const currentHP = entity.stats?.health?.current || 0;
    const maxHP = entity.maxHP || 1;
    const hpPercent = currentHP / maxHP;

    const traitEffects = effectEvaluator.evaluatePlayerEffects(
      entity,
      effectContext,
      { hpPercent, inCombat: true }
    );

    // Apply effect modifiers
    let total = baseValue + traitEffects.flatBonus;

    if (traitEffects.percentageBonus !== 0) {
      total = Math.floor(total * (1 + traitEffects.percentageBonus));
    }

    if (traitEffects.multiplier !== 1.0) {
      total = Math.floor(total * traitEffects.multiplier);
    }

    return total;
  }

  /**
   * Get buff/debuff modifiers for a stat
   */
  private getBuffCombatBonus(
    entity: any,
    itemService: any,
    player: any | undefined,
    statName: BuffableStat | string,
    baseValue: number
  ): number {
    if (!player?.activeCombat?.activeBuffs) {
      return baseValue;
    }

    const combatEntity = this.wrapEntity(entity, itemService);
    const target = combatEntity.getType();
    const modifiers = this.getActiveBuffModifiers(player, target, statName);

    let total = baseValue + modifiers.flat;

    if (modifiers.percentage !== 0) {
      total = Math.floor(total * (1 + modifiers.percentage));
    }

    return total;
  }

  /**
   * Calculate final combat stat value
   * Orchestrates smaller helper functions for better testability
   */
  private calculateCombatStat(
    entity: any,
    itemService: any,
    player: any | undefined,
    statName: BuffableStat | string,
    combatStatKey: string,
    passiveEffectKey: string,
    itemPropertyKey: string
  ): number {
    // 1. Get base stat
    let total = this.getBaseCombatStat(entity, combatStatKey);

    // 2. Add passive bonuses
    total += this.getPassiveCombatBonus(entity, passiveEffectKey);

    // 3. Add equipment property bonuses
    total += this.getEquipmentPropertyBonus(entity, itemService, itemPropertyKey);

    // 4. Apply equipment effect bonuses (traits/qualities/affixes)
    total = this.getEquipmentEffectBonus(entity, statName, total);

    // 5. Apply buff/debuff modifiers
    total = this.getBuffCombatBonus(entity, itemService, player, statName, total);

    return Math.max(0, total); // Ensure non-negative
  }

  /**
   * Get all equipped items for a player entity
   * Helper method to reduce duplication
   */
  private getEquippedItems(entity: any): any[] {
    if (!entity.inventory || !entity.equipmentSlots) {
      return [];
    }

    const equippedItems = [];
    for (const [slot, instanceId] of entity.equipmentSlots.entries()) {
      if (instanceId) {
        const item = entity.inventory.find((i: any) => i.instanceId === instanceId);
        if (item) {
          equippedItems.push(item);
        }
      }
    }

    return equippedItems;
  }

  /**
   * Calculate total armor from equipment and active buffs
   */
  calculateTotalArmor(entity: any, itemService: any, player?: any): number {
    return this.calculateCombatStat(
      entity,
      itemService,
      player,
      BuffableStat.ARMOR,
      'armor',
      'armorBonus',
      'armor'
    );
  }

  /**
   * Calculate total evasion from equipment and active buffs
   */
  calculateTotalEvasion(entity: any, itemService: any, player?: any): number {
    return this.calculateCombatStat(
      entity,
      itemService,
      player,
      BuffableStat.EVASION,
      'evasion',
      'evasionBonus',
      'evasion'
    );
  }

  /**
   * Calculate armor damage reduction (diminishing returns: 1000 armor = 50% reduction)
   */
  calculateArmorReduction(armor: number): number {
    // Formula: reduction = armor / (armor + ARMOR_SCALING_FACTOR)
    // Examples: 100 armor = 9%, 500 armor = 33%, 1000 armor = 50%, 2000 armor = 67%
    return armor / (armor + COMBAT_FORMULAS.ARMOR_SCALING_FACTOR);
  }

  /**
   * Calculate evasion chance (diminishing returns: 1000 evasion = 50% dodge)
   */
  calculateEvasionChance(evasion: number): number {
    // Formula: chance = evasion / (evasion + EVASION_SCALING_FACTOR)
    // Examples: 100 evasion = 9%, 500 evasion = 33%, 1000 evasion = 50%, 2000 evasion = 67%
    const chance = evasion / (evasion + COMBAT_FORMULAS.EVASION_SCALING_FACTOR);
    return Math.min(COMBAT_FORMULAS.EVASION_CAP, chance); // Cap at configured max dodge chance
  }

  /**
   * Get equipped weapon for an entity
   * Refactored to use ICombatEntity abstraction
   */
  getEquippedWeapon(entity: any, itemService: any): WeaponData | null {
    const combatEntity = this.wrapEntity(entity, itemService);
    return combatEntity.getWeapon();
  }

  /**
   * Calculate damage with skill/attribute scaling and buff modifiers
   */
  calculateDamage(
    attacker: any,
    defender: any,
    itemService: any,
    player: any,
    isAbility: boolean = false,
    abilityPower: number = 1.0,
    critBonus: number = 0
  ): any {
    const weapon = this.getEquippedWeapon(attacker, itemService);

    if (!weapon) {
      // Unarmed attack
      return {
        damage: 1,
        isCrit: false,
        isDodge: false,
        weaponName: 'Unarmed'
      };
    }

    // Roll base damage from weapon dice
    let baseDamage = this.rollDice(weapon.damageRoll);

    // Apply ability power multiplier
    if (isAbility) {
      baseDamage = Math.floor(baseDamage * abilityPower);
    }

    // Get skill level for scaling
    // For players, use active combat skill (context-dependent on equipment)
    // For monsters, use weapon's skillScalar
    const skillScalar = attacker.getActiveCombatSkill ? attacker.getActiveCombatSkill() : weapon.skillScalar;
    const skill = attacker.skills[skillScalar];
    const skillLevel = skill ? skill.level : 1;

    // Get main attribute level
    const mainAttr = skill ? skill.mainAttribute : 'strength';
    const attribute = attacker.attributes[mainAttr];
    const attrLevel = attribute ? attribute.level : 1;

    // Calculate skill scaling (diminishing returns: +1 die face per N levels, max bonus capped)
    // Level 1-9: 1d3, Level 10-19: 1d4, Level 20+: 1d5
    const skillBonus = Math.min(
      COMBAT_FORMULAS.SKILL_BONUS_MAX,
      Math.floor(skillLevel / COMBAT_FORMULAS.SKILL_BONUS_PER_LEVELS)
    );
    const attrBonus = Math.min(
      COMBAT_FORMULAS.ATTR_BONUS_MAX,
      Math.floor(attrLevel / COMBAT_FORMULAS.ATTR_BONUS_PER_LEVELS)
    );
    const totalLevelBonus = skillBonus + attrBonus;

    // Apply level scaling to damage (adds bonus to max damage)
    const scaledDamage = baseDamage + totalLevelBonus;

    // Get cached passive effects
    const passiveEffects = this.getPassiveEffects(attacker);

    // Check for critical hit
    let critChance = weapon.critChance + critBonus + passiveEffects.critChanceBonus;

    const isCrit = Math.random() < critChance;
    let finalDamage = scaledDamage;

    if (isCrit) {
      finalDamage = Math.floor(scaledDamage * COMBAT_FORMULAS.CRIT_MULTIPLIER);
    }

    // Apply always-active damage bonuses from passive abilities
    if (passiveEffects.damageBonus > 0) {
      finalDamage = Math.floor(finalDamage * (1 + passiveEffects.damageBonus));
    }

    // Apply conditional damage bonuses from passive abilities
    for (const conditionalBonus of passiveEffects.conditionalBonuses) {
      if (conditionalBonus.effect === 'damageBonus') {
        // Check trigger condition
        if (conditionalBonus.trigger === 'below_50_percent_hp') {
          // Use maxHP for players (dynamic from attributes), stats.health.max for monsters
          const maxHp = attacker.maxHP || attacker.stats.health.max;
          const hpPercent = attacker.stats.health.current / maxHp;
          if (hpPercent < COMBAT_FORMULAS.BATTLE_FRENZY_HP_THRESHOLD) {
            finalDamage = Math.floor(finalDamage * (1 + conditionalBonus.value));
          }
        }
        // Add more trigger conditions here as needed
      }
    }

    // Apply trait/quality/affix damage bonuses (players only)
    if (attacker.inventory && attacker.equipmentSlots) {
      const currentHP = attacker.stats?.health?.current || 0;
      const maxHP = attacker.maxHP || 1;
      const hpPercent = currentHP / maxHP;

      const traitEffects = effectEvaluator.evaluatePlayerEffects(
        attacker,
        EffectContext.COMBAT_DAMAGE,
        { hpPercent, inCombat: true }
      );

      // Apply flat damage bonus from traits
      finalDamage += traitEffects.flatBonus;

      // Apply percentage damage bonus from traits
      if (traitEffects.percentageBonus !== 0) {
        finalDamage = Math.floor(finalDamage * (1 + traitEffects.percentageBonus));
      }

      // Apply multiplier from traits
      if (traitEffects.multiplier !== 1.0) {
        finalDamage = Math.floor(finalDamage * traitEffects.multiplier);
      }
    }

    // Apply damage modifiers from active buffs
    if (player && player.activeCombat && player.activeCombat.activeBuffs) {
      const attackerTarget = attacker.monsterId ? 'monster' : 'player';
      const damageModifiers = this.getActiveBuffModifiers(player, attackerTarget, 'damage');

      // Apply flat damage modifiers
      finalDamage += damageModifiers.flat;

      // Apply percentage damage modifiers
      if (damageModifiers.percentage !== 0) {
        finalDamage = Math.floor(finalDamage * (1 + damageModifiers.percentage));
      }
    }

    // Check for dodge
    const defenderEvasion = this.calculateTotalEvasion(defender, itemService, player);
    const dodgeChance = this.calculateEvasionChance(defenderEvasion);
    const isDodge = Math.random() < dodgeChance;

    if (isDodge) {
      return {
        damage: 0,
        isCrit: false,
        isDodge: true,
        weaponName: weapon.name
      };
    }

    // Apply armor reduction
    const defenderArmor = this.calculateTotalArmor(defender, itemService, player);
    const armorReduction = this.calculateArmorReduction(defenderArmor);
    finalDamage = Math.floor(finalDamage * (1 - armorReduction));

    // Ensure at least minimum damage if not dodged
    finalDamage = Math.max(COMBAT_FORMULAS.MIN_DAMAGE, finalDamage);

    return {
      damage: finalDamage,
      isCrit,
      isDodge: false,
      weaponName: weapon.name
    };
  }

  /**
   * Apply a buff/debuff to an entity
   */
  applyBuff(player: any, abilityId: string, buffConfig: BuffApplication, turnCount: number): ActiveBuff {
    const buffId = uuidv4();

    const buff: ActiveBuff = {
      buffId,
      abilityId,
      name: buffConfig.name,
      description: buffConfig.description,
      target: buffConfig.target === 'self' ? 'player' : 'monster',
      appliedAt: turnCount,
      duration: buffConfig.duration,
      icon: buffConfig.icon,
      statModifiers: buffConfig.statModifiers,
      damageOverTime: buffConfig.damageOverTime,
      healOverTime: buffConfig.healOverTime,
      manaRegen: buffConfig.manaRegen,
      manaDrain: buffConfig.manaDrain,
      stackCount: 1
    };

    player.addActiveBuff(buff);

    return buff;
  }

  /**
   * Apply damage over time effect from a buff
   */
  private async applyDamageOverTime(
    buff: ActiveBuff,
    player: any,
    monsterInstance: any,
    result: { playerDamage: number; monsterDamage: number }
  ): Promise<void> {
    if (!buff.damageOverTime) return;

    if (buff.target === 'monster') {
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buff.damageOverTime);
      result.monsterDamage += buff.damageOverTime;
      playerCombatService.addCombatLog(player,`${buff.name} deals ${buff.damageOverTime} damage to ${monsterInstance.name}.`, 'debuff', buff.damageOverTime, 'monster');
    } else {
      await playerCombatService.takeDamage(player,buff.damageOverTime);
      result.playerDamage += buff.damageOverTime;
      playerCombatService.addCombatLog(player,`${buff.name} deals ${buff.damageOverTime} damage to you.`, 'debuff', buff.damageOverTime, 'player');
    }
  }

  /**
   * Apply heal over time effect from a buff
   */
  private applyHealOverTime(buff: ActiveBuff, player: any, monsterInstance: any): void {
    if (!buff.healOverTime) return;

    if (buff.target === 'player') {
      playerCombatService.heal(player,buff.healOverTime);
      playerCombatService.addCombatLog(player,`${buff.name} heals you for ${buff.healOverTime} HP.`, 'heal', buff.healOverTime, 'player');
    } else {
      monsterInstance.stats.health.current = Math.min(
        monsterInstance.stats.health.max,
        monsterInstance.stats.health.current + buff.healOverTime
      );
      playerCombatService.addCombatLog(player,`${buff.name} heals ${monsterInstance.name} for ${buff.healOverTime} HP.`, 'heal', buff.healOverTime, 'monster');
    }
  }

  /**
   * Apply mana regeneration effect from a buff
   */
  private applyManaRegen(buff: ActiveBuff, player: any): void {
    if (!buff.manaRegen) return;

    if (buff.target === 'player') {
      player.stats.mana.current = Math.min(
        player.maxMP, // Use dynamic MP from attributes
        player.stats.mana.current + buff.manaRegen
      );
      playerCombatService.addCombatLog(player,`${buff.name} restores ${buff.manaRegen} mana.`, 'buff');
    }
  }

  /**
   * Apply mana drain effect from a buff
   */
  private applyManaDrain(buff: ActiveBuff, player: any, monsterInstance: any): void {
    if (!buff.manaDrain) return;

    if (buff.target === 'monster') {
      monsterInstance.stats.mana.current = Math.max(0, monsterInstance.stats.mana.current - buff.manaDrain);
    } else {
      playerCombatService.useMana(player,buff.manaDrain);
    }
  }

  /**
   * Process buff/debuff tick effects (DoT, HoT, durations)
   * Refactored to use separate handler methods for each effect type
   */
  async processBuffTick(player: any, monsterInstance: any, tickingEntity?: 'player' | 'monster'): Promise<any> {
    if (!player.activeCombat || !player.activeCombat.activeBuffs) {
      return { playerDamage: 0, monsterDamage: 0, expiredBuffs: [] };
    }

    const result = {
      playerDamage: 0,
      monsterDamage: 0,
      expiredBuffs: [] as string[]
    };

    // Process each active buff
    for (const [buffId, buff] of player.activeCombat.activeBuffs.entries()) {
      // Only apply effects if this buff belongs to the entity whose turn it is
      // If tickingEntity is not specified, apply all buff effects (backward compatibility)
      const shouldApplyEffects = !tickingEntity || buff.target === tickingEntity;

      if (shouldApplyEffects) {
        // Apply all buff effects using dedicated handlers
        await this.applyDamageOverTime(buff, player, monsterInstance, result);
        this.applyHealOverTime(buff, player, monsterInstance);
        this.applyManaRegen(buff, player);
        this.applyManaDrain(buff, player, monsterInstance);
      }

      // Decrement duration only if this buff belongs to the entity whose turn it is
      // If tickingEntity is not specified, decrement all buffs (backward compatibility)
      const shouldDecrementDuration = !tickingEntity || buff.target === tickingEntity;

      if (shouldDecrementDuration) {
        buff.duration--;

        // Update the Map entry (Mongoose Maps need explicit .set() to detect changes)
        player.activeCombat.activeBuffs.set(buffId, buff);

        // Force Mongoose to detect the Map change for persistence
        player.markModified('activeCombat.activeBuffs');

        // Mark expired buffs
        if (buff.duration <= 0) {
          result.expiredBuffs.push(buffId);
          const targetName = buff.target === 'player' ? 'you' : monsterInstance.name;
          playerCombatService.addCombatLog(player,`${buff.name} fades from ${targetName}.`, 'system');
        }
      }
    }

    // Remove expired buffs
    for (const buffId of result.expiredBuffs) {
      player.removeActiveBuff(buffId);
    }

    return result;
  }

  /**
   * Get total stat modifier from active buffs
   */
  getActiveBuffModifiers(player: any, target: 'player' | 'monster', statName: BuffableStat | string): { flat: number; percentage: number } {
    if (!player.activeCombat || !player.activeCombat.activeBuffs) {
      return { flat: 0, percentage: 0 };
    }

    let totalFlat = 0;
    let totalPercentage = 0;

    for (const buff of player.activeCombat.activeBuffs.values()) {
      if (buff.target !== target || !buff.statModifiers) {
        continue;
      }

      for (const modifier of buff.statModifiers) {
        if (modifier.stat === statName) {
          if (modifier.type === ModifierType.FLAT || modifier.type === 'flat') {
            totalFlat += modifier.value;
          } else if (modifier.type === ModifierType.PERCENTAGE || modifier.type === 'percentage') {
            totalPercentage += modifier.value;
          }
        }
      }
    }

    // Return combined modifier (flat is added directly, percentage is multiplier)
    return { flat: totalFlat, percentage: totalPercentage };
  }

  /**
   * Initialize combat between player and monster
   */
  initializeCombat(player: any, monsterId: string, itemService: any): any {
    const monsterInstance = this.createMonsterInstance(monsterId);

    const now = new Date();

    // Get attack speeds
    const playerWeapon = this.getEquippedWeapon(player, itemService);
    const monsterWeapon = this.getEquippedWeapon(monsterInstance, itemService);

    const playerAttackSpeed = (playerWeapon ? playerWeapon.attackSpeed : 3.0) * COMBAT_FORMULAS.ATTACK_SPEED_TO_MS;
    const monsterAttackSpeed = (monsterWeapon ? monsterWeapon.attackSpeed : 3.0) * COMBAT_FORMULAS.ATTACK_SPEED_TO_MS;

    // Set up combat state
    player.activeCombat = {
      monsterId: monsterInstance.monsterId,
      monsterInstance: new Map(Object.entries(monsterInstance)),
      playerLastAttackTime: null,
      monsterLastAttackTime: null,
      playerNextAttackTime: new Date(now.getTime() + playerAttackSpeed),
      monsterNextAttackTime: new Date(now.getTime() + monsterAttackSpeed),
      turnCount: 0,
      abilityCooldowns: new Map(),
      activeBuffs: new Map(),
      combatLog: [],
      startTime: now
    };

    playerCombatService.addCombatLog(player,`Combat started with ${monsterInstance.name}!`, 'system');

    return monsterInstance;
  }

  /**
   * Start combat from activity handler (wrapper for initializeCombat)
   * Returns a result object suitable for socket responses
   */
  startCombat(player: any, monsterId: string, activityId: string, itemService: any): any {
    try {
      // Check if player already in combat
      if (playerCombatService.isInCombat(player)) {
        return {
          success: false,
          message: 'Already in combat'
        };
      }

      // Initialize combat
      const monsterInstance = this.initializeCombat(player, monsterId, itemService);

      // Store the activity ID that started this combat
      player.lastCombatActivityId = activityId;

      // Get player's available abilities based on active combat skill
      const activeCombatSkill = player.getActiveCombatSkill();
      const availableAbilities = this.getAbilitiesForWeapon(activeCombatSkill);

      return {
        success: true,
        message: `Combat started with ${monsterInstance.name}!`,
        monster: {
          monsterId: monsterInstance.monsterId,
          name: monsterInstance.name,
          level: monsterInstance.level,
          health: monsterInstance.stats.health,
          mana: monsterInstance.stats.mana
        },
        combat: {
          activityId: activityId,
          turnCount: player.activeCombat.turnCount,
          combatLog: player.activeCombat.combatLog,
          playerNextAttackTime: player.activeCombat.playerNextAttackTime,
          monsterNextAttackTime: player.activeCombat.monsterNextAttackTime,
          player: {
            currentHp: player.stats.health.current,
            maxHp: player.maxHP, // Use dynamic HP from attributes
            currentMana: player.stats.mana.current,
            maxMana: player.maxMP // Use dynamic MP from attributes
          },
          availableAbilities: availableAbilities.map((ability: Ability) => ({
            abilityId: ability.abilityId,
            name: ability.name,
            description: ability.description,
            manaCost: ability.manaCost,
            cooldown: ability.cooldown,
            powerMultiplier: ability.powerMultiplier,
            icon: ability.icon
          })),
          abilityCooldowns: {}
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to start combat'
      };
    }
  }

  /**
   * Use ability in combat
   */
  async useAbility(player: any, abilityId: string, itemService: any): Promise<any> {
    if (!playerCombatService.isInCombat(player)) {
      throw new Error('Player is not in combat');
    }

    const ability = this.getAbility(abilityId);
    if (!ability) {
      throw new Error(`Ability not found: ${abilityId}`);
    }

    // Validate skill level requirement
    if (ability.requirements && ability.requirements.minSkillLevel) {
      const activeCombatSkill = player.getActiveCombatSkill();
      const skillLevel = player.skills[activeCombatSkill]?.level || 1;
      if (skillLevel < ability.requirements.minSkillLevel) {
        throw new Error(`Insufficient ${activeCombatSkill} skill level. Need level ${ability.requirements.minSkillLevel}, have level ${skillLevel}`);
      }
    }

    // Validate weapon type requirement
    if (ability.requirements && ability.requirements.weaponTypes) {
      const activeCombatSkill = player.getActiveCombatSkill();
      if (!ability.requirements.weaponTypes.includes(activeCombatSkill)) {
        throw new Error(`Cannot use ${ability.name} with ${activeCombatSkill} combat style. Requires: ${ability.requirements.weaponTypes.join(', ')}`);
      }
    }

    // Check cooldown
    if (playerCombatService.isAbilityOnCooldown(player, abilityId)) {
      throw new Error(`Ability is on cooldown for ${playerCombatService.getAbilityCooldownRemaining(player, abilityId)} more turn(s)`);
    }

    // Check mana cost
    if (player.stats.mana.current < ability.manaCost) {
      throw new Error(`Insufficient mana. Need ${ability.manaCost}, have ${player.stats.mana.current}`);
    }

    // Use mana
    playerCombatService.useMana(player,ability.manaCost);

    // Award XP if ability has xpOnUse (for protection/support skills)
    if (ability.xpOnUse && ability.xpOnUse > 0) {
      await player.addSkillExperience('protection', ability.xpOnUse);
    }

    // Get monster instance
    const combat = player.activeCombat;
    const monsterInstance = Object.fromEntries(combat.monsterInstance);

    // Calculate ability damage
    const critBonus = ability.effects && ability.effects.damage?.multiplier ? 0 : 0;
    const attackResult = this.calculateDamage(
      player,
      monsterInstance,
      itemService,
      player,
      true,
      ability.powerMultiplier,
      critBonus
    );

    // Apply damage to monster
    monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - attackResult.damage);

    // Track damage dealt
    player.combatStats.totalDamageDealt += attackResult.damage;
    if (attackResult.isCrit) {
      player.combatStats.criticalHits++;
    }

    // Log ability use
    if (attackResult.isDodge) {
      playerCombatService.addCombatLog(player,`${ability.name} missed - ${monsterInstance.name} dodged!`, 'miss');
    } else if (attackResult.isCrit) {
      playerCombatService.addCombatLog(player,`CRITICAL ${ability.name}! You deal ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    } else {
      playerCombatService.addCombatLog(player,`You use ${ability.name} for ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    }

    // Set cooldown
    playerCombatService.setAbilityCooldown(player,abilityId, ability.cooldown);

    // Increment turn counter (using an ability counts as a turn)
    combat.turnCount++;

    // Process buff/debuff tick effects (DoT, HoT, durations) BEFORE applying new buffs
    // Only decrement player buffs since the player is using the ability
    const buffTickResults = await this.processBuffTick(player, monsterInstance, 'player');

    // Apply DoT/HoT damage from buffs
    if (buffTickResults.playerDamage > 0) {
      await playerCombatService.takeDamage(player,buffTickResults.playerDamage);
    }
    if (buffTickResults.monsterDamage > 0) {
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buffTickResults.monsterDamage);
    }

    // Apply buff/debuff if ability has one
    let appliedBuff: ActiveBuff | null = null;
    if (ability.effects && ability.effects.applyBuff) {
      appliedBuff = this.applyBuff(player, abilityId, ability.effects.applyBuff, combat.turnCount);
      const targetName = appliedBuff.target === 'player' ? 'you' : monsterInstance.name;
      playerCombatService.addCombatLog(player,`${appliedBuff.name} applied to ${targetName}!`, appliedBuff.target === 'player' ? 'buff' : 'debuff');
    }

    // Update monster instance
    combat.monsterInstance = new Map(Object.entries(monsterInstance));

    // Check if monster is defeated
    const monsterDefeated = monsterInstance.stats.health.current <= 0;
    if (monsterDefeated) {
      playerCombatService.addCombatLog(player,`You defeated ${monsterInstance.name}!`, 'system');
    }

    return {
      damage: attackResult.damage,
      isCrit: attackResult.isCrit,
      isDodge: attackResult.isDodge,
      monsterDefeated,
      ability: ability.name
    };
  }

  /**
   * End combat and award rewards
   */
  async awardCombatRewards(player: any, victory: boolean, itemService: any, dropTableService: any): Promise<any> {
    if (!playerCombatService.isInCombat(player)) {
      throw new Error('Player is not in combat');
    }

    const rewardProcessor = require('./rewardProcessor').default;

    const combat = player.activeCombat;
    const monsterInstance = Object.fromEntries(combat.monsterInstance);
    const monsterDef = this.getMonster(monsterInstance.monsterId);

    const rewards: any = {
      gold: 0,
      experience: 0,
      items: [],
      victory
    };

    if (victory && monsterDef) {
      // Calculate gold amount
      const goldAmount = Math.floor(
        Math.random() * (monsterDef.goldDrop.max - monsterDef.goldDrop.min + 1) + monsterDef.goldDrop.min
      );

      // Roll loot from drop tables
      const droppedItems = dropTableService.rollMultipleDropTables(monsterDef.lootTables);

      // Get active combat skill for XP
      const activeCombatSkill = player.getActiveCombatSkill();

      // Process rewards using centralized reward processor
      const result = await rewardProcessor.processRewardsWithQuests(
        player,
        {
          experience: { [activeCombatSkill]: monsterDef.experience },
          items: droppedItems,
          gold: goldAmount
        },
        {
          monsterId: monsterInstance.monsterId
        }
      );

      // Build response format expected by handler
      rewards.gold = result.goldAdded;
      rewards.experience = monsterDef.experience;
      rewards.items = result.itemsAdded;

      // Extract skill result for backward compatibility with handler
      if (result.xpRewards[activeCombatSkill]) {
        rewards.skillResult = result.xpRewards[activeCombatSkill];
      }

      // Update combat stats
      player.combatStats.monstersDefeated++;

      playerCombatService.addCombatLog(player,`Victory! Earned ${goldAmount} gold and ${monsterDef.experience} XP.`, 'system');
    } else {
      // Player defeated
      player.combatStats.deaths++;

      // Drop all gold
      const goldLost = player.gold;
      player.gold = 0;
      rewards.goldLost = goldLost;

      playerCombatService.addCombatLog(player,`Defeated! Lost ${goldLost} gold.`, 'system');

      // Restore player to full health (using dynamic HP from attributes)
      player.stats.health.current = player.maxHP;
    }

    // Clear combat state
    player.clearCombat();

    // Player already saved by rewardProcessor in victory case
    if (!victory) {
      await player.save();
    }

    return rewards;
  }

  /**
   * Apply a buff from a consumable (potion trait effect)
   */
  applyPotionBuff(player: any, buffEffect: any, turnCount: number): ActiveBuff {
    const buffId = uuidv4();

    const statModifier: StatModifier = {
      stat: buffEffect.stat as BuffableStat,
      value: buffEffect.value,
      type: buffEffect.isPercentage ? ModifierType.PERCENTAGE : ModifierType.FLAT
    };

    const buff: ActiveBuff = {
      buffId,
      abilityId: `potion_${buffEffect.traitId}`,
      name: `${buffEffect.traitName} Buff`,
      description: `${buffEffect.isPercentage ? '+' + (buffEffect.value * 100) + '%' : '+' + buffEffect.value} ${buffEffect.stat}`,
      target: 'player',
      appliedAt: turnCount,
      duration: Math.ceil(buffEffect.duration / 3), // Convert seconds to turns (approx 3s per turn)
      statModifiers: [statModifier],
      stackCount: 1
    };

    player.addActiveBuff(buff);
    return buff;
  }

  /**
   * Apply a Health-over-Time effect from a consumable (potion trait effect)
   */
  applyPotionHoT(player: any, hotEffect: any, turnCount: number): ActiveBuff {
    const buffId = uuidv4();

    const buff: ActiveBuff = {
      buffId,
      abilityId: `potion_${hotEffect.traitId}`,
      name: `${hotEffect.traitName} Regeneration`,
      description: `+${hotEffect.healPerTick} HP per turn for ${hotEffect.ticks} turns`,
      target: 'player',
      appliedAt: turnCount,
      duration: hotEffect.ticks,
      healOverTime: hotEffect.healPerTick,
      stackCount: 1
    };

    player.addActiveBuff(buff);
    return buff;
  }

  /**
   * Use a consumable item outside of combat
   * Converts HoT effects to instant healing, applies buffs as instant stat boosts
   */
  useConsumableOutOfCombat(player: any, itemInstance: any, itemService: any): any {
    const effects = itemService.getConsumableEffects(itemInstance);
    if (!effects) {
      throw new Error('Invalid consumable item');
    }

    let totalHealing = effects.healthRestore || 0;
    let totalManaRestore = effects.manaRestore || 0;

    // Convert HoT traits to instant healing
    for (const hot of effects.hots) {
      const hotHealing = hot.healPerTick * hot.ticks;
      totalHealing += hotHealing;
    }

    // Apply healing
    const beforeHealth = player.stats.health.current;
    if (totalHealing > 0) {
      playerCombatService.heal(player,totalHealing);
    }
    const actualHealing = player.stats.health.current - beforeHealth;

    // Apply mana restoration
    const beforeMana = player.stats.mana.current;
    if (totalManaRestore > 0) {
      player.restoreMana(totalManaRestore);
    }
    const actualManaRestore = player.stats.mana.current - beforeMana;

    // Note: Buff effects from traits are ignored outside combat
    // They only apply during active combat encounters

    return {
      healthRestored: actualHealing,
      manaRestored: actualManaRestore,
      totalPotentialHealing: totalHealing,
      convertedFromHoT: totalHealing - (effects.healthRestore || 0)
    };
  }

  /**
   * Calculate expected damage range for an ability (for tooltip display)
   * Returns min and max damage based on weapon dice, skill/attribute bonuses, and ability multiplier
   */
  calculateAbilityDamageRange(player: any, ability: Ability, itemService: any): { min: number; max: number } | null {
    if (!ability.effects?.damage) return null;

    const weapon = this.getEquippedWeapon(player, itemService);
    if (!weapon) {
      return { min: 0, max: 0 }; // No weapon equipped
    }

    // Parse weapon damage dice (e.g., "1d6" -> numDice: 1, numFaces: 6)
    const match = weapon.damageRoll.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return null;

    const numDice = parseInt(match[1]);
    const numFaces = parseInt(match[2]);
    const diceModifier = match[3] ? parseInt(match[3]) : 0;

    // Calculate base min/max from dice
    const baseMin = numDice + diceModifier; // Minimum roll (all 1s)
    const baseMax = numDice * numFaces + diceModifier; // Maximum roll (all max)

    // Apply ability multiplier
    const multiplier = ability.effects.damage.multiplier;
    let min = Math.floor(baseMin * multiplier);
    let max = Math.floor(baseMax * multiplier);

    // Get skill level for scaling
    const skillScalar = weapon.skillScalar;
    const skill = player.skills[skillScalar];
    const skillLevel = skill ? skill.level : 1;

    // Get main attribute level
    const mainAttr = skill ? skill.mainAttribute : 'strength';
    const attribute = player.attributes[mainAttr];
    const attrLevel = attribute ? attribute.level : 1;

    // Calculate level bonuses (same as calculateDamage)
    const skillBonus = Math.min(
      COMBAT_FORMULAS.SKILL_BONUS_MAX,
      Math.floor(skillLevel / COMBAT_FORMULAS.SKILL_BONUS_PER_LEVELS)
    );
    const attrBonus = Math.min(
      COMBAT_FORMULAS.ATTR_BONUS_MAX,
      Math.floor(attrLevel / COMBAT_FORMULAS.ATTR_BONUS_PER_LEVELS)
    );
    const totalLevelBonus = skillBonus + attrBonus;

    // Add level bonus to range
    min += totalLevelBonus;
    max += totalLevelBonus;

    // Apply trait/quality bonuses from equipment
    const currentHP = player.stats?.health?.current || 0;
    const maxHP = player.maxHP || 1;
    const hpPercent = currentHP / maxHP;

    const traitEffects = effectEvaluator.evaluatePlayerEffects(
      player,
      EffectContext.COMBAT_DAMAGE,
      { hpPercent, inCombat: true }
    );

    // Apply flat damage bonus
    min += traitEffects.flatBonus;
    max += traitEffects.flatBonus;

    // Apply percentage damage bonus
    if (traitEffects.percentageBonus !== 0) {
      min = Math.floor(min * (1 + traitEffects.percentageBonus));
      max = Math.floor(max * (1 + traitEffects.percentageBonus));
    }

    // Ensure minimum damage
    min = Math.max(COMBAT_FORMULAS.MIN_DAMAGE, min);
    max = Math.max(COMBAT_FORMULAS.MIN_DAMAGE, max);

    return { min, max };
  }

  /**
   * Generate effect explanations for an ability (for tooltip display)
   * Returns array of human-readable effect descriptions
   */
  generateAbilityEffectExplanations(ability: Ability): string[] {
    const explanations: string[] = [];

    if (!ability.effects) return explanations;

    // Handle applyBuff effects (buffs, debuffs, DoTs, HoTs)
    if (ability.effects.applyBuff) {
      const buff = ability.effects.applyBuff;
      const target = buff.target === 'self' ? 'you' : 'the enemy';
      const buffType = buff.target === 'self' ? 'Buff' : 'Debuff';

      // Damage over time
      if (buff.damageOverTime) {
        const totalDamage = buff.damageOverTime * buff.duration;
        explanations.push(
          `${buffType}: ${buff.name} - ${buff.damageOverTime} damage/turn × ${buff.duration} turns = ${totalDamage} total damage`
        );
      }

      // Healing over time
      if (buff.healOverTime) {
        const totalHealing = buff.healOverTime * buff.duration;
        explanations.push(
          `${buffType}: ${buff.name} - ${buff.healOverTime} healing/turn × ${buff.duration} turns = ${totalHealing} total healing`
        );
      }

      // Mana regeneration
      if (buff.manaRegen) {
        const totalMana = buff.manaRegen * buff.duration;
        explanations.push(
          `${buffType}: ${buff.name} - ${buff.manaRegen} mana/turn × ${buff.duration} turns = ${totalMana} total mana`
        );
      }

      // Mana drain
      if (buff.manaDrain) {
        const totalDrain = buff.manaDrain * buff.duration;
        explanations.push(
          `${buffType}: ${buff.name} - ${buff.manaDrain} mana drain/turn × ${buff.duration} turns = ${totalDrain} total drain`
        );
      }

      // Stat modifiers
      if (buff.statModifiers && buff.statModifiers.length > 0) {
        const effectParts: string[] = [];
        for (const mod of buff.statModifiers) {
          const statName = this.formatStatName(mod.stat);
          if (mod.type === ModifierType.FLAT) {
            effectParts.push(`${mod.value >= 0 ? '+' : ''}${mod.value} ${statName}`);
          } else if (mod.type === ModifierType.PERCENTAGE) {
            const percent = Math.round(mod.value * 100);
            effectParts.push(`${percent >= 0 ? '+' : ''}${percent}% ${statName}`);
          } else if (mod.type === ModifierType.MULTIPLIER) {
            effectParts.push(`${mod.value}x ${statName}`);
          }
        }

        if (effectParts.length > 0) {
          const effectList = effectParts.join(', ');
          explanations.push(
            `${buffType}: ${buff.name} - ${effectList} for ${buff.duration} turns on ${target}`
          );
        }
      }
    }

    // Critical chance bonus
    if (ability.effects.critChanceBonus) {
      const bonus = Math.round(ability.effects.critChanceBonus * 100);
      explanations.push(`+${bonus}% critical hit chance for this attack`);
    }

    return explanations;
  }

  /**
   * Format stat name for display
   */
  private formatStatName(stat: BuffableStat | string): string {
    const formatted: Record<string, string> = {
      [BuffableStat.ARMOR]: 'Armor',
      [BuffableStat.EVASION]: 'Evasion',
      [BuffableStat.DAMAGE]: 'Damage',
      [BuffableStat.CRIT_CHANCE]: 'Crit Chance',
      [BuffableStat.ATTACK_SPEED]: 'Attack Speed',
      [BuffableStat.HEALTH_REGEN]: 'Health Regen',
      [BuffableStat.MANA_REGEN]: 'Mana Regen',
      [BuffableStat.RESISTANCE]: 'Resistance',
      [BuffableStat.LIFESTEAL]: 'Lifesteal'
    };

    return formatted[stat] || stat;
  }
}

export default new CombatService();
