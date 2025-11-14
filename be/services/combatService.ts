import { v4 as uuidv4 } from 'uuid';
import {
  Monster,
  Ability,
  MonsterInstance,
  DamageResult,
  AttackResult,
  ActiveBuff,
  BuffApplication,
  StatModifier
} from '@shared/types';
import { MonsterRegistry } from '../data/monsters/MonsterRegistry';
import { AbilityRegistry } from '../data/abilities/AbilityRegistry';

class CombatService {
  constructor() {
    console.log(`Loaded ${MonsterRegistry.size} monsters from MonsterRegistry (compile-time)`);
    console.log(`Loaded ${AbilityRegistry.size} abilities from AbilityRegistry (compile-time)`);
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

    return Math.max(1, total); // Minimum 1 damage
  }

  /**
   * Calculate total armor from equipment and active buffs
   */
  calculateTotalArmor(entity: any, itemService: any, player?: any): number {
    let totalArmor = 0;

    // Add base armor from combatStats
    if (entity.combatStats && entity.combatStats.armor) {
      totalArmor += entity.combatStats.armor;
    }

    // Add armor from passive abilities
    if (entity.passiveAbilities) {
      for (const ability of entity.passiveAbilities) {
        if (ability.effects && ability.effects.armorBonus) {
          totalArmor += ability.effects.armorBonus;
        }
      }
    }

    // For players, sum armor from all equipped items
    if (entity.inventory && entity.equipmentSlots) {
      const equippedItems = [];
      for (const [slot, instanceId] of entity.equipmentSlots.entries()) {
        if (instanceId) {
          const item = entity.inventory.find((i: any) => i.instanceId === instanceId);
          if (item) {
            equippedItems.push(item);
          }
        }
      }

      for (const item of equippedItems) {
        const itemDef = itemService.getItemDefinition(item.itemId);
        if (itemDef && itemDef.properties && itemDef.properties.armor) {
          totalArmor += itemDef.properties.armor;
        }
      }
    }

    // Add armor from active buffs/debuffs
    if (player && player.activeCombat && player.activeCombat.activeBuffs) {
      const target = entity.monsterId ? 'monster' : 'player';
      const modifiers = this.getActiveBuffModifiers(player, target, 'armor');

      // Apply flat modifiers
      totalArmor += modifiers.flat;

      // Apply percentage modifiers
      if (modifiers.percentage !== 0) {
        totalArmor = Math.floor(totalArmor * (1 + modifiers.percentage));
      }
    }

    return Math.max(0, totalArmor); // Ensure non-negative
  }

  /**
   * Calculate total evasion from equipment and active buffs
   */
  calculateTotalEvasion(entity: any, itemService: any, player?: any): number {
    let totalEvasion = 0;

    // Add base evasion from combatStats
    if (entity.combatStats && entity.combatStats.evasion) {
      totalEvasion += entity.combatStats.evasion;
    }

    // Add evasion from passive abilities
    if (entity.passiveAbilities) {
      for (const ability of entity.passiveAbilities) {
        if (ability.effects && ability.effects.evasionBonus) {
          totalEvasion += ability.effects.evasionBonus;
        }
      }
    }

    // For players, sum evasion from all equipped items
    if (entity.inventory && entity.equipmentSlots) {
      const equippedItems = [];
      for (const [slot, instanceId] of entity.equipmentSlots.entries()) {
        if (instanceId) {
          const item = entity.inventory.find((i: any) => i.instanceId === instanceId);
          if (item) {
            equippedItems.push(item);
          }
        }
      }

      for (const item of equippedItems) {
        const itemDef = itemService.getItemDefinition(item.itemId);
        if (itemDef && itemDef.properties && itemDef.properties.evasion) {
          totalEvasion += itemDef.properties.evasion;
        }
      }
    }

    // Add evasion from active buffs/debuffs
    if (player && player.activeCombat && player.activeCombat.activeBuffs) {
      const target = entity.monsterId ? 'monster' : 'player';
      const modifiers = this.getActiveBuffModifiers(player, target, 'evasion');

      // Apply flat modifiers
      totalEvasion += modifiers.flat;

      // Apply percentage modifiers
      if (modifiers.percentage !== 0) {
        totalEvasion = Math.floor(totalEvasion * (1 + modifiers.percentage));
      }
    }

    return Math.max(0, totalEvasion); // Ensure non-negative
  }

  /**
   * Calculate armor damage reduction (diminishing returns: 1000 armor = 50% reduction)
   */
  calculateArmorReduction(armor: number): number {
    // Formula: reduction = armor / (armor + 1000)
    // Examples: 100 armor = 9%, 500 armor = 33%, 1000 armor = 50%, 2000 armor = 67%
    return armor / (armor + 1000);
  }

  /**
   * Calculate evasion chance (diminishing returns: 1000 evasion = 50% dodge)
   */
  calculateEvasionChance(evasion: number): number {
    // Formula: chance = evasion / (evasion + 1000)
    // Examples: 100 evasion = 9%, 500 evasion = 33%, 1000 evasion = 50%, 2000 evasion = 67%
    const chance = evasion / (evasion + 1000);
    return Math.min(0.75, chance); // Cap at 75% dodge chance
  }

  /**
   * Get equipped weapon for an entity
   */
  getEquippedWeapon(entity: any, itemService: any): any {
    // For monsters, return equipment.weapon or equipment.natural
    if (entity.monsterId) {
      if (entity.equipment) {
        return entity.equipment.weapon || entity.equipment.natural;
      }
      return null;
    }

    // For players, get mainHand item
    if (!entity.equipmentSlots || !entity.inventory) {
      return null;
    }

    const mainHandId = entity.equipmentSlots.get ?
      entity.equipmentSlots.get('mainHand') :
      entity.equipmentSlots.mainHand;

    if (!mainHandId) {
      return null;
    }

    const item = entity.inventory.find((i: any) => i.instanceId === mainHandId);
    if (!item) {
      return null;
    }

    const itemDef = itemService.getItemDefinition(item.itemId);
    if (!itemDef || !itemDef.properties) {
      return null;
    }

    return {
      name: itemDef.name,
      damageRoll: itemDef.properties.damageRoll || '1d2',
      attackSpeed: itemDef.properties.attackSpeed || 3.0,
      critChance: itemDef.properties.critChance || 0.05,
      skillScalar: itemDef.properties.skillScalar || 'oneHanded'
    };
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
    const skillScalar = weapon.skillScalar;
    const skill = attacker.skills[skillScalar];
    const skillLevel = skill ? skill.level : 1;

    // Get main attribute level
    const mainAttr = skill ? skill.mainAttribute : 'strength';
    const attribute = attacker.attributes[mainAttr];
    const attrLevel = attribute ? attribute.level : 1;

    // Calculate skill scaling (diminishing returns: +1 die face per 10 levels, max +2)
    // Level 1-9: 1d3, Level 10-19: 1d4, Level 20+: 1d5
    const skillBonus = Math.min(2, Math.floor(skillLevel / 10));
    const attrBonus = Math.min(2, Math.floor(attrLevel / 10));
    const totalLevelBonus = skillBonus + attrBonus;

    // Apply level scaling to damage (adds bonus to max damage)
    const scaledDamage = baseDamage + totalLevelBonus;

    // Check for critical hit
    let critChance = weapon.critChance + critBonus;

    // Add crit chance from passive abilities
    if (attacker.passiveAbilities) {
      for (const ability of attacker.passiveAbilities) {
        if (ability.effects && ability.effects.critChanceBonus) {
          critChance += ability.effects.critChanceBonus;
        }
      }
    }

    const isCrit = Math.random() < critChance;
    let finalDamage = scaledDamage;

    if (isCrit) {
      finalDamage = Math.floor(scaledDamage * 2); // 2x damage on crit
    }

    // Apply damage bonus from passive abilities (e.g., battle frenzy)
    if (attacker.passiveAbilities) {
      for (const ability of attacker.passiveAbilities) {
        if (ability.effects && ability.effects.damageBonus) {
          // Check trigger condition
          if (ability.effects.trigger === 'below_50_percent_hp') {
            const hpPercent = attacker.stats.health.current / attacker.stats.health.max;
            if (hpPercent < 0.5) {
              finalDamage = Math.floor(finalDamage * (1 + ability.effects.damageBonus));
            }
          } else {
            // Always active
            finalDamage = Math.floor(finalDamage * (1 + ability.effects.damageBonus));
          }
        }
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

    // Ensure at least 1 damage if not dodged
    finalDamage = Math.max(1, finalDamage);

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
   * Process buff/debuff tick effects (DoT, HoT, durations)
   */
  processBuffTick(player: any, monsterInstance: any, tickingEntity?: 'player' | 'monster'): any {
    if (!player.activeCombat || !player.activeCombat.activeBuffs) {
      return { playerDamage: 0, monsterDamage: 0, expiredBuffs: [] };
    }

    let playerDamage = 0;
    let monsterDamage = 0;
    const expiredBuffs: string[] = [];

    // Process each active buff
    for (const [buffId, buff] of player.activeCombat.activeBuffs.entries()) {
      // Apply damage over time
      if (buff.damageOverTime) {
        if (buff.target === 'monster') {
          monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buff.damageOverTime);
          monsterDamage += buff.damageOverTime;
          player.addCombatLog(`${buff.name} deals ${buff.damageOverTime} damage to ${monsterInstance.name}.`, 'debuff', buff.damageOverTime, 'monster');
        } else {
          const damageDealt = player.takeDamage(buff.damageOverTime);
          playerDamage += buff.damageOverTime;
          player.addCombatLog(`${buff.name} deals ${buff.damageOverTime} damage to you.`, 'debuff', buff.damageOverTime, 'player');
        }
      }

      // Apply heal over time
      if (buff.healOverTime) {
        if (buff.target === 'player') {
          player.heal(buff.healOverTime);
          player.addCombatLog(`${buff.name} heals you for ${buff.healOverTime} HP.`, 'buff', buff.healOverTime, 'player');
        } else {
          monsterInstance.stats.health.current = Math.min(
            monsterInstance.stats.health.max,
            monsterInstance.stats.health.current + buff.healOverTime
          );
          player.addCombatLog(`${buff.name} heals ${monsterInstance.name} for ${buff.healOverTime} HP.`, 'buff', buff.healOverTime, 'monster');
        }
      }

      // Apply mana regen
      if (buff.manaRegen) {
        if (buff.target === 'player') {
          player.stats.mana.current = Math.min(
            player.stats.mana.max,
            player.stats.mana.current + buff.manaRegen
          );
          player.addCombatLog(`${buff.name} restores ${buff.manaRegen} mana.`, 'buff');
        }
      }

      // Apply mana drain
      if (buff.manaDrain) {
        if (buff.target === 'monster') {
          monsterInstance.stats.mana.current = Math.max(0, monsterInstance.stats.mana.current - buff.manaDrain);
        } else {
          player.useMana(buff.manaDrain);
        }
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
          expiredBuffs.push(buffId);
          const targetName = buff.target === 'player' ? 'you' : monsterInstance.name;
          player.addCombatLog(`${buff.name} fades from ${targetName}.`, 'system');
        }
      }
    }

    // Remove expired buffs
    for (const buffId of expiredBuffs) {
      player.removeActiveBuff(buffId);
    }

    return {
      playerDamage,
      monsterDamage,
      expiredBuffs
    };
  }

  /**
   * Get total stat modifier from active buffs
   */
  getActiveBuffModifiers(player: any, target: 'player' | 'monster', statName: string): { flat: number; percentage: number } {
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
          if (modifier.type === 'flat') {
            totalFlat += modifier.value;
          } else if (modifier.type === 'percentage') {
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

    const playerAttackSpeed = (playerWeapon ? playerWeapon.attackSpeed : 3.0) * 1000; // Convert to ms
    const monsterAttackSpeed = (monsterWeapon ? monsterWeapon.attackSpeed : 3.0) * 1000;

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

    player.addCombatLog(`Combat started with ${monsterInstance.name}!`, 'system');

    return monsterInstance;
  }

  /**
   * Start combat from activity handler (wrapper for initializeCombat)
   * Returns a result object suitable for socket responses
   */
  startCombat(player: any, monsterId: string, activityId: string, itemService: any): any {
    try {
      // Check if player already in combat
      if (player.isInCombat()) {
        return {
          success: false,
          message: 'Already in combat'
        };
      }

      // Initialize combat
      const monsterInstance = this.initializeCombat(player, monsterId, itemService);

      // Store the activity ID that started this combat
      player.lastCombatActivityId = activityId;

      // Get player's available abilities based on equipped weapon
      const weapon = this.getEquippedWeapon(player, itemService);
      const availableAbilities = weapon ? this.getAbilitiesForWeapon(weapon.skillScalar) : [];

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
            maxHp: player.stats.health.max,
            currentMana: player.stats.mana.current,
            maxMana: player.stats.mana.max
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
  useAbility(player: any, abilityId: string, itemService: any): any {
    if (!player.isInCombat()) {
      throw new Error('Player is not in combat');
    }

    const ability = this.getAbility(abilityId);
    if (!ability) {
      throw new Error(`Ability not found: ${abilityId}`);
    }

    // Check cooldown
    if (player.isAbilityOnCooldown(abilityId)) {
      throw new Error(`Ability is on cooldown for ${player.getAbilityCooldownRemaining(abilityId)} more turn(s)`);
    }

    // Check mana cost
    if (player.stats.mana.current < ability.manaCost) {
      throw new Error(`Insufficient mana. Need ${ability.manaCost}, have ${player.stats.mana.current}`);
    }

    // Use mana
    player.useMana(ability.manaCost);

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
      player.addCombatLog(`${ability.name} missed - ${monsterInstance.name} dodged!`, 'miss');
    } else if (attackResult.isCrit) {
      player.addCombatLog(`CRITICAL ${ability.name}! You deal ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    } else {
      player.addCombatLog(`You use ${ability.name} for ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    }

    // Set cooldown
    player.setAbilityCooldown(abilityId, ability.cooldown);

    // Increment turn counter (using an ability counts as a turn)
    combat.turnCount++;

    // Process buff/debuff tick effects (DoT, HoT, durations) BEFORE applying new buffs
    // Only decrement player buffs since the player is using the ability
    const buffTickResults = this.processBuffTick(player, monsterInstance, 'player');

    // Apply DoT/HoT damage from buffs
    if (buffTickResults.playerDamage > 0) {
      player.takeDamage(buffTickResults.playerDamage);
    }
    if (buffTickResults.monsterDamage > 0) {
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buffTickResults.monsterDamage);
    }

    // Apply buff/debuff if ability has one
    let appliedBuff: ActiveBuff | null = null;
    if (ability.effects && ability.effects.applyBuff) {
      appliedBuff = this.applyBuff(player, abilityId, ability.effects.applyBuff, combat.turnCount);
      const targetName = appliedBuff.target === 'player' ? 'you' : monsterInstance.name;
      player.addCombatLog(`${appliedBuff.name} applied to ${targetName}!`, appliedBuff.target === 'player' ? 'buff' : 'debuff');
    }

    // Update monster instance
    combat.monsterInstance = new Map(Object.entries(monsterInstance));

    // Check if monster is defeated
    const monsterDefeated = monsterInstance.stats.health.current <= 0;
    if (monsterDefeated) {
      player.addCombatLog(`You defeated ${monsterInstance.name}!`, 'system');
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
    if (!player.isInCombat()) {
      throw new Error('Player is not in combat');
    }

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
      // Award gold
      const goldAmount = Math.floor(
        Math.random() * (monsterDef.goldDrop.max - monsterDef.goldDrop.min + 1) + monsterDef.goldDrop.min
      );
      player.addGold(goldAmount);
      rewards.gold = goldAmount;

      // Award XP (use weapon's skill scalar)
      const weapon = this.getEquippedWeapon(player, itemService);
      const skillScalar = weapon ? weapon.skillScalar : 'oneHanded';
      const xpResult = await player.addSkillExperience(skillScalar, monsterDef.experience);
      rewards.experience = monsterDef.experience;
      rewards.skillResult = xpResult;

      // Award loot from drop tables
      const droppedItems = dropTableService.rollMultipleDropTables(monsterDef.lootTables);
      for (const dropResult of droppedItems) {
        // Generate random qualities and traits for combat drops
        const qualities = itemService.generateRandomQualities(dropResult.itemId);
        const traits = itemService.generateRandomTraits(dropResult.itemId);

        // Use itemService to create proper item instances with Maps
        const itemInstance = itemService.createItemInstance(
          dropResult.itemId,
          dropResult.quantity,
          qualities,
          traits
        );

        player.addItem(itemInstance);
        rewards.items.push(itemInstance);
      }

      // Update combat stats
      player.combatStats.monstersDefeated++;

      player.addCombatLog(`Victory! Earned ${goldAmount} gold and ${monsterDef.experience} XP.`, 'system');
    } else {
      // Player defeated
      player.combatStats.deaths++;

      // Drop all gold
      const goldLost = player.gold;
      player.gold = 0;
      rewards.goldLost = goldLost;

      player.addCombatLog(`Defeated! Lost ${goldLost} gold.`, 'system');

      // Restore player to full health
      player.stats.health.current = player.stats.health.max;
    }

    // Clear combat state
    player.clearCombat();

    await player.save();

    return rewards;
  }
}

export default new CombatService();
