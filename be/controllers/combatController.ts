import { Request, Response } from 'express';
import Player from '../models/Player';
import combatService from '../services/combatService';
import itemService from '../services/itemService';
import dropTableService from '../services/dropTableService';
import locationService from '../services/locationService';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface StartCombatRequest {
  monsterId: string;
  activityId?: string;
}

interface ExecuteActionRequest {
  action: 'attack' | 'ability' | 'flee';
  abilityId?: string;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * POST /api/combat/start
 * Start combat with a monster
 * Body: { monsterId, activityId? }
 */
export const startCombat = async (
  req: Request<{}, {}, StartCombatRequest>,
  res: Response
): Promise<void> => {
  try {
    const { monsterId, activityId } = req.body;

    if (!monsterId) {
      res.status(400).json({ message: 'Monster ID is required' });
      return;
    }

    // Get player
    const player = await Player.findOne({ userId: req.user!._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if already in combat
    if (player.isInCombat()) {
      res.status(400).json({ message: 'Already in combat' });
      return;
    }

    // Check if player is in an activity
    if (player.activeActivity && player.activeActivity.activityId) {
      res.status(400).json({ message: 'Cannot start combat while performing an activity' });
      return;
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
    const availableAbilities = weapon
      ? combatService.getAbilitiesForWeapon(weapon.skillScalar)
      : [];

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
    res.status(500).json({ message: (error as Error).message || 'Failed to start combat' });
  }
};

/**
 * POST /api/combat/action
 * Execute player action (attack, ability, or flee)
 * Body: { action: 'attack' | 'ability' | 'flee', abilityId? }
 */
export const executeAction = async (
  req: Request<{}, {}, ExecuteActionRequest>,
  res: Response
): Promise<void> => {
  try {
    const { action, abilityId } = req.body;

    if (!action) {
      res.status(400).json({ message: 'Action is required' });
      return;
    }

    // Get player
    const player = await Player.findOne({ userId: req.user!._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if in combat
    if (!player.isInCombat()) {
      res.status(400).json({ message: 'Not in combat' });
      return;
    }

    let actionResult: any = null;

    if (action === 'attack') {
      // Process auto-attack (combat turn)
      actionResult = combatService.processCombatTurn(player, itemService, req.user!.username);
    } else if (action === 'ability') {
      if (!abilityId) {
        res.status(400).json({ message: 'Ability ID is required' });
        return;
      }

      // Use ability
      actionResult = combatService.useAbility(player, abilityId, itemService, req.user!.username);

      // Also process combat turn (monster can attack back)
      const turnResult = combatService.processCombatTurn(player, itemService, req.user!.username);
      actionResult = {
        ...actionResult,
        ...turnResult
      };
    } else if (action === 'flee') {
      // End combat without rewards
      await combatService.awardCombatRewards(player, false, itemService, dropTableService);

      res.json({
        message: 'You fled from combat!',
        combat: null
      });
      return;
    } else {
      res.status(400).json({ message: 'Invalid action' });
      return;
    }

    // Check for combat end
    let combatEnded = false;
    let rewards: any = null;
    let finalCombatState: any = null;

    if (actionResult.playerDefeated || actionResult.monsterDefeated) {
      // Capture final combat state BEFORE clearing combat
      const monsterInstance = Object.fromEntries(player.activeCombat.monsterInstance);
      const weapon = combatService.getEquippedWeapon(player, itemService);
      const availableAbilities = weapon
        ? combatService.getAbilitiesForWeapon(weapon.skillScalar)
        : [];

      finalCombatState = {
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
        combatLog: player.activeCombat.combatLog, // Include full log for final state
        availableAbilities,
        abilityCooldowns: Object.fromEntries(player.activeCombat.abilityCooldowns),
        combatEnded: true // Flag to indicate combat is over
      };

      // Award rewards and clear combat
      if (actionResult.playerDefeated) {
        rewards = await combatService.awardCombatRewards(player, false, itemService, dropTableService);
      } else if (actionResult.monsterDefeated) {
        rewards = await combatService.awardCombatRewards(player, true, itemService, dropTableService);
      }

      combatEnded = true;
    } else {
      await player.save();
    }

    // Prepare response
    if (combatEnded) {
      res.json({
        message: rewards.victory ? 'Victory!' : 'Defeated!',
        combat: finalCombatState, // Send final state instead of null
        rewards
      });
      return;
    }

    // Get current monster instance
    const monsterInstance = Object.fromEntries(player.activeCombat.monsterInstance);

    // Get available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon
      ? combatService.getAbilitiesForWeapon(weapon.skillScalar)
      : [];

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
    res.status(500).json({ message: (error as Error).message || 'Failed to execute action' });
  }
};

/**
 * GET /api/combat/status
 * Get current combat status
 */
export const getCombatStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user!._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if in combat
    if (!player.isInCombat()) {
      res.json({
        inCombat: false,
        combat: null
      });
      return;
    }

    // Process any pending auto-attacks
    const turnResult = combatService.processCombatTurn(player, itemService, req.user!.username);

    // Check for combat end
    if (turnResult.playerDefeated) {
      const rewards = await combatService.awardCombatRewards(player, false, itemService, dropTableService);
      res.json({
        inCombat: false,
        combat: null,
        combatEnded: true,
        rewards
      });
      return;
    } else if (turnResult.monsterDefeated) {
      const rewards = await combatService.awardCombatRewards(player, true, itemService, dropTableService);
      res.json({
        inCombat: false,
        combat: null,
        combatEnded: true,
        rewards
      });
      return;
    }

    await player.save();

    // Get current monster instance
    const monsterInstance = Object.fromEntries(player.activeCombat.monsterInstance);

    // Get available abilities
    const weapon = combatService.getEquippedWeapon(player, itemService);
    const availableAbilities = weapon
      ? combatService.getAbilitiesForWeapon(weapon.skillScalar)
      : [];

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
    res.status(500).json({ message: (error as Error).message || 'Failed to get combat status' });
  }
};

/**
 * POST /api/combat/flee
 * Flee from combat
 */
export const flee = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user!._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if in combat
    if (!player.isInCombat()) {
      res.status(400).json({ message: 'Not in combat' });
      return;
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
    res.status(500).json({ message: (error as Error).message || 'Failed to flee' });
  }
};

/**
 * POST /api/combat/restart
 * Restart combat with the same activity
 */
export const restartCombat = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get player
    const player = await Player.findOne({ userId: req.user!._id });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if there was a previous combat activity
    const activityId = player.lastCombatActivityId;
    if (!activityId) {
      res.status(400).json({ message: 'No activity to restart' });
      return;
    }

    // Get the activity to find the monster
    const activity = locationService.getActivity(activityId);

    if (!activity || activity.type !== 'combat') {
      res.status(400).json({ message: 'Invalid combat activity' });
      return;
    }

    // Cast to CombatActivity to access combatConfig
    const combatActivity = activity as any;
    const monsterId = combatActivity.combatConfig?.monsterId;
    if (!monsterId) {
      res.status(400).json({ message: 'Activity has no monster configured' });
      return;
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
    const availableAbilities = weapon
      ? combatService.getAbilitiesForWeapon(weapon.skillScalar)
      : [];

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
    res.status(500).json({ message: (error as Error).message || 'Failed to restart combat' });
  }
};
