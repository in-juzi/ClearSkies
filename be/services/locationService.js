const fs = require('fs').promises;
const path = require('path');
const dropTableService = require('./dropTableService');

class LocationService {
  constructor() {
    this.biomes = new Map();
    this.locations = new Map();
    this.facilities = new Map();
    this.activities = new Map();
    this.dropTableService = dropTableService;
    this.loaded = false;
  }

  /**
   * Load all location data from JSON files
   */
  async loadAll() {
    try {
      await Promise.all([
        this.loadBiomes(),
        this.loadActivities(),
        this.loadFacilities(),
        this.loadLocations(),
        this.dropTableService.loadAll()
      ]);
      this.loaded = true;
      console.log('Location data loaded successfully');
      console.log(`- ${this.biomes.size} biomes`);
      console.log(`- ${this.locations.size} locations`);
      console.log(`- ${this.facilities.size} facilities`);
      console.log(`- ${this.activities.size} activities`);
    } catch (error) {
      console.error('Error loading location data:', error);
      throw error;
    }
  }

  /**
   * Load biome definitions
   */
  async loadBiomes() {
    const biomesDir = path.join(__dirname, '../data/locations/biomes');
    const files = await fs.readdir(biomesDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(biomesDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const biome = JSON.parse(data);
        this.biomes.set(biome.biomeId, biome);
      }
    }
  }

  /**
   * Load activity definitions
   */
  async loadActivities() {
    const activitiesDir = path.join(__dirname, '../data/locations/activities');
    const files = await fs.readdir(activitiesDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(activitiesDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const activity = JSON.parse(data);
        this.activities.set(activity.activityId, activity);
      }
    }
  }

  /**
   * Load facility definitions
   */
  async loadFacilities() {
    const facilitiesDir = path.join(__dirname, '../data/locations/facilities');
    const files = await fs.readdir(facilitiesDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(facilitiesDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const facility = JSON.parse(data);
        this.facilities.set(facility.facilityId, facility);
      }
    }
  }

  /**
   * Load location definitions
   */
  async loadLocations() {
    const locationsDir = path.join(__dirname, '../data/locations/definitions');
    const files = await fs.readdir(locationsDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(locationsDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const location = JSON.parse(data);
        this.locations.set(location.locationId, location);
      }
    }
  }

  /**
   * Get a location with all its related data (biome, facilities, activities)
   */
  getLocationDetails(locationId) {
    const location = this.locations.get(locationId);
    if (!location) return null;

    const biome = this.biomes.get(location.biome);

    const facilities = location.facilities.map(facilityId => {
      const facility = this.facilities.get(facilityId);
      if (!facility) return null;

      const activities = facility.activities.map(activityId =>
        this.activities.get(activityId)
      ).filter(a => a);

      return {
        ...facility,
        activities
      };
    }).filter(f => f);

    return {
      ...location,
      biome,
      facilities
    };
  }

  /**
   * Get facility with its activities
   */
  getFacilityDetails(facilityId) {
    const facility = this.facilities.get(facilityId);
    if (!facility) return null;

    const activities = facility.activities.map(activityId =>
      this.activities.get(activityId)
    ).filter(a => a);

    return {
      ...facility,
      activities
    };
  }

  /**
   * Get activity by ID
   */
  getActivity(activityId) {
    return this.activities.get(activityId);
  }

  /**
   * Get all locations
   */
  getAllLocations() {
    return Array.from(this.locations.values());
  }

  /**
   * Get starting location
   */
  getStartingLocation() {
    return Array.from(this.locations.values()).find(loc => loc.isStartingLocation);
  }

  /**
   * Check if player meets requirements for an activity
   */
  meetsActivityRequirements(activity, player) {
    if (!activity.requirements) return { meets: true };

    const failures = [];

    // Check skill requirements
    if (activity.requirements.skills) {
      for (const [skillName, requiredLevel] of Object.entries(activity.requirements.skills)) {
        const playerSkill = player.skills?.[skillName];
        console.log(`[Activity Req Check] Skill ${skillName}: Required=${requiredLevel}, Player has=${playerSkill?.level || 'none'}`);
        if (!playerSkill || playerSkill.level < requiredLevel) {
          failures.push(`Requires ${skillName} level ${requiredLevel}`);
        }
      }
    }

    // Check attribute requirements
    if (activity.requirements.attributes) {
      for (const [attrName, requiredLevel] of Object.entries(activity.requirements.attributes)) {
        const playerAttr = player.attributes?.[attrName];
        console.log(`[Activity Req Check] Attribute ${attrName}: Required=${requiredLevel}, Player has=${playerAttr?.level || 'none'}`);
        if (!playerAttr || playerAttr.level < requiredLevel) {
          failures.push(`Requires ${attrName} level ${requiredLevel}`);
        }
      }
    }

    // Check item requirements
    if (activity.requirements.items) {
      for (const itemId of activity.requirements.items) {
        const hasItem = player.inventory?.some(item => item.itemId === itemId);
        if (!hasItem) {
          failures.push(`Requires item: ${itemId}`);
        }
      }
    }

    return {
      meets: failures.length === 0,
      failures
    };
  }

  /**
   * Check if player meets requirements for navigation
   */
  meetsNavigationRequirements(navigationLink, player) {
    if (!navigationLink.requirements || Object.keys(navigationLink.requirements).length === 0) {
      return { meets: true };
    }

    const failures = [];

    // Check attribute requirements
    if (navigationLink.requirements.attributes) {
      for (const [attrName, requiredLevel] of Object.entries(navigationLink.requirements.attributes)) {
        const playerAttr = player.attributes?.[attrName];
        if (!playerAttr || playerAttr.level < requiredLevel) {
          failures.push(`Requires ${attrName} level ${requiredLevel}`);
        }
      }
    }

    // Check item requirements
    if (navigationLink.requirements.items) {
      for (const itemId of navigationLink.requirements.items) {
        const hasItem = player.inventory?.some(item => item.itemId === itemId);
        if (!hasItem) {
          failures.push(`Requires item: ${itemId}`);
        }
      }
    }

    return {
      meets: failures.length === 0,
      failures
    };
  }

  /**
   * Calculate activity rewards
   */
  calculateActivityRewards(activity, options = {}) {
    const rewards = {
      experience: activity.rewards.experience || {},
      items: [],
      gold: 0
    };

    // Roll on drop tables (new system)
    if (activity.rewards.dropTables && Array.isArray(activity.rewards.dropTables)) {
      const drops = this.dropTableService.rollMultipleDropTables(
        activity.rewards.dropTables,
        options
      );

      for (const drop of drops) {
        rewards.items.push({
          itemId: drop.itemId,
          quantity: drop.quantity,
          qualityBonus: drop.qualityBonus,
          qualityMultiplier: drop.qualityMultiplier
        });
      }
    }

    // Legacy: Roll for item drops (old system - backward compatible)
    if (activity.rewards.items) {
      for (const itemReward of activity.rewards.items) {
        if (Math.random() <= itemReward.chance) {
          const quantity = itemReward.quantity.min +
            Math.floor(Math.random() * (itemReward.quantity.max - itemReward.quantity.min + 1));

          rewards.items.push({
            itemId: itemReward.itemId,
            quantity
          });
        }
      }
    }

    // Roll for gold
    if (activity.rewards.gold) {
      rewards.gold = activity.rewards.gold.min +
        Math.floor(Math.random() * (activity.rewards.gold.max - activity.rewards.gold.min + 1));
    }

    return rewards;
  }
}

// Create singleton instance
const locationService = new LocationService();

module.exports = locationService;
