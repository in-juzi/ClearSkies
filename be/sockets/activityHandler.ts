import { Server, Socket } from 'socket.io';
import Player from '../models/Player';
import locationService from '../services/locationService';
import itemService from '../services/itemService';
import dropTableService from '../services/dropTableService';
import questService from '../services/questService';
import effectEvaluator from '../services/effectEvaluator';
import rewardProcessor from '../services/rewardProcessor';
import { GatheringActivity, EffectContext } from '@shared/types';
import { schedulePlayerTurn, scheduleMonsterTurn } from './combatHandler';

// Track active activity timers per user
const activityTimers = new Map<string, NodeJS.Timeout>();
const travelTimers = new Map<string, NodeJS.Timeout>();

/**
 * Helper function to schedule activity completion with auto-restart
 */
function scheduleActivityCompletion(
  io: Server,
  userId: string,
  activityId: string,
  facilityId: string,
  activity: any,
  duration: number
): void {
  // Clear any existing timer
  const existingTimer = activityTimers.get(userId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Schedule completion event
  const timer = setTimeout(async () => {
    try {
      // Reload player to get fresh state
      const freshPlayer = await Player.findOne({ userId });
      if (!freshPlayer || !freshPlayer.activeActivity) {
        return; // Activity was cancelled
      }

      // Get location for context
      const location = locationService.getLocation(freshPlayer.currentLocation);

      // Process activity completion (centralized reward logic)
      const { xpRewards, lootItems, questProgress } =
        await locationService.processActivityCompletion(freshPlayer, activity, location);

      // Clear activity state
      freshPlayer.activeActivity = undefined;
      await freshPlayer.save();

      // Build skill/attribute updates for client
      const skillUpdates: any = {};
      const attributeUpdates: any = {};

      // Format skill update
      const skillId = Object.keys(activity.rewards.experience)[0];
      skillUpdates[skillId] = {
        ...xpRewards.skill,
        experience: xpRewards.skill.experienceGained
      };

      // Format attribute update
      if (xpRewards.attribute) {
        attributeUpdates[xpRewards.attribute.attribute] = xpRewards.attribute;
      }

      // Emit completion event
      io.to(`user:${userId}`).emit('activity:completed', {
        success: true,
        activity: activity.name,
        rewards: {
          experience: skillUpdates,
          items: lootItems,
          gold: 0 // TODO: Add gold rewards if needed
        },
        skillUpdates,
        attributeUpdates,
        questProgress
      });

      // Cleanup timer
      activityTimers.delete(userId);
    } catch (error) {
      console.error(`Error completing activity for user ${userId}:`, error);
      io.to(`user:${userId}`).emit('activity:error', {
        success: false,
        message: 'Failed to complete activity'
      });
    }
  }, duration * 1000);

  activityTimers.set(userId, timer);
}

/**
 * Activity Socket Handler
 * Handles real-time activity and travel events
 */
export default function (io: Server): void {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data?.userId || (socket as any).userId;

    // Join user-specific room for targeted events
    socket.join(`user:${userId}`);

    console.log(`✓ User connected to activity handler: ${userId}`);

    /**
     * Event: activity:start
     * Client starts an activity
     */
    socket.on('activity:start', async (data: { activityId: string; facilityId: string }, callback?: (response: any) => void) => {
      try {
        const { activityId, facilityId } = data;

        // Validation
        if (!activityId || !facilityId) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Activity ID and Facility ID are required'
            });
          }
          return;
        }

        // Get player
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        // Cancel any existing activity (allow overwriting)
        if (player.activeActivity && player.activeActivity.activityId) {
          // Clear activity timer
          const activityTimer = activityTimers.get(userId);
          if (activityTimer) {
            clearTimeout(activityTimer);
            activityTimers.delete(userId);
          }

          player.activeActivity = undefined;
          console.log(`Activity cancelled for user ${userId} (starting new activity)`);

          // Emit cancellation event
          io.to(`user:${userId}`).emit('activity:cancelled', {
            success: true,
            message: 'Previous activity cancelled',
            reason: 'new_activity'
          });
        }

        // Check if in combat
        if (player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Cannot start activity while in combat'
            });
          }
          return;
        }

        // Get activity definition
        const activity = locationService.getActivity(activityId);
        if (!activity) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Activity not found' });
          }
          return;
        }

        // Validate requirements
        const validation = locationService.meetsActivityRequirements(activity, player);
        if (!validation.meets) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: validation.failures?.join(', ') || 'Requirements not met'
            });
          }
          return;
        }

        // Check if this is a combat activity
        if ((activity as any).type === 'combat') {
          // Delegate to combat handler - import combatService to start combat
          const combatService = require('../services/combatService').default;
          const monsterId = (activity as any).combatConfig?.monsterId;

          if (!monsterId) {
            if (typeof callback === 'function') {
              callback({ success: false, message: 'Combat activity missing monster ID' });
            }
            return;
          }

          try {
            // Start combat using combat service
            const combatResult = await combatService.startCombat(player, monsterId, activityId, itemService);

            if (!combatResult.success) {
              if (typeof callback === 'function') {
                callback({ success: false, message: combatResult.message });
              }
              return;
            }

            await player.save();

            // Notify user combat started
            if (typeof callback === 'function') {
              callback({
                success: true,
                message: `Combat started with ${combatResult.monster.name}!`,
                combat: combatResult.combat
              });
            }

            io.to(`user:${userId}`).emit('combat:started', {
              monster: combatResult.monster,
              combat: combatResult.combat
            });

            // Start both player and monster auto-attack timers
            schedulePlayerTurn(player, io, userId);
            scheduleMonsterTurn(player, io, userId);

            return; // Exit - combat is handled differently than activities
          } catch (error: any) {
            console.error('Error starting combat:', error);
            if (typeof callback === 'function') {
              callback({ success: false, message: error.message || 'Failed to start combat' });
            }
            return;
          }
        }

        // Get base duration (only on GatheringActivity)
        const baseDuration = (activity as GatheringActivity).duration || 10;

        // Apply trait/quality modifiers to duration
        const durationModifiers = effectEvaluator.getActivityDurationModifier(
          player,
          activity.type, // Activity type (e.g., 'gathering', 'woodcutting')
          player.currentLocation, // Current location
          activity // Pass the activity definition for requirement checking
        );

        // Calculate final duration: (base + flat) * (1 + percentage) * multiplier
        const finalDuration = effectEvaluator.calculateFinalValue(baseDuration, {
          flatBonus: durationModifiers.flat,
          percentageBonus: durationModifiers.percentage,
          multiplier: durationModifiers.multiplier,
          appliedEffects: [],
          skippedEffects: []
        });

        // Ensure duration is at least 1 second
        const duration = Math.max(1, Math.round(finalDuration));

        // Start activity
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 1000);

        player.activeActivity = {
          activityId,
          facilityId,
          locationId: player.currentLocation,
          startTime,
          endTime
        };

        await player.save();

        // Schedule completion with auto-restart
        scheduleActivityCompletion(io, userId, activityId, facilityId, activity, duration);

        // Send success response
        if (typeof callback === 'function') {
          callback({
            success: true,
            message: `Started ${activity.name}`,
            activity: {
              activityId,
              name: activity.name,
              duration,
              endTime
            }
          });
        }

        // Emit progress event (optional - for UI updates)
        io.to(`user:${userId}`).emit('activity:started', {
          activityId,
          name: activity.name,
          duration,
          endTime
        });

      } catch (error) {
        console.error('Error starting activity:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to start activity'
          });
        }
      }
    });

    /**
     * Event: activity:cancel
     * Client cancels current activity
     */
    socket.on('activity:cancel', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.activeActivity || !player.activeActivity.activityId) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'No active activity to cancel' });
          }
          return;
        }

        // Clear timer
        const timer = activityTimers.get(userId);
        if (timer) {
          clearTimeout(timer);
          activityTimers.delete(userId);
        }

        // Clear activity
        player.activeActivity = undefined;
        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Activity cancelled'
          });
        }

        // Emit cancellation event
        io.to(`user:${userId}`).emit('activity:cancelled', {
          success: true
        });

      } catch (error) {
        console.error('Error cancelling activity:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to cancel activity'
          });
        }
      }
    });

    /**
     * Event: activity:getStatus
     * Client requests current activity status (for reconnection)
     */
    socket.on('activity:getStatus', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.activeActivity || !player.activeActivity.activityId) {
          if (typeof callback === 'function') {
            callback({
              success: true,
              active: false
            });
          }
          return;
        }

        // Get activity definition
        const activity = locationService.getActivity(player.activeActivity.activityId);
        if (!activity) {
          // Activity definition not found, clear it
          player.activeActivity = undefined;
          await player.save();

          if (typeof callback === 'function') {
            callback({
              success: true,
              active: false
            });
          }
          return;
        }

        const now = new Date();
        const timeRemaining = Math.max(0, player.activeActivity.endTime.getTime() - now.getTime());

        if (typeof callback === 'function') {
          callback({
            success: true,
            active: true,
            activity: {
              activityId: player.activeActivity.activityId,
              name: activity.name,
              startTime: player.activeActivity.startTime,
              endTime: player.activeActivity.endTime,
              timeRemaining: Math.ceil(timeRemaining / 1000)
            }
          });
        }

        // Restart timer if needed (in case of server restart)
        if (timeRemaining > 0 && !activityTimers.has(userId)) {
          const duration = (activity as GatheringActivity).duration || 10;

          const timer = setTimeout(async () => {
            try {
              const freshPlayer = await Player.findOne({ userId });
              if (!freshPlayer || !freshPlayer.activeActivity) {
                return;
              }

              // Get rewards from drop tables
              const rewards = locationService.calculateActivityRewards(activity, {
                player: freshPlayer,
                dropTableService,
                itemService
              });

              // Process rewards using centralized reward processor
              const result = await rewardProcessor.processRewardsWithQuests(
                freshPlayer,
                {
                  experience: rewards.experience,
                  items: rewards.items,
                  gold: rewards.gold
                },
                {
                  activityId: activity.activityId,
                  itemsAdded: [] // Will be populated by processRewards
                }
              );

              // Clear activity state
              freshPlayer.activeActivity = undefined;

              // Build skill/attribute updates for client response
              const skillUpdates: any = {};
              const attributeUpdates: any = {};

              for (const [skillName, xpResult] of Object.entries(result.xpRewards)) {
                skillUpdates[skillName] = {
                  ...xpResult.skill,
                  experience: xpResult.skill.experienceGained
                };
                if (xpResult.attribute) {
                  attributeUpdates[xpResult.attribute.attribute] = xpResult.attribute;
                }
              }

              // Emit completion event
              io.to(`user:${userId}`).emit('activity:completed', {
                success: true,
                activity: activity.name,
                rewards: {
                  experience: skillUpdates,
                  rawExperience: rewards.rawExperience,
                  items: result.itemsAdded,
                  gold: result.goldAdded
                },
                skillUpdates,
                attributeUpdates,
                questProgress: result.questProgress
              });

              activityTimers.delete(userId);
            } catch (error) {
              console.error(`Error completing activity for user ${userId}:`, error);
            }
          }, timeRemaining);

          activityTimers.set(userId, timer);
        }

      } catch (error) {
        console.error('Error getting activity status:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to get activity status'
          });
        }
      }
    });

    /**
     * Event: travel:start
     * Client starts travel to a new location
     */
    socket.on('travel:start', async (data: { locationId: string }, callback?: (response: any) => void) => {
      try {
        const { locationId } = data;

        if (!locationId) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Location ID is required'
            });
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

        // Check if already traveling
        if (player.travelState && player.travelState.isTravel) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Already traveling'
            });
          }
          return;
        }

        // Cancel any active activity (allow overwriting)
        if (player.activeActivity) {
          // Clear activity timer
          const activityTimer = activityTimers.get(userId);
          if (activityTimer) {
            clearTimeout(activityTimer);
            activityTimers.delete(userId);
          }

          player.activeActivity = undefined;
          console.log(`Activity cancelled for user ${userId} (starting travel)`);

          // Emit cancellation event
          io.to(`user:${userId}`).emit('activity:cancelled', {
            success: true,
            message: 'Activity cancelled',
            reason: 'travel'
          });
        }

        // Block travel if in combat
        if (player.isInCombat()) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Cannot travel while in combat'
            });
          }
          return;
        }

        // Get location
        const location = locationService.getLocationDetails(locationId);
        if (!location) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Location not found' });
          }
          return;
        }

        // Start travel (fixed 5 second duration for now)
        const travelDuration = 5;
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + travelDuration * 1000);

        player.travelState = {
          isTravel: true,
          targetLocationId: locationId,
          startTime,
          endTime
        };

        await player.save();

        // Clear any existing timer
        const existingTimer = travelTimers.get(userId);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Schedule arrival event
        const timer = setTimeout(async () => {
          try {
            const freshPlayer = await Player.findOne({ userId });
            if (!freshPlayer || !freshPlayer.travelState || !freshPlayer.travelState.isTravel) {
              return; // Travel was cancelled
            }

            // Update location
            freshPlayer.currentLocation = locationId;

            // Discover location if not already
            if (!freshPlayer.discoveredLocations.includes(locationId)) {
              freshPlayer.discoveredLocations.push(locationId);
            }

            // Update quest progress for location discovery
            await questService.onLocationDiscovered(freshPlayer, locationId);

            // Clear travel state
            freshPlayer.travelState = {
              isTravel: false,
              targetLocationId: null,
              startTime: null,
              endTime: null
            };

            await freshPlayer.save();

            // Emit arrival event
            io.to(`user:${userId}`).emit('travel:completed', {
              success: true,
              locationId,
              locationName: location.name
            });

            travelTimers.delete(userId);
          } catch (error) {
            console.error(`Error completing travel for user ${userId}:`, error);
            io.to(`user:${userId}`).emit('travel:error', {
              success: false,
              message: 'Failed to complete travel'
            });
          }
        }, travelDuration * 1000);

        travelTimers.set(userId, timer);

        if (typeof callback === 'function') {
          callback({
            success: true,
            message: `Traveling to ${location.name}`,
            travel: {
              destination: locationId,
              locationName: location.name,
              duration: travelDuration,
              endTime
            }
          });
        }

        io.to(`user:${userId}`).emit('travel:started', {
          destination: locationId,
          locationName: location.name,
          duration: travelDuration,
          endTime
        });

      } catch (error) {
        console.error('Error starting travel:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to start travel'
          });
        }
      }
    });

    /**
     * Event: travel:cancel
     * Client cancels travel
     */
    socket.on('travel:cancel', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.travelState || !player.travelState.isTravel) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Not currently traveling' });
          }
          return;
        }

        // Clear timer
        const timer = travelTimers.get(userId);
        if (timer) {
          clearTimeout(timer);
          travelTimers.delete(userId);
        }

        // Clear travel state
        player.travelState = {
          isTravel: false,
          targetLocationId: null,
          startTime: null,
          endTime: null
        };

        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Travel cancelled'
          });
        }

        io.to(`user:${userId}`).emit('travel:cancelled', {
          success: true
        });

      } catch (error) {
        console.error('Error cancelling travel:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to cancel travel'
          });
        }
      }
    });

    /**
     * Event: disconnect
     * Clean up timers on disconnect to prevent memory leaks
     */
    socket.on('disconnect', (reason: string) => {
      console.log(`✗ User disconnected from activity handler: ${userId} (${reason})`);

      // Clear activity timer if exists
      const activityTimer = activityTimers.get(userId);
      if (activityTimer) {
        clearTimeout(activityTimer);
        activityTimers.delete(userId);
        console.log(`[Activity] Cleared activity timer for disconnected user ${userId}`);
      }

      // Clear travel timer if exists
      const travelTimer = travelTimers.get(userId);
      if (travelTimer) {
        clearTimeout(travelTimer);
        travelTimers.delete(userId);
        console.log(`[Activity] Cleared travel timer for disconnected user ${userId}`);
      }
    });
  });
}
