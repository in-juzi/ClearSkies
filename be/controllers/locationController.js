const Player = require('../models/Player');
const locationService = require('../services/locationService');
const itemService = require('../services/itemService');
const { jsonSafe } = require('../utils/jsonSafe');

/**
 * Get all discovered locations
 */
exports.getDiscoveredLocations = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const locations = player.discoveredLocations.map(locationId => {
      const location = locationService.getLocationDetails(locationId);
      return location ? {
        locationId: location.locationId,
        name: location.name,
        description: location.description,
        biome: location.biome
      } : null;
    }).filter(l => l);

    res.json({ locations });
  } catch (error) {
    console.error('Error fetching discovered locations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get current location with full details
 */
exports.getCurrentLocation = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const location = locationService.getLocationDetails(player.currentLocation);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get specific location details
 */
exports.getLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if player has discovered this location
    if (!player.discoveredLocations.includes(locationId)) {
      return res.status(403).json({ message: 'Location not yet discovered' });
    }

    const location = locationService.getLocationDetails(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ location });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Start traveling to a new location
 */
exports.startTravel = async (req, res) => {
  try {
    const { targetLocationId } = req.body;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if already traveling or doing an activity
    if (player.travelState.isTravel) {
      return res.status(400).json({ message: 'Already traveling' });
    }

    if (player.activeActivity.activityId) {
      return res.status(400).json({ message: 'Cannot travel while doing an activity' });
    }

    // Get current location and find navigation link
    const currentLocation = locationService.getLocationDetails(player.currentLocation);
    if (!currentLocation) {
      return res.status(404).json({ message: 'Current location not found' });
    }

    const navLink = currentLocation.navigationLinks.find(link => link.targetLocationId === targetLocationId);
    if (!navLink) {
      return res.status(400).json({ message: 'Cannot travel to that location from here' });
    }

    // Check requirements
    const reqCheck = locationService.meetsNavigationRequirements(navLink, player);
    if (!reqCheck.meets) {
      return res.status(403).json({
        message: 'Requirements not met',
        failures: reqCheck.failures
      });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Check travel status and complete if finished
 */
exports.getTravelStatus = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.travelState.isTravel) {
      return res.json({
        isTravel: false,
        message: 'Not currently traveling'
      });
    }

    const now = new Date();
    const isComplete = now >= player.travelState.endTime;

    if (isComplete) {
      // Complete travel
      player.currentLocation = player.travelState.targetLocationId;

      // Discover new location
      if (!player.discoveredLocations.includes(player.travelState.targetLocationId)) {
        player.discoveredLocations.push(player.travelState.targetLocationId);
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

      return res.json({
        isTravel: false,
        completed: true,
        newLocation: {
          ...newLocation,
          navigationLinks: availableLinks
        },
        message: `Arrived at ${newLocation.name}`
      });
    }

    // Still traveling
    const remainingTime = Math.ceil((player.travelState.endTime - now) / 1000);

    res.json({
      isTravel: true,
      completed: false,
      travelState: player.travelState,
      remainingTime
    });
  } catch (error) {
    console.error('Error checking travel status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Cancel current travel
 */
exports.cancelTravel = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.travelState.isTravel) {
      return res.status(400).json({ message: 'Not currently traveling' });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Skip travel (dev feature - sets endTime to 1 second from now)
 */
exports.skipTravel = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.travelState.isTravel) {
      return res.status(400).json({ message: 'Not currently traveling' });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get facility details with activities
 */
exports.getFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const facility = locationService.getFacilityDetails(facilityId);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Start an activity
 */
exports.startActivity = async (req, res) => {
  try {
    const { activityId, facilityId } = req.body;
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if traveling
    if (player.travelState.isTravel) {
      return res.status(400).json({ message: 'Cannot start activity while traveling' });
    }

    // Get activity
    const activity = locationService.getActivity(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check requirements
    const reqCheck = locationService.meetsActivityRequirements(activity, player);
    if (!reqCheck.meets) {
      return res.status(403).json({
        message: 'Requirements not met',
        failures: reqCheck.failures
      });
    }

    // Start activity
    const now = new Date();
    const endTime = new Date(now.getTime() + activity.duration * 1000);

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
      duration: activity.duration
    });
  } catch (error) {
    console.error('Error starting activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get current activity status
 */
exports.getActivityStatus = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.activeActivity.activityId) {
      return res.json({
        active: false,
        message: 'No active activity'
      });
    }

    const now = new Date();
    const isComplete = now >= player.activeActivity.endTime;

    if (isComplete) {
      const activity = locationService.getActivity(player.activeActivity.activityId);

      return res.json({
        active: true,
        completed: true,
        activity,
        canClaim: true
      });
    }

    // Still in progress
    const remainingTime = Math.ceil((player.activeActivity.endTime - now) / 1000);

    const activity = locationService.getActivity(player.activeActivity.activityId);

    res.json({
      active: true,
      completed: false,
      activity,
      remainingTime
    });
  } catch (error) {
    console.error('Error checking activity status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Complete activity and claim rewards
 */
exports.completeActivity = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.activeActivity.activityId) {
      return res.status(400).json({ message: 'No active activity' });
    }

    const now = new Date();
    if (now < player.activeActivity.endTime) {
      return res.status(400).json({ message: 'Activity not yet complete' });
    }

    // Get activity and calculate rewards
    const activity = locationService.getActivity(player.activeActivity.activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Handle stub activities
    if (activity.stub) {
      player.activeActivity = {
        activityId: null,
        facilityId: null,
        locationId: null,
        startTime: null,
        endTime: null
      };
      await player.save();

      return res.json({
        message: activity.stubMessage || 'Activity completed (stub)',
        stub: true
      });
    }

    const rewards = locationService.calculateActivityRewards(activity, { player });

    // Award experience (already scaled by locationService)
    const expResults = {};
    for (const [skillOrAttr, xp] of Object.entries(rewards.experience)) {
      // Check if it's a skill
      if (player.skills[skillOrAttr]) {
        const result = await player.addSkillExperience(skillOrAttr, xp);
        expResults[skillOrAttr] = {
          ...result,
          experience: xp  // Include the XP that was awarded (scaled)
        };
      } else if (player.attributes[skillOrAttr]) {
        const result = await player.addAttributeExperience(skillOrAttr, xp);
        expResults[skillOrAttr] = {
          ...result,
          experience: xp  // Include the XP that was awarded (scaled)
        };
      }
    }

    // Award items
    const itemsAdded = [];
    for (const itemReward of rewards.items) {
      const qualities = itemService.generateRandomQualities(itemReward.itemId);
      const traits = itemService.generateRandomTraits(itemReward.itemId);
      const itemInstance = itemService.createItemInstance(itemReward.itemId, itemReward.quantity, qualities, traits);

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
    const restartEndTime = new Date(restartTime.getTime() + activity.duration * 1000);

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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Cancel current activity
 */
exports.cancelActivity = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id });

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.activeActivity.activityId) {
      return res.status(400).json({ message: 'No active activity to cancel' });
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all location definitions (admin/debug)
 */
exports.getAllDefinitions = async (req, res) => {
  try {
    const locations = locationService.getAllLocations();
    res.json({ locations });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Reload location data (admin/debug)
 */
exports.reloadDefinitions = async (req, res) => {
  try {
    await locationService.loadAll();
    res.json({ message: 'Location data reloaded successfully' });
  } catch (error) {
    console.error('Error reloading definitions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
