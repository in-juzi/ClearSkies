const Player = require('../models/Player');
const combatService = require('../services/combatService');
const itemService = require('../services/itemService');
const dropTableService = require('../services/dropTableService');

// Start combat with a monster
exports.startCombat = async (req, res) => {
  try {
    const { monsterId, activityId } = req.body;

    if (!monsterId) {
      return res.status(400).json({ message: 'Monster ID is required' });
    }

    // Get player
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if already in combat
    if (player.isInCombat()) {
      return res.status(400).json({ message: 'Already in combat' });
    }

    // Check if player is in an activity
    if (player.activeActivity && player.activeActivity.activityId) {
      return res.status(400).json({ message: 'Cannot start combat while performing an activity' });
    }

    // Initialize combat
    const monsterInstance = combatService.initializeCombat(player, monsterId, itemService);

    // Store activityId if provided (for restart functionality)
    if (activityId) {
      player.activeCombat.activityId = activityId;
      player.lastCombatActivityId = activityId; // Persist even after combat ends
    }

    await player.save();

    // Get player weapon to determine available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon ?
      combatService.getAbilitiesForWeapon(weapon.skillScalar) :
      [];

    // Convert combat state for response
    const combatState = {
      activityId: player.activeCombat.activityId || null,
      monsterId: monsterInstance.monsterId,
      monsterName: monsterInstance.name,
      monsterLevel: monsterInstance.level,
      monsterHealth: monsterInstance.stats.health,
      playerHealth: {
        current: player.stats.health.current,
        max: player.stats.health.max
      },
      playerMana: {
        current: player.stats.mana.current,
        max: player.stats.mana.max
      },
      playerNextAttackTime: player.activeCombat.playerNextAttackTime,
      monsterNextAttackTime: player.activeCombat.monsterNextAttackTime,
      turnCount: player.activeCombat.turnCount,
      combatLog: player.activeCombat.combatLog.slice(-10), // Last 10 entries
      availableAbilities,
      abilityCooldowns: Object.fromEntries(player.activeCombat.abilityCooldowns)
    };

    res.json({
      message: `Combat started with ${monsterInstance.name}!`,
      combat: combatState
    });
  } catch (error) {
    console.error('Start combat error:', error);
    res.status(500).json({ message: error.message || 'Failed to start combat' });
  }
};

// Execute player action (attack, ability, or flee)
exports.executeAction = async (req, res) => {
  try {
    const { action, abilityId } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }

    // Get player
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if in combat
    if (!player.isInCombat()) {
      return res.status(400).json({ message: 'Not in combat' });
    }

    let actionResult = null;

    if (action === 'attack') {
      // Process auto-attack (combat turn)
      actionResult = combatService.processCombatTurn(player, itemService);
    } else if (action === 'ability') {
      if (!abilityId) {
        return res.status(400).json({ message: 'Ability ID is required' });
      }

      // Use ability
      actionResult = combatService.useAbility(player, abilityId, itemService);

      // Also process combat turn (monster can attack back)
      const turnResult = combatService.processCombatTurn(player, itemService);
      actionResult = {
        ...actionResult,
        ...turnResult
      };
    } else if (action === 'flee') {
      // End combat without rewards
      await combatService.awardCombatRewards(player, false, itemService, dropTableService);

      return res.json({
        message: 'You fled from combat!',
        combat: null
      });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Check for combat end
    let combatEnded = false;
    let rewards = null;

    if (actionResult.playerDefeated) {
      // Player defeated
      rewards = await combatService.awardCombatRewards(player, false, itemService, dropTableService);
      combatEnded = true;
    } else if (actionResult.monsterDefeated) {
      // Monster defeated
      rewards = await combatService.awardCombatRewards(player, true, itemService, dropTableService);
      combatEnded = true;
    } else {
      await player.save();
    }

    // Prepare response
    if (combatEnded) {
      return res.json({
        message: rewards.victory ? 'Victory!' : 'Defeated!',
        combat: null,
        rewards
      });
    }

    // Get current monster instance
    const monsterInstance = Object.fromEntries(player.activeCombat.monsterInstance);

    // Get available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon ?
      combatService.getAbilitiesForWeapon(weapon.skillScalar) :
      [];

    // Convert combat state for response
    const combatState = {
      activityId: player.activeCombat.activityId || null,
      monsterId: monsterInstance.monsterId,
      monsterName: monsterInstance.name,
      monsterLevel: monsterInstance.level,
      monsterHealth: monsterInstance.stats.health,
      playerHealth: {
        current: player.stats.health.current,
        max: player.stats.health.max
      },
      playerMana: {
        current: player.stats.mana.current,
        max: player.stats.mana.max
      },
      playerNextAttackTime: player.activeCombat.playerNextAttackTime,
      monsterNextAttackTime: player.activeCombat.monsterNextAttackTime,
      turnCount: player.activeCombat.turnCount,
      combatLog: player.activeCombat.combatLog.slice(-10), // Last 10 entries
      availableAbilities,
      abilityCooldowns: Object.fromEntries(player.activeCombat.abilityCooldowns)
    };

    res.json({
      message: 'Action executed',
      combat: combatState,
      actionResult
    });
  } catch (error) {
    console.error('Execute action error:', error);
    res.status(500).json({ message: error.message || 'Failed to execute action' });
  }
};

// Get current combat status
exports.getCombatStatus = async (req, res) => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if in combat
    if (!player.isInCombat()) {
      return res.json({
        inCombat: false,
        combat: null
      });
    }

    // Process any pending auto-attacks
    const turnResult = combatService.processCombatTurn(player, itemService);

    // Check for combat end
    if (turnResult.playerDefeated) {
      const rewards = await combatService.awardCombatRewards(player, false, itemService, dropTableService);
      return res.json({
        inCombat: false,
        combat: null,
        combatEnded: true,
        rewards
      });
    } else if (turnResult.monsterDefeated) {
      const rewards = await combatService.awardCombatRewards(player, true, itemService, dropTableService);
      return res.json({
        inCombat: false,
        combat: null,
        combatEnded: true,
        rewards
      });
    }

    await player.save();

    // Get current monster instance
    const monsterInstance = Object.fromEntries(player.activeCombat.monsterInstance);

    // Get available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon ?
      combatService.getAbilitiesForWeapon(weapon.skillScalar) :
      [];

    // Convert combat state for response
    const combatState = {
      activityId: player.activeCombat.activityId || null,
      monsterId: monsterInstance.monsterId,
      monsterName: monsterInstance.name,
      monsterLevel: monsterInstance.level,
      monsterHealth: monsterInstance.stats.health,
      playerHealth: {
        current: player.stats.health.current,
        max: player.stats.health.max
      },
      playerMana: {
        current: player.stats.mana.current,
        max: player.stats.mana.max
      },
      playerNextAttackTime: player.activeCombat.playerNextAttackTime,
      monsterNextAttackTime: player.activeCombat.monsterNextAttackTime,
      turnCount: player.activeCombat.turnCount,
      combatLog: player.activeCombat.combatLog.slice(-10), // Last 10 entries
      availableAbilities,
      abilityCooldowns: Object.fromEntries(player.activeCombat.abilityCooldowns)
    };

    res.json({
      inCombat: true,
      combat: combatState
    });
  } catch (error) {
    console.error('Get combat status error:', error);
    res.status(500).json({ message: error.message || 'Failed to get combat status' });
  }
};

// Flee from combat
exports.flee = async (req, res) => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if in combat
    if (!player.isInCombat()) {
      return res.status(400).json({ message: 'Not in combat' });
    }

    // Clear combat without rewards
    player.clearCombat();
    await player.save();

    res.json({
      message: 'You fled from combat!',
      combat: null
    });
  } catch (error) {
    console.error('Flee error:', error);
    res.status(500).json({ message: error.message || 'Failed to flee' });
  }
};

// Restart combat with the same activity
exports.restartCombat = async (req, res) => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if there was a previous combat activity
    const activityId = player.lastCombatActivityId;
    if (!activityId) {
      return res.status(400).json({ message: 'No activity to restart' });
    }

    // Get the activity to find the monster
    const locationService = require('../services/locationService');
    const activity = locationService.getActivity(activityId);

    if (!activity || activity.type !== 'combat') {
      return res.status(400).json({ message: 'Invalid combat activity' });
    }

    const monsterId = activity.combatConfig?.monsterId;
    if (!monsterId) {
      return res.status(400).json({ message: 'Activity has no monster configured' });
    }

    // Clear previous combat state
    player.activeCombat = {
      activityId: null,
      monsterId: null,
      monsterInstance: null,
      playerLastAttackTime: null,
      monsterLastAttackTime: null,
      playerNextAttackTime: null,
      monsterNextAttackTime: null,
      turnCount: 0,
      abilityCooldowns: new Map(),
      combatLog: [],
      startTime: null
    };

    // Initialize new combat with same monster
    const monsterInstance = combatService.initializeCombat(player, monsterId, itemService);
    player.activeCombat.activityId = activityId;

    await player.save();

    // Get player weapon to determine available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon ?
      combatService.getAbilitiesForWeapon(weapon.skillScalar) :
      [];

    // Convert combat state for response
    const combatState = {
      activityId: player.activeCombat.activityId || null,
      monsterId: monsterInstance.monsterId,
      monsterName: monsterInstance.name,
      monsterLevel: monsterInstance.level,
      monsterHealth: monsterInstance.stats.health,
      playerHealth: {
        current: player.stats.health.current,
        max: player.stats.health.max
      },
      playerMana: {
        current: player.stats.mana.current,
        max: player.stats.mana.max
      },
      playerNextAttackTime: player.activeCombat.playerNextAttackTime,
      monsterNextAttackTime: player.activeCombat.monsterNextAttackTime,
      turnCount: player.activeCombat.turnCount,
      combatLog: player.activeCombat.combatLog.slice(-10), // Last 10 entries
      availableAbilities,
      abilityCooldowns: Object.fromEntries(player.activeCombat.abilityCooldowns)
    };

    res.json({
      message: `New combat started with ${monsterInstance.name}!`,
      combat: combatState
    });
  } catch (error) {
    console.error('Restart combat error:', error);
    res.status(500).json({ message: error.message || 'Failed to restart combat' });
  }
};
