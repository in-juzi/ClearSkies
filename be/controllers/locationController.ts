import { Request, Response } from 'express';
import Player from '../models/Player';
import locationService from '../services/locationService';
import itemService from '../services/itemService';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface StartTravelRequest {
  targetLocationId: string;
}

interface StartActivityRequest {
  activityId: string;
  facilityId: string;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * GET /api/locations/discovered
 * Get all discovered locations
 */
export const getDiscoveredLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const locations = player.discoveredLocations
      .map(locationId => {
        const location = locationService.getLocationDetails(locationId);
        return location
          ? {
              locationId: location.locationId,
              name: location.name,
              description: location.description,
              biome: location.biome
            }
          : null;
      })
      .filter(l => l);

    res.json({ locations });
  } catch (error: any) {
    console.error('Error getting discovered locations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/locations/all
 * Get all locations (including undiscovered)
 */
export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const allLocationDefs = locationService.getAllLocations();

    const locations = allLocationDefs.map(location => ({
      locationId: location.locationId,
      name: location.name,
      description: location.description,
      biome: location.biome,
      mapPosition: location.mapPosition,
      navigationLinks: location.navigationLinks,
      facilities: location.facilities.map(facilityId => {
        const facility = locationService.getFacilityDetails(facilityId);
        return facility || null;
      }).filter(f => f)
    }));

    res.json({ locations });
  } catch (error) {
    console.error('Error fetching discovered locations:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/current
 * Get current location with full details
 */
export const getCurrentLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const location = locationService.getLocationDetails(player.currentLocation);

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    // Check which navigation links are available to the player
    const availableLinks = location.navigationLinks.map(link => {
      const reqCheck = locationService.meetsNavigationRequirements(link, player);
      return {
        ...link,
        available: reqCheck.meets,
        requirementFailures: reqCheck.failures || []
      };
    });

    res.json({
      location: {
        ...location,
        navigationLinks: availableLinks
      },
      currentActivity: player.activeActivity,
      travelState: player.travelState
    });
  } catch (error) {
    console.error('Error fetching current location:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/:locationId
 * Get specific location details
 */
export const getLocation = async (
  req: Request<{ locationId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { locationId } = req.params;
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if player has discovered this location
    if (!player.discoveredLocations.includes(locationId)) {
      res.status(403).json({ message: 'Location not yet discovered' });
      return;
    }

    const location = locationService.getLocationDetails(locationId);

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    res.json({ location });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/travel/start
 * Start traveling to a new location
 * Body: { targetLocationId }
 */
export const startTravel = async (
  req: Request<{}, {}, StartTravelRequest>,
  res: Response
): Promise<void> => {
  try {
    const { targetLocationId } = req.body;
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if already traveling or doing an activity
    if (player.travelState.isTravel) {
      res.status(400).json({ message: 'Already traveling' });
      return;
    }

    if (player.activeActivity.activityId) {
      res.status(400).json({ message: 'Cannot travel while doing an activity' });
      return;
    }

    // Get current location and find navigation link
    const currentLocation = locationService.getLocationDetails(player.currentLocation);
    if (!currentLocation) {
      res.status(404).json({ message: 'Current location not found' });
      return;
    }

    const navLink = currentLocation.navigationLinks.find(
      link => link.targetLocationId === targetLocationId
    );
    if (!navLink) {
      res.status(400).json({ message: 'Cannot travel to that location from here' });
      return;
    }

    // Check requirements
    const reqCheck = locationService.meetsNavigationRequirements(navLink, player);
    if (!reqCheck.meets) {
      res.status(403).json({
        message: 'Requirements not met',
        failures: reqCheck.failures
      });
      return;
    }

    // Start travel
    const now = new Date();
    const endTime = new Date(now.getTime() + navLink.travelTime * 1000);

    player.travelState = {
      isTravel: true,
      targetLocationId,
      startTime: now,
      endTime
    };

    await player.save();

    res.json({
      message: 'Travel started',
      travelState: player.travelState,
      duration: navLink.travelTime
    });
  } catch (error) {
    console.error('Error starting travel:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/travel/status
 * Check travel status and complete if finished
 */
export const getTravelStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.travelState.isTravel) {
      res.json({
        isTravel: false,
        message: 'Not currently traveling'
      });
      return;
    }

    const now = new Date();
    const isComplete = now >= player.travelState.endTime;

    if (isComplete) {
      // Complete travel
      player.currentLocation = player.travelState.targetLocationId!;

      // Discover new location
      if (!player.discoveredLocations.includes(player.travelState.targetLocationId!)) {
        player.discoveredLocations.push(player.travelState.targetLocationId!);
      }

      // Clear travel state
      player.travelState = {
        isTravel: false,
        targetLocationId: null,
        startTime: null,
        endTime: null
      };

      await player.save();

      const newLocation = locationService.getLocationDetails(player.currentLocation);

      // Check which navigation links are available to the player (same as getCurrentLocation)
      const availableLinks = newLocation.navigationLinks.map(link => {
        const reqCheck = locationService.meetsNavigationRequirements(link, player);
        return {
          ...link,
          available: reqCheck.meets,
          requirementFailures: reqCheck.failures || []
        };
      });

      res.json({
        isTravel: false,
        completed: true,
        newLocation: {
          ...newLocation,
          navigationLinks: availableLinks
        },
        message: `Arrived at ${newLocation.name}`
      });
      return;
    }

    // Still traveling
    const remainingTime = Math.ceil((player.travelState.endTime.getTime() - now.getTime()) / 1000);

    res.json({
      isTravel: true,
      completed: false,
      travelState: player.travelState,
      remainingTime
    });
  } catch (error) {
    console.error('Error checking travel status:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/travel/cancel
 * Cancel current travel
 */
export const cancelTravel = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.travelState.isTravel) {
      res.status(400).json({ message: 'Not currently traveling' });
      return;
    }

    // Clear travel state (player stays at current location)
    player.travelState = {
      isTravel: false,
      targetLocationId: null,
      startTime: null,
      endTime: null
    };

    await player.save();

    res.json({
      message: 'Travel cancelled'
    });
  } catch (error) {
    console.error('Error cancelling travel:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/travel/skip
 * Skip travel (dev feature - sets endTime to 1 second from now)
 */
export const skipTravel = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.travelState.isTravel) {
      res.status(400).json({ message: 'Not currently traveling' });
      return;
    }

    // Set endTime to 1 second from now
    const now = new Date();
    player.travelState.endTime = new Date(now.getTime() + 1000);

    await player.save();

    res.json({
      message: 'Travel skipped to near completion',
      newEndTime: player.travelState.endTime
    });
  } catch (error) {
    console.error('Error skipping travel:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/facilities/:facilityId
 * Get facility details with activities
 */
export const getFacility = async (
  req: Request<{ facilityId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { facilityId } = req.params;
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const facility = locationService.getFacilityDetails(facilityId);

    if (!facility) {
      res.status(404).json({ message: 'Facility not found' });
      return;
    }

    // Check requirements for each activity
    const activitiesWithReqs = facility.activities.map(activity => {
      const reqCheck = locationService.meetsActivityRequirements(activity, player);
      return {
        ...activity,
        available: reqCheck.meets,
        requirementFailures: reqCheck.failures || []
      };
    });

    res.json({
      facility: {
        ...facility,
        activities: activitiesWithReqs
      }
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/activities/start
 * Start an activity
 * Body: { activityId, facilityId }
 */
export const startActivity = async (
  req: Request<{}, {}, StartActivityRequest>,
  res: Response
): Promise<void> => {
  try {
    const { activityId, facilityId } = req.body;
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if traveling
    if (player.travelState.isTravel) {
      res.status(400).json({ message: 'Cannot start activity while traveling' });
      return;
    }

    // Get activity
    const activity = locationService.getActivity(activityId);
    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    // Check requirements
    const reqCheck = locationService.meetsActivityRequirements(activity, player);
    if (!reqCheck.meets) {
      res.status(403).json({
        message: 'Requirements not met',
        failures: reqCheck.failures
      });
      return;
    }

    // Start activity
    const now = new Date();
    const endTime = new Date(now.getTime() + (activity as any).duration * 1000);

    player.activeActivity = {
      activityId,
      facilityId,
      locationId: player.currentLocation,
      startTime: now,
      endTime
    };

    await player.save();

    res.json({
      message: `Started: ${activity.name}`,
      activity: {
        ...activity,
        startTime: now,
        endTime
      },
      duration: (activity as any).duration
    });
  } catch (error) {
    console.error('Error starting activity:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/activities/status
 * Get current activity status
 */
export const getActivityStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.activeActivity.activityId) {
      res.json({
        active: false,
        message: 'No active activity'
      });
      return;
    }

    const now = new Date();
    const isComplete = now >= player.activeActivity.endTime;

    if (isComplete) {
      const activity = locationService.getActivity(player.activeActivity.activityId);

      res.json({
        active: true,
        completed: true,
        activity,
        canClaim: true
      });
      return;
    }

    // Still in progress
    const remainingTime = Math.ceil((player.activeActivity.endTime.getTime() - now.getTime()) / 1000);

    const activity = locationService.getActivity(player.activeActivity.activityId);

    res.json({
      active: true,
      completed: false,
      activity,
      remainingTime
    });
  } catch (error) {
    console.error('Error checking activity status:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/activities/complete
 * Complete activity and claim rewards
 */
export const completeActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.activeActivity.activityId) {
      res.status(400).json({ message: 'No active activity' });
      return;
    }

    const now = new Date();
    if (now < player.activeActivity.endTime) {
      res.status(400).json({ message: 'Activity not yet complete' });
      return;
    }

    // Get activity and calculate rewards
    const activity = locationService.getActivity(player.activeActivity.activityId);
    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    // Handle stub activities
    if ((activity as any).stub) {
      player.activeActivity = {
        activityId: null,
        facilityId: null,
        locationId: null,
        startTime: null,
        endTime: null
      };
      await player.save();

      res.json({
        message: (activity as any).stubMessage || 'Activity completed (stub)',
        stub: true
      });
      return;
    }

    const rewards = locationService.calculateActivityRewards(activity, { player });

    // Award experience (already scaled by locationService)
    const expResults: Record<string, any> = {};
    for (const [skillOrAttr, xp] of Object.entries(rewards.experience)) {
      const xpNumber = typeof xp === 'number' ? xp : Number(xp);

      // Check if it's a skill
      if (player.skills[skillOrAttr as keyof typeof player.skills]) {
        const result = await player.addSkillExperience(skillOrAttr as any, xpNumber);
        expResults[skillOrAttr] = {
          ...result,
          experience: xpNumber // Include the XP that was awarded (scaled)
        };
      } else if (player.attributes[skillOrAttr as keyof typeof player.attributes]) {
        const result = await player.addAttributeExperience(skillOrAttr as any, xpNumber);
        expResults[skillOrAttr] = {
          ...result,
          experience: xpNumber // Include the XP that was awarded (scaled)
        };
      }
    }

    // Award items
    const itemsAdded: any[] = [];
    for (const itemReward of rewards.items) {
      const qualities = itemService.generateRandomQualities(itemReward.itemId);
      const traits = itemService.generateRandomTraits(itemReward.itemId);
      const itemInstance = itemService.createItemInstance(
        itemReward.itemId,
        itemReward.quantity,
        qualities,
        traits
      );

      // Store the instanceId before adding to player (to avoid circular ref after add)
      const instanceId = itemInstance.instanceId;

      player.addItem(itemInstance);

      // Get item definition for display
      const itemDef = itemService.getItemDefinition(itemReward.itemId);

      // Convert Maps to plain objects for JSON response
      const plainQualities = qualities instanceof Map ? Object.fromEntries(qualities) : qualities;
      const plainTraits = traits instanceof Map ? Object.fromEntries(traits) : traits;

      itemsAdded.push({
        itemId: itemReward.itemId,
        name: itemDef?.name || itemReward.itemId,
        quantity: itemReward.quantity,
        instanceId: instanceId,
        qualities: plainQualities,
        traits: plainTraits
      });
    }

    // Award gold
    if (rewards.gold > 0) {
      player.addGold(rewards.gold);
    }

    // Store activity info before restarting
    const completedActivityId = player.activeActivity.activityId;
    const completedFacilityId = player.activeActivity.facilityId;

    // Automatically restart the same activity
    const restartTime = new Date();
    const restartEndTime = new Date(restartTime.getTime() + (activity as any).duration * 1000);

    player.activeActivity = {
      activityId: completedActivityId,
      facilityId: completedFacilityId,
      locationId: player.currentLocation,
      startTime: restartTime,
      endTime: restartEndTime
    };

    await player.save();

    res.json({
      message: `${activity.name} completed!`,
      rewards: {
        experience: expResults,
        rawExperience: rewards.rawExperience, // Include raw XP for UI display
        items: itemsAdded,
        gold: rewards.gold
      },
      activityRestarted: true,
      newActivity: {
        ...activity,
        startTime: restartTime,
        endTime: restartEndTime
      }
    });
  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/activities/cancel
 * Cancel current activity
 */
export const cancelActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await Player.findOne({ userId: req.user!._id });

    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.activeActivity.activityId) {
      res.status(400).json({ message: 'No active activity to cancel' });
      return;
    }

    const activity = locationService.getActivity(player.activeActivity.activityId);

    player.activeActivity = {
      activityId: null,
      facilityId: null,
      locationId: null,
      startTime: null,
      endTime: null
    };

    await player.save();

    res.json({
      message: `Cancelled: ${activity?.name || 'activity'}`
    });
  } catch (error) {
    console.error('Error cancelling activity:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/definitions
 * Get all location definitions (admin/debug)
 */
export const getAllDefinitions = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = locationService.getAllLocations();
    res.json({ locations });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * POST /api/locations/reload
 * Reload location data (admin/debug)
 */
export const reloadDefinitions = async (req: Request, res: Response): Promise<void> => {
  try {
    await locationService.loadAll();
    res.json({ message: 'Location data reloaded successfully' });
  } catch (error) {
    console.error('Error reloading definitions:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

/**
 * GET /api/locations/drop-tables/:dropTableId
 * Get drop table with enriched item information
 */
export const getDropTable = async (
  req: Request<{ dropTableId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { dropTableId } = req.params;

    const dropTable = locationService.getDropTable(dropTableId);

    if (!dropTable) {
      res.status(404).json({ message: 'Drop table not found' });
      return;
    }

    // Enrich drop table entries with item definitions
    const enrichedDrops = dropTable.drops.map(drop => {
      if (drop.itemId) {
        const itemDef = itemService.getItemDefinition(drop.itemId);
        return {
          ...drop,
          itemDef: itemDef || null
        };
      }
      return drop;
    });

    res.json({
      dropTable: {
        ...dropTable,
        enrichedDrops
      }
    });
  } catch (error) {
    console.error('Error fetching drop table:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
