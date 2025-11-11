const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CombatService {
  constructor() {
    this.monsters = new Map();
    this.abilities = new Map();
    this.loadMonsters();
    this.loadAbilities();
  }

  // Load monster definitions from JSON files
  loadMonsters() {
    const monstersDir = path.join(__dirname, '../data/monsters/definitions');

    if (!fs.existsSync(monstersDir)) {
      console.warn(`Monsters directory not found: ${monstersDir}`);
      return;
    }

    const files = fs.readdirSync(monstersDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(monstersDir, file);
          const monsterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          this.monsters.set(monsterData.monsterId, monsterData);
        } catch (error) {
          console.error(`Error loading monster from ${file}:`, error);
        }
      }
    }

    console.log(`Loaded ${this.monsters.size} monsters`);
  }

  // Load ability definitions from JSON files
  loadAbilities() {
    const abilitiesDir = path.join(__dirname, '../data/abilities/definitions');

    if (!fs.existsSync(abilitiesDir)) {
      console.warn(`Abilities directory not found: ${abilitiesDir}`);
      return;
    }

    const files = fs.readdirSync(abilitiesDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(abilitiesDir, file);
          const abilityData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          this.abilities.set(abilityData.abilityId, abilityData);
        } catch (error) {
          console.error(`Error loading ability from ${file}:`, error);
        }
      }
    }

    console.log(`Loaded ${this.abilities.size} abilities`);
  }

  // Get monster definition by ID
  getMonster(monsterId) {
    return this.monsters.get(monsterId);
  }

  // Get ability definition by ID
  getAbility(abilityId) {
    return this.abilities.get(abilityId);
  }

  // Get all available abilities for a weapon type
  getAbilitiesForWeapon(skillScalar) {
    const abilities = [];
    for (const ability of this.abilities.values()) {
      if (ability.requirements && ability.requirements.weaponTypes) {
        if (ability.requirements.weaponTypes.includes(skillScalar)) {
          abilities.push(ability);
        }
      }
    }
    return abilities;
  }

  // Create a monster instance from definition
  createMonsterInstance(monsterId) {
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

  // Parse dice notation (e.g., "1d6", "2d4+2")
  rollDice(diceNotation) {
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

  // Calculate total armor from equipment
  calculateTotalArmor(entity, itemService) {
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
          const item = entity.inventory.find(i => i.instanceId === instanceId);
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

  // Calculate total evasion from equipment
  calculateTotalEvasion(entity, itemService) {
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
          const item = entity.inventory.find(i => i.instanceId === instanceId);
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

  // Calculate armor damage reduction (diminishing returns: 1000 armor = 50% reduction)
  calculateArmorReduction(armor) {
    // Formula: reduction = armor / (armor + 1000)
    // Examples: 100 armor = 9%, 500 armor = 33%, 1000 armor = 50%, 2000 armor = 67%
    return armor / (armor + 1000);
  }

  // Calculate evasion chance (diminishing returns: 1000 evasion = 50% dodge)
  calculateEvasionChance(evasion) {
    // Formula: chance = evasion / (evasion + 1000)
    // Examples: 100 evasion = 9%, 500 evasion = 33%, 1000 evasion = 50%, 2000 evasion = 67%
    const chance = evasion / (evasion + 1000);
    return Math.min(0.75, chance); // Cap at 75% dodge chance
  }

  // Get equipped weapon for an entity
  getEquippedWeapon(entity, itemService) {
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

    const item = entity.inventory.find(i => i.instanceId === mainHandId);
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

  // Calculate damage with skill/attribute scaling
  calculateDamage(attacker, defender, itemService, isAbility = false, abilityPower = 1.0, critBonus = 0) {
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

  // Initialize combat between player and monster
  initializeCombat(player, monsterId, itemService) {
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

  // Process combat turn (auto-attacks)
  processCombatTurn(player, itemService) {
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
      if (attackResult.isDodge) {
        player.addCombatLog(`Your attack missed - ${monsterInstance.name} dodged!`, 'miss');
      } else if (attackResult.isCrit) {
        player.addCombatLog(`CRITICAL HIT! You deal ${attackResult.damage} damage with ${attackResult.weaponName}!`, 'crit');
      } else {
        player.addCombatLog(`You deal ${attackResult.damage} damage with ${attackResult.weaponName}.`, 'damage');
      }

      results.playerAttacked = true;
      results.monsterDamage = attackResult.damage;

      // Check if monster is defeated
      if (monsterInstance.stats.health.current <= 0) {
        results.monsterDefeated = true;
        player.addCombatLog(`You defeated ${monsterInstance.name}!`, 'system');
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
      if (attackResult.isDodge) {
        player.addCombatLog(`${monsterInstance.name}'s attack missed - you dodged!`, 'dodge');
      } else if (attackResult.isCrit) {
        player.addCombatLog(`${monsterInstance.name} CRITICALLY HITS you for ${attackResult.damage} damage!`, 'crit');
      } else {
        player.addCombatLog(`${monsterInstance.name} deals ${attackResult.damage} damage.`, 'damage');
      }

      results.monsterAttacked = true;
      results.playerDamage = attackResult.damage;
      results.playerDefeated = playerDefeated;
    }

    // Update monster instance in combat state
    combat.monsterInstance = new Map(Object.entries(monsterInstance));

    return results;
  }

  // Use ability in combat
  useAbility(player, abilityId, itemService) {
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
    const critBonus = ability.effects && ability.effects.critChanceBonus ? ability.effects.critChanceBonus : 0;
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
    if (attackResult.isDodge) {
      player.addCombatLog(`${ability.name} missed - ${monsterInstance.name} dodged!`, 'miss');
    } else if (attackResult.isCrit) {
      player.addCombatLog(`CRITICAL ${ability.name}! You deal ${attackResult.damage} damage!`, 'ability');
    } else {
      player.addCombatLog(`You use ${ability.name} for ${attackResult.damage} damage!`, 'ability');
    }

    // Set cooldown
    player.setAbilityCooldown(abilityId, ability.cooldown);

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

  // End combat and award rewards
  async awardCombatRewards(player, victory, itemService, dropTableService) {
    if (!player.isInCombat()) {
      throw new Error('Player is not in combat');
    }

    const combat = player.activeCombat;
    const monsterInstance = Object.fromEntries(combat.monsterInstance);
    const monsterDef = this.getMonster(monsterInstance.monsterId);

    const rewards = {
      gold: 0,
      experience: 0,
      items: [],
      victory
    };

    if (victory) {
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
        // Use itemService to create proper item instances with Maps
        const itemInstance = itemService.createItemInstance(
          dropResult.itemId,
          dropResult.quantity,
          dropResult.qualities || {},
          dropResult.traits || []
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

module.exports = new CombatService();
