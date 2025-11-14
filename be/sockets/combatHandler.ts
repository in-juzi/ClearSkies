import { Server, Socket } from 'socket.io';
import Player from '../models/Player';
import combatService from '../services/combatService';
import locationService from '../services/locationService';
import itemService from '../services/itemService';

// Track combat turn timers per user (separate for player and monster)
const playerTurnTimers = new Map<string, NodeJS.Timeout>();
const monsterTurnTimers = new Map<string, NodeJS.Timeout>();

/**
 * Helper: Save player with version conflict handling
 * Silently ignores version conflicts (next turn will pick up changes)
 */
async function savePlayerSafely(player: any): Promise<boolean> {
  try {
    await player.save();
    return true;
  } catch (error: any) {
    if (error.name === 'VersionError') {
      console.log(`Version conflict detected - changes will be applied on next turn`);
      return false; // Version conflict, but not fatal
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Helper: Serialize active buffs Map to array for frontend
 */
function serializeActiveBuffs(player: any): any[] {
  if (!player.activeCombat || !player.activeCombat.activeBuffs) {
    return [];
  }

  const buffs = [];
  for (const [buffId, buff] of player.activeCombat.activeBuffs.entries()) {
    buffs.push({
      buffId: buff.buffId,
      abilityId: buff.abilityId,
      name: buff.name,
      description: buff.description,
      target: buff.target,
      appliedAt: buff.appliedAt,
      duration: buff.duration,
      icon: buff.icon,
      statModifiers: buff.statModifiers,
      damageOverTime: buff.damageOverTime,
      healOverTime: buff.healOverTime,
      manaRegen: buff.manaRegen,
      manaDrain: buff.manaDrain,
      stackCount: buff.stackCount
    });
  }

  return buffs;
}

/**
 * Combat Socket Handler
 * Handles real-time turn-based combat events
 */
export default function (io: Server): void {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data?.userId || (socket as any).userId;

    socket.join(`user:${userId}`);

    console.log(`✓ User connected to combat handler: ${userId}`);

    /**
     * Event: combat:useAbility
     * Player uses combat ability
     */
    socket.on('combat:useAbility', async (data: { abilityId: string }, callback?: (response: any) => void) => {
      try {
        const { abilityId } = data;

        if (!abilityId) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Ability ID required' });
          }
          return;
        }

        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Not in combat' });
          }
          return;
        }

        // Check ability cooldown
        const cooldowns = player.activeCombat!.abilityCooldowns;
        const cooldown = cooldowns.get ? cooldowns.get(abilityId) : (cooldowns as any)[abilityId];

        if (cooldown && cooldown > Date.now()) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Ability on cooldown',
              cooldownRemaining: Math.ceil((cooldown - Date.now()) / 1000)
            });
          }
          return;
        }

        // Use combat service to handle ability (includes buff application)
        const result = combatService.useAbility(player, abilityId, itemService);

        // Get ability for emit data
        const ability = combatService.getAbility(abilityId);
        if (!ability) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Ability not found' });
          }
          return;
        }

        // Get updated monster instance
        const monsterInstance = Object.fromEntries(player.activeCombat!.monsterInstance);

        // Build attack result for client
        const attackResult = {
          damage: result.damage,
          isCrit: result.isCrit,
          isDodge: result.isDodge
        };

        // Check if monster defeated
        if (result.monsterDefeated) {
          await player.save();

          await handleCombatVictory(player, io, userId);

          if (typeof callback === 'function') {
            callback({
              success: true,
              result: attackResult,
              monsterDefeated: true
            });
          }
          return;
        }

        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            result: attackResult
          });
        }

        io.to(`user:${userId}`).emit('combat:abilityUsed', {
          result: attackResult,
          abilityName: ability.name,
          monster: {
            currentHp: monsterInstance.stats.health.current,
            maxHp: monsterInstance.stats.health.max
          },
          player: {
            currentHp: player.stats.health.current,
            currentMana: player.stats.mana.current
          },
          abilityCooldowns: Object.fromEntries(player.activeCombat!.abilityCooldowns),
          combatLog: player.activeCombat!.combatLog,
          activeBuffs: serializeActiveBuffs(player)
        });

        // Schedule monster turn
        scheduleMonsterTurn(player, io, userId);

      } catch (error) {
        console.error('Error using ability:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to use ability'
          });
        }
      }
    });

    /**
     * Event: combat:useItem
     * Player uses consumable item (potion)
     */
    socket.on('combat:useItem', async (data: { instanceId: string }, callback?: (response: any) => void) => {
      try {
        const { instanceId } = data;

        if (!instanceId) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Instance ID required' });
          }
          return;
        }

        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Not in combat' });
          }
          return;
        }

        // Find item
        const item = player.inventory.find(i => i.instanceId === instanceId);
        if (!item) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Item not found' });
          }
          return;
        }

        // Get item definition
        const itemDef = itemService.getItemDefinition(item.itemId);
        if (!itemDef || itemDef.category !== 'consumable') {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Item is not consumable' });
          }
          return;
        }

        // Apply consumable effect
        const consumable = itemDef as any;
        let healAmount = 0;
        let manaAmount = 0;

        if (consumable.properties?.healthRestore) {
          healAmount = consumable.properties.healthRestore;
          player.heal(healAmount);
        }

        if (consumable.properties?.manaRestore) {
          manaAmount = consumable.properties.manaRestore;
          const maxMana = player.stats.mana.max;
          player.stats.mana.current = Math.min(maxMana, player.stats.mana.current + manaAmount);
        }

        // Log item use
        let message = `You use ${itemDef.name}`;
        if (healAmount > 0 && manaAmount > 0) {
          message += ` (restored ${healAmount} HP and ${manaAmount} mana)`;
        } else if (healAmount > 0) {
          message += ` (restored ${healAmount} HP)`;
        } else if (manaAmount > 0) {
          message += ` (restored ${manaAmount} mana)`;
        }
        player.addCombatLog(message, 'heal', healAmount, 'player');

        // Remove item from inventory
        player.removeItem(instanceId, 1);

        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            result: {
              healAmount,
              manaAmount,
              itemName: itemDef.name
            }
          });
        }

        // Get updated inventory
        const inventory = player.inventory.map((inv: any) => {
          const plainItem = inv.toObject ? inv.toObject() : inv;
          if (plainItem.qualities instanceof Map) {
            plainItem.qualities = Object.fromEntries(plainItem.qualities);
          }
          if (plainItem.traits instanceof Map) {
            plainItem.traits = Object.fromEntries(plainItem.traits);
          }
          return plainItem;
        });

        io.to(`user:${userId}`).emit('combat:itemUsed', {
          result: {
            healAmount,
            manaAmount,
            itemName: itemDef.name
          },
          player: {
            currentHp: player.stats.health.current,
            currentMana: player.stats.mana.current
          },
          inventory,
          combatLog: player.activeCombat!.combatLog,
          activeBuffs: serializeActiveBuffs(player)
        });

      } catch (error) {
        console.error('Error using item:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to use item'
          });
        }
      }
    });

    /**
     * Event: combat:flee
     * Player attempts to flee combat
     */
    socket.on('combat:flee', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Not in combat' });
          }
          return;
        }

        // Clear both timers
        clearCombatTimers(userId);

        // Store activity ID before clearing combat
        const activityId = player.activeCombat!.activityId;

        // End combat (no rewards)
        player.activeCombat = undefined;
        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Fled from combat'
          });
        }

        io.to(`user:${userId}`).emit('combat:fled', {
          success: true,
          activityId
        });

      } catch (error) {
        console.error('Error fleeing combat:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to flee'
          });
        }
      }
    });

    /**
     * Event: combat:getStatus
     * Client requests combat status (for reconnection)
     */
    socket.on('combat:getStatus', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({
              success: true,
              inCombat: false
            });
          }
          return;
        }

        // Get monster instance
        const monsterInstance = Object.fromEntries(player.activeCombat!.monsterInstance);

        // Get available abilities based on equipped weapon
        const weapon = combatService.getEquippedWeapon(player, itemService);
        const availableAbilities = weapon ? combatService.getAbilitiesForWeapon(weapon.skillScalar) : [];

        // Return current combat state
        const combatLog = player.activeCombat!.combatLog.map((entry: any) => {
          const plainEntry = entry.toObject ? entry.toObject() : entry;
          return plainEntry;
        });

        if (typeof callback === 'function') {
          callback({
            success: true,
            inCombat: true,
            combat: {
              monster: monsterInstance,
              player: {
                currentHp: player.stats.health.current,
                maxHp: player.stats.health.max,
                currentMana: player.stats.mana.current,
                maxMana: player.stats.mana.max
              },
              turnCount: player.activeCombat!.turnCount,
              playerNextAttackTime: player.activeCombat!.playerNextAttackTime,
              monsterNextAttackTime: player.activeCombat!.monsterNextAttackTime,
              abilityCooldowns: Object.fromEntries(player.activeCombat!.abilityCooldowns),
              availableAbilities: availableAbilities.map((ability: any) => ({
                abilityId: ability.abilityId,
                name: ability.name,
                description: ability.description,
                manaCost: ability.manaCost,
                cooldown: ability.cooldown,
                powerMultiplier: ability.powerMultiplier,
                icon: ability.icon
              })),
              combatLog,
              activityId: player.activeCombat!.activityId,
              activeBuffs: serializeActiveBuffs(player)
            }
          });
        }

        // Reschedule both timers if needed (reconnection)
        if (player.activeCombat!.playerNextAttackTime) {
          const timeUntilPlayer = player.activeCombat!.playerNextAttackTime.getTime() - Date.now();
          if (timeUntilPlayer > 0 && !playerTurnTimers.has(userId)) {
            schedulePlayerTurn(player, io, userId);
          }
        }

        if (player.activeCombat!.monsterNextAttackTime) {
          const timeUntilMonster = player.activeCombat!.monsterNextAttackTime.getTime() - Date.now();
          if (timeUntilMonster > 0 && !monsterTurnTimers.has(userId)) {
            scheduleMonsterTurn(player, io, userId);
          }
        }

      } catch (error) {
        console.error('Error getting combat status:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to get combat status'
          });
        }
      }
    });

    /**
     * Event: disconnect
     */
    socket.on('disconnect', (reason: string) => {
      console.log(`✗ User disconnected from combat handler: ${userId} (${reason})`);
      // Combat state preserved, timers continue
    });
  });
}

/**
 * Helper: Schedule player's next auto-attack
 * Exported so activityHandler can call it when combat starts
 */
export function schedulePlayerTurn(player: any, io: Server, userId: string): void {
  // Clear existing timer
  const existingTimer = playerTurnTimers.get(userId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Calculate player's next attack time
  const now = Date.now();
  const nextPlayerAttack = player.activeCombat!.playerNextAttackTime?.getTime() || now;
  const delay = Math.max(0, nextPlayerAttack - now);

  const timer = setTimeout(() => {
    performPlayerTurn(userId, io);
  }, delay);

  playerTurnTimers.set(userId, timer);
}

/**
 * Helper: Schedule monster's next auto-attack
 * Exported so activityHandler can call it when combat starts
 */
export function scheduleMonsterTurn(player: any, io: Server, userId: string): void {
  // Clear existing timer
  const existingTimer = monsterTurnTimers.get(userId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Calculate monster's next attack time
  const now = Date.now();
  const nextMonsterAttack = player.activeCombat!.monsterNextAttackTime?.getTime() || now;
  const delay = Math.max(0, nextMonsterAttack - now);

  const timer = setTimeout(() => {
    performMonsterTurn(userId, io);
  }, delay);

  monsterTurnTimers.set(userId, timer);
}

/**
 * Helper: Clear both player and monster timers
 */
function clearCombatTimers(userId: string): void {
  const playerTimer = playerTurnTimers.get(userId);
  if (playerTimer) {
    clearTimeout(playerTimer);
    playerTurnTimers.delete(userId);
  }

  const monsterTimer = monsterTurnTimers.get(userId);
  if (monsterTimer) {
    clearTimeout(monsterTimer);
    monsterTurnTimers.delete(userId);
  }
}

/**
 * Helper: Perform player auto-attack turn
 */
async function performPlayerTurn(userId: string, io: Server): Promise<void> {
  try {
    const player = await Player.findOne({ userId });
    if (!player || !player.isInCombat()) {
      playerTurnTimers.delete(userId);
      return;
    }

    // Get monster instance from Map
    const monsterInstance = Object.fromEntries(player.activeCombat!.monsterInstance);

    // Player auto-attacks
    const attackResult = combatService.calculateDamage(player, monsterInstance, itemService, player);

    // Apply damage to monster
    monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - attackResult.damage);

    // Update combat state
    const playerWeapon = combatService.getEquippedWeapon(player, itemService);
    const playerAttackSpeed = (playerWeapon ? playerWeapon.attackSpeed : 3.0) * 1000;
    player.activeCombat!.playerLastAttackTime = new Date();
    player.activeCombat!.playerNextAttackTime = new Date(Date.now() + playerAttackSpeed);
    player.activeCombat!.turnCount++;

    // Track damage dealt
    player.combatStats.totalDamageDealt += attackResult.damage;
    if (attackResult.isCrit) {
      player.combatStats.criticalHits++;
    }

    // Log attack
    if (attackResult.isDodge) {
      player.addCombatLog(`Your attack missed - ${monsterInstance.name} dodged!`, 'miss');
    } else if (attackResult.isCrit) {
      player.addCombatLog(`CRITICAL HIT! You deal ${attackResult.damage} damage with ${attackResult.weaponName}!`, 'crit', attackResult.damage, 'monster');
    } else {
      player.addCombatLog(`You deal ${attackResult.damage} damage with ${attackResult.weaponName}.`, 'damage', attackResult.damage, 'monster');
    }

    // Process buff/debuff tick effects (DoT, HoT, durations)
    // Only decrement player buffs on player turn
    const buffTickResults = combatService.processBuffTick(player, monsterInstance, undefined, 'player');

    // Apply DoT/HoT damage from buffs
    if (buffTickResults.playerDamage > 0) {
      player.takeDamage(buffTickResults.playerDamage);
    }
    if (buffTickResults.monsterDamage > 0) {
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buffTickResults.monsterDamage);
    }

    // Update monster instance in combat
    player.activeCombat!.monsterInstance = new Map(Object.entries(monsterInstance));

    await savePlayerSafely(player);

    // Broadcast player auto-attack
    io.to(`user:${userId}`).emit('combat:playerAttack', {
      result: attackResult,
      monster: {
        currentHp: monsterInstance.stats.health.current,
        maxHp: monsterInstance.stats.health.max
      },
      playerNextAttackTime: player.activeCombat!.playerNextAttackTime,
      combatLog: player.activeCombat!.combatLog,
      activeBuffs: serializeActiveBuffs(player)
    });

    // Check if monster defeated
    if (monsterInstance.stats.health.current <= 0) {
      player.addCombatLog(`You defeated ${monsterInstance.name}!`, 'system');
      await savePlayerSafely(player);

      await handleCombatVictory(player, io, userId);
      return;
    }

    // Schedule next player turn
    schedulePlayerTurn(player, io, userId);

  } catch (error) {
    console.error(`Error performing player turn for user ${userId}:`, error);
    playerTurnTimers.delete(userId);
  }
}

/**
 * Helper: Perform monster auto-attack turn
 */
async function performMonsterTurn(userId: string, io: Server): Promise<void> {
  try {
    const player = await Player.findOne({ userId });
    if (!player || !player.isInCombat()) {
      monsterTurnTimers.delete(userId);
      return;
    }

    // Get monster instance from Map
    const monsterInstance = Object.fromEntries(player.activeCombat!.monsterInstance);

    // Monster attacks
    const attackResult = combatService.calculateDamage(monsterInstance, player, itemService, player);

    // Apply damage to player
    const playerDefeated = player.takeDamage(attackResult.damage);

    // Update combat state
    const monsterWeapon = combatService.getEquippedWeapon(monsterInstance, itemService);
    const monsterAttackSpeed = (monsterWeapon ? monsterWeapon.attackSpeed : 3.0) * 1000;
    player.activeCombat!.monsterLastAttackTime = new Date();
    player.activeCombat!.monsterNextAttackTime = new Date(Date.now() + monsterAttackSpeed);

    // Track dodges
    if (attackResult.isDodge) {
      player.combatStats.dodges++;
    }

    // Log attack
    if (attackResult.isDodge) {
      player.addCombatLog(`${monsterInstance.name}'s attack missed - You dodged!`, 'dodge');
    } else if (attackResult.isCrit) {
      player.addCombatLog(`${monsterInstance.name} CRITICALLY HITS you for ${attackResult.damage} damage!`, 'crit', attackResult.damage, 'player');
    } else {
      player.addCombatLog(`${monsterInstance.name} deals ${attackResult.damage} damage.`, 'damage', attackResult.damage, 'player');
    }

    // Process buff/debuff tick effects (DoT, HoT, durations)
    // Only decrement monster buffs on monster turn
    const buffTickResults = combatService.processBuffTick(player, monsterInstance, undefined, 'monster');

    // Apply DoT/HoT damage from buffs
    if (buffTickResults.playerDamage > 0) {
      player.takeDamage(buffTickResults.playerDamage);
    }
    if (buffTickResults.monsterDamage > 0) {
      monsterInstance.stats.health.current = Math.max(0, monsterInstance.stats.health.current - buffTickResults.monsterDamage);
    }

    // Update monster instance in combat (in case buffs changed HP)
    player.activeCombat!.monsterInstance = new Map(Object.entries(monsterInstance));

    await savePlayerSafely(player);

    // Broadcast monster attack
    io.to(`user:${userId}`).emit('combat:monsterAttack', {
      result: attackResult,
      player: {
        currentHp: player.stats.health.current,
        maxHp: player.stats.health.max
      },
      monsterNextAttackTime: player.activeCombat!.monsterNextAttackTime,
      combatLog: player.activeCombat!.combatLog,
      activeBuffs: serializeActiveBuffs(player)
    });

    // Check if player defeated
    if (playerDefeated) {
      await handleCombatDefeat(player, io, userId);
      return;
    }

    // Schedule next monster turn
    scheduleMonsterTurn(player, io, userId);

  } catch (error) {
    console.error(`Error performing monster turn for user ${userId}:`, error);
    monsterTurnTimers.delete(userId);
  }
}

/**
 * Helper: Handle combat victory
 */
async function handleCombatVictory(player: any, io: Server, userId: string): Promise<void> {
  try {
    // Clear both timers
    clearCombatTimers(userId);

    // Process victory rewards
    const activityId = player.lastCombatActivityId;
    const activity = locationService.getActivity(activityId);

    if (!activity) {
      console.error(`Activity ${activityId} not found for combat rewards`);
      player.activeCombat = undefined;
      await player.save();

      // Still emit victory event even if activity not found
      io.to(`user:${userId}`).emit('combat:victory', {
        success: false,
        message: 'Victory, but activity not found'
      });
      return;
    }

    // Award combat rewards using combatService
    const rewards = await combatService.awardCombatRewards(
      player,
      true,
      itemService,
      require('../services/dropTableService').default
    );

    // Convert items to plain objects for JSON
    const itemsReceived: any[] = [];
    for (const itemInstance of rewards.items) {
      const plainItem = { ...itemInstance };
      if (plainItem.qualities instanceof Map) {
        plainItem.qualities = Object.fromEntries(plainItem.qualities);
      } else if (plainItem.qualities) {
        plainItem.qualities = plainItem.qualities;
      } else {
        plainItem.qualities = {};
      }

      if (plainItem.traits instanceof Map) {
        plainItem.traits = Object.fromEntries(plainItem.traits);
      } else if (plainItem.traits) {
        plainItem.traits = plainItem.traits;
      } else {
        plainItem.traits = {};
      }

      // Add item definition for frontend display
      const itemDef = itemService.getItemDefinition(plainItem.itemId);
      if (itemDef) {
        plainItem.name = itemDef.name;
        plainItem.definition = itemDef;
      }

      itemsReceived.push(plainItem);
    }

    // Get updated inventory
    const inventory = player.inventory.map((item: any) => {
      const plainItem = item.toObject ? item.toObject() : item;
      if (plainItem.qualities instanceof Map) {
        plainItem.qualities = Object.fromEntries(plainItem.qualities);
      }
      if (plainItem.traits instanceof Map) {
        plainItem.traits = Object.fromEntries(plainItem.traits);
      }
      return plainItem;
    });

    // Build skill and attribute updates from rewards
    const skillUpdates: any = {};
    const attributeUpdates: any = {};
    if (rewards.skillResult) {
      skillUpdates[rewards.skillResult.skill.skill] = rewards.skillResult.skill;
      if (rewards.skillResult.attribute) {
        attributeUpdates[rewards.skillResult.attribute.attribute] = rewards.skillResult.attribute;
      }
    }

    // Emit victory event
    io.to(`user:${userId}`).emit('combat:victory', {
      success: true,
      message: 'Victory!',
      rewards: {
        experience: rewards.experience,
        items: itemsReceived,
        gold: rewards.gold
      },
      skillUpdates,
      attributeUpdates,
      inventory,
      activityId
    });

  } catch (error) {
    console.error(`Error handling combat victory for user ${userId}:`, error);
  }
}

/**
 * Helper: Handle combat defeat
 */
async function handleCombatDefeat(player: any, io: Server, userId: string): Promise<void> {
  try {
    // Clear both timers
    clearCombatTimers(userId);

    // Update combat stats
    player.combatStats.deaths += 1;

    // Respawn player at full health/mana
    player.stats.health.current = player.stats.health.max;
    player.stats.mana.current = player.stats.mana.max;

    // Store activity ID before clearing combat
    const activityId = player.activeCombat!.activityId;

    // Clear combat
    player.activeCombat = undefined;

    await player.save();

    // Emit defeat event
    io.to(`user:${userId}`).emit('combat:defeat', {
      success: true,
      message: 'You were defeated! Respawning...',
      player: {
        currentHp: player.stats.health.current,
        maxHp: player.stats.health.max,
        currentMana: player.stats.mana.current,
        maxMana: player.stats.mana.max
      },
      activityId
    });

  } catch (error) {
    console.error(`Error handling combat defeat for user ${userId}:`, error);
  }
}
