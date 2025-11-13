import { v4 as uuidv4 } from 'uuid';
import {
  Monster,
  Ability,
  MonsterInstance,
  DamageResult,
  AttackResult
} from '../types';
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
   * Calculate total armor from equipment
   */
  calculateTotalArmor(entity: any, itemService: any): number {
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

    return totalArmor;
  }

  /**
   * Calculate total evasion from equipment
   */
  calculateTotalEvasion(entity: any, itemService: any): number {
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

    return totalEvasion;
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
   * Calculate damage with skill/attribute scaling
   */
  calculateDamage(
    attacker: any,
    defender: any,
    itemService: any,
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

    // Check for dodge
    const defenderEvasion = this.calculateTotalEvasion(defender, itemService);
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
    const defenderArmor = this.calculateTotalArmor(defender, itemService);
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
   * Process combat turn (auto-attacks)
   */
  processCombatTurn(player: any, itemService: any, username?: string): any {
    if (!player.isInCombat()) {
      throw new Error('Player is not in combat');
    }

    const now = new Date();
    const combat = player.activeCombat;

    // Convert monster instance Map back to object
    const monsterInstance = Object.fromEntries(combat.monsterInstance);

    const results = {
      playerAttacked: false,
      monsterAttacked: false,
      playerDamage: 0,
      monsterDamage: 0,
      playerDefeated: false,
      monsterDefeated: false,
      combatLog: []
    };

    // Check if player's attack is ready
    if (combat.playerNextAttackTime && now >= combat.playerNextAttackTime) {
      const attackResult = this.calculateDamage(player, monsterInstance, itemService);

      // Apply damage to monster
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - attackResult.damage);

      // Update combat state
      combat.playerLastAttackTime = now;
      const playerWeapon = this.getEquippedWeapon(player, itemService);
      const playerAttackSpeed = (playerWeapon ? playerWeapon.attackSpeed : 3.0) * 1000;
      combat.playerNextAttackTime = new Date(now.getTime() + playerAttackSpeed);
      combat.turnCount++;

      // Track damage dealt
      player.combatStats.totalDamageDealt += attackResult.damage;
      if (attackResult.isCrit) {
        player.combatStats.criticalHits++;
      }

      // Log attack
      const playerName = username || 'You';
      if (attackResult.isDodge) {
        player.addCombatLog(`${playerName}'s attack missed - ${monsterInstance.name} dodged!`, 'miss');
      } else if (attackResult.isCrit) {
        player.addCombatLog(`CRITICAL HIT! ${playerName} deals ${attackResult.damage} damage with ${attackResult.weaponName}!`, 'crit', attackResult.damage, 'monster');
      } else {
        player.addCombatLog(`${playerName} deals ${attackResult.damage} damage with ${attackResult.weaponName}.`, 'damage', attackResult.damage, 'monster');
      }

      results.playerAttacked = true;
      results.monsterDamage = attackResult.damage;

      // Check if monster is defeated
      if (monsterInstance.stats.health.current <= 0) {
        results.monsterDefeated = true;
        player.addCombatLog(`${playerName} defeated ${monsterInstance.name}!`, 'system');
        combat.monsterInstance = new Map(Object.entries(monsterInstance));
        return results;
      }
    }

    // Check if monster's attack is ready
    if (combat.monsterNextAttackTime && now >= combat.monsterNextAttackTime) {
      const attackResult = this.calculateDamage(monsterInstance, player, itemService);

      // Apply damage to player
      const playerDefeated = player.takeDamage(attackResult.damage);

      // Update combat state
      combat.monsterLastAttackTime = now;
      const monsterWeapon = this.getEquippedWeapon(monsterInstance, itemService);
      const monsterAttackSpeed = (monsterWeapon ? monsterWeapon.attackSpeed : 3.0) * 1000;
      combat.monsterNextAttackTime = new Date(now.getTime() + monsterAttackSpeed);

      // Track dodges
      if (attackResult.isDodge) {
        player.combatStats.dodges++;
      }

      // Log attack
      const playerName = username || 'You';
      if (attackResult.isDodge) {
        player.addCombatLog(`${monsterInstance.name}'s attack missed - ${playerName} dodged!`, 'dodge');
      } else if (attackResult.isCrit) {
        player.addCombatLog(`${monsterInstance.name} CRITICALLY HITS ${playerName} for ${attackResult.damage} damage!`, 'crit', attackResult.damage, 'player');
      } else {
        player.addCombatLog(`${monsterInstance.name} deals ${attackResult.damage} damage.`, 'damage', attackResult.damage, 'player');
      }

      results.monsterAttacked = true;
      results.playerDamage = attackResult.damage;
      results.playerDefeated = playerDefeated;
    }

    // Update monster instance in combat state
    combat.monsterInstance = new Map(Object.entries(monsterInstance));

    return results;
  }

  /**
   * Use ability in combat
   */
  useAbility(player: any, abilityId: string, itemService: any, username?: string): any {
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
    const playerName = username || 'You';
    if (attackResult.isDodge) {
      player.addCombatLog(`${ability.name} missed - ${monsterInstance.name} dodged!`, 'miss');
    } else if (attackResult.isCrit) {
      player.addCombatLog(`CRITICAL ${ability.name}! ${playerName} deals ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    } else {
      player.addCombatLog(`${playerName} uses ${ability.name} for ${attackResult.damage} damage!`, 'ability', attackResult.damage, 'monster');
    }

    // Set cooldown
    player.setAbilityCooldown(abilityId, ability.cooldown);

    // Update monster instance
    combat.monsterInstance = new Map(Object.entries(monsterInstance));

    // Check if monster is defeated
    const monsterDefeated = monsterInstance.stats.health.current <= 0;
    if (monsterDefeated) {
      player.addCombatLog(`${playerName} defeated ${monsterInstance.name}!`, 'system');
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
