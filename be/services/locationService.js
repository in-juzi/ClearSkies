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

    // Check equipped item requirements (by subtype)
    if (activity.requirements.equipped) {
      const itemService = require('./itemService');
      for (const equippedReq of activity.requirements.equipped) {
        const { subtype } = equippedReq;
        const hasEquipped = player.hasEquippedSubtype(subtype, itemService);
        console.log(`[Activity Req Check] Equipped ${subtype}: Player has=${hasEquipped}`);
        if (!hasEquipped) {
          failures.push(`Requires ${subtype} equipped`);
        }
      }
    }

    // Check inventory item requirements (with quantity)
    if (activity.requirements.inventory) {
      for (const invReq of activity.requirements.inventory) {
        const { itemId, quantity = 1 } = invReq;
        const hasItem = player.hasInventoryItem(itemId, quantity);
        console.log(`[Activity Req Check] Inventory ${itemId} (${quantity}x): Player has=${hasItem}`);
        if (!hasItem) {
          const itemService = require('./itemService');
          const itemDef = itemService.getItemDefinition(itemId);
          const itemName = itemDef?.name || itemId;
          failures.push(`Requires ${quantity}x ${itemName} in inventory`);
        }
      }
    }

    // Legacy support: Check old-style item requirements (deprecated)
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
   * Calculate scaled XP based on player level vs activity level
   * Uses polynomial decay with grace range (0-1 levels over = full XP)
   *
   * @param {number} rawXP - Base XP from activity definition
   * @param {number} playerLevel - Player's current level in the skill
   * @param {number} activityLevel - Required level for the activity
   * @returns {number} Scaled XP (minimum 1)
   */
  calculateScaledXP(rawXP, playerLevel, activityLevel) {
    const levelDiff = playerLevel - activityLevel;

    // Grace range: 0-1 levels over = full XP
    if (levelDiff <= 1) {
      return rawXP;
    }

    // Polynomial decay: 1 / (1 + 0.3 * (diff - 1))
    // Smoother than linear, gentler than exponential
    const effectiveDiff = levelDiff - 1; // Subtract grace level
    const scalingFactor = 1 / (1 + 0.3 * effectiveDiff);

    // Apply floor of 1 XP
    return Math.max(1, Math.floor(rawXP * scalingFactor));
  }

  /**
   * Calculate activity rewards with XP scaling
   */
  calculateActivityRewards(activity, options = {}) {
    const { player } = options;

    const rewards = {
      experience: {},
      rawExperience: activity.rewards.experience || {}, // Keep raw values for UI
      items: [],
      gold: 0
    };

    // Apply XP scaling if player context provided
    if (activity.rewards.experience) {
      for (const [skillName, rawXP] of Object.entries(activity.rewards.experience)) {
        if (player && player.skills && player.skills[skillName]) {
          const playerLevel = player.skills[skillName].level;
          const activityLevel = activity.requirements?.skills?.[skillName] || 1;

          rewards.experience[skillName] = this.calculateScaledXP(rawXP, playerLevel, activityLevel);
        } else {
          // No player context or skill not found - use raw XP
          rewards.experience[skillName] = rawXP;
        }
      }
    }

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
