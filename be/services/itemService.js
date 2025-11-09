const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ItemService {
  constructor() {
    this.itemDefinitions = new Map();
    this.qualityDefinitions = new Map();
    this.traitDefinitions = new Map();
    this.initialized = false;
  }

  /**
   * Load all item, quality, and trait definitions from JSON files
   */
  async loadDefinitions() {
    try {
      const dataPath = path.join(__dirname, '../data/items');

      // Load qualities
      const qualitiesPath = path.join(dataPath, 'qualities/qualities.json');
      const qualitiesData = await fs.readFile(qualitiesPath, 'utf8');
      const qualities = JSON.parse(qualitiesData);
      Object.values(qualities).forEach(quality => {
        this.qualityDefinitions.set(quality.qualityId, quality);
      });

      // Load traits
      const traitsPath = path.join(dataPath, 'traits/traits.json');
      const traitsData = await fs.readFile(traitsPath, 'utf8');
      const traits = JSON.parse(traitsData);
      Object.values(traits).forEach(trait => {
        this.traitDefinitions.set(trait.traitId, trait);
      });

      // Load item definitions from multiple files
      const definitionsPath = path.join(dataPath, 'definitions');
      const files = await fs.readdir(definitionsPath);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(definitionsPath, file);
          const fileData = await fs.readFile(filePath, 'utf8');
          const items = JSON.parse(fileData);
          Object.values(items).forEach(item => {
            this.itemDefinitions.set(item.itemId, item);
          });
        }
      }

      this.initialized = true;
      console.log(`✓ Loaded ${this.itemDefinitions.size} items, ${this.qualityDefinitions.size} qualities, ${this.traitDefinitions.size} traits`);

      return {
        items: this.itemDefinitions.size,
        qualities: this.qualityDefinitions.size,
        traits: this.traitDefinitions.size
      };
    } catch (error) {
      console.error('Error loading item definitions:', error);
      throw error;
    }
  }

  /**
   * Hot reload definitions without restarting server
   */
  async reloadDefinitions() {
    this.itemDefinitions.clear();
    this.qualityDefinitions.clear();
    this.traitDefinitions.clear();
    return await this.loadDefinitions();
  }

  /**
   * Get an item definition by ID
   */
  getItemDefinition(itemId) {
    return this.itemDefinitions.get(itemId);
  }

  /**
   * Get all item definitions
   */
  getAllItemDefinitions() {
    return Array.from(this.itemDefinitions.values());
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category) {
    return Array.from(this.itemDefinitions.values())
      .filter(item => item.category === category);
  }

  /**
   * Get a quality definition by ID
   */
  getQualityDefinition(qualityId) {
    return this.qualityDefinitions.get(qualityId);
  }

  /**
   * Get a trait definition by ID
   */
  getTraitDefinition(traitId) {
    return this.traitDefinitions.get(traitId);
  }

  /**
   * Create a new item instance with optional qualities and traits
   * qualities: Map of qualityId -> level (integer 1-5)
   * traits: Map of traitId -> level (integer 1-3)
   */
  createItemInstance(itemId, quantity = 1, qualities = {}, traits = {}) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef) {
      throw new Error(`Item definition not found: ${itemId}`);
    }

    // Validate qualities (now level-based)
    for (const [qualityId, level] of Object.entries(qualities)) {
      if (!itemDef.allowedQualities.includes(qualityId)) {
        throw new Error(`Quality ${qualityId} not allowed for item ${itemId}`);
      }
      const qualityDef = this.getQualityDefinition(qualityId);
      if (!qualityDef) {
        throw new Error(`Quality definition not found: ${qualityId}`);
      }
      // Validate level is integer and in range
      if (!Number.isInteger(level) || level < 1 || level > qualityDef.maxLevel) {
        throw new Error(`Quality ${qualityId} level ${level} out of range [1, ${qualityDef.maxLevel}]`);
      }
    }

    // Validate traits (now level-based)
    for (const [traitId, level] of Object.entries(traits)) {
      if (!itemDef.allowedTraits.includes(traitId)) {
        throw new Error(`Trait ${traitId} not allowed for item ${itemId}`);
      }
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) {
        throw new Error(`Trait definition not found: ${traitId}`);
      }
      // Validate level is integer and in range
      if (!Number.isInteger(level) || level < 1 || level > traitDef.maxLevel) {
        throw new Error(`Trait ${traitId} level ${level} out of range [1, ${traitDef.maxLevel}]`);
      }
    }

    return {
      instanceId: uuidv4(),
      itemId,
      quantity,
      qualities,
      traits,
      acquiredAt: new Date()
    };
  }

  /**
   * Calculate the vendor price for an item instance
   */
  calculateVendorPrice(itemInstance) {
    const itemDef = this.getItemDefinition(itemInstance.itemId);
    if (!itemDef) {
      throw new Error(`Item definition not found: ${itemInstance.itemId}`);
    }

    let price = itemDef.baseValue;
    let modifier = 1.0;

    // Apply quality modifiers (level-based)
    if (itemInstance.qualities) {
      for (const [qualityId, level] of Object.entries(itemInstance.qualities)) {
        const qualityDef = this.getQualityDefinition(qualityId);
        if (qualityDef?.levels?.[level]?.effects?.vendorPrice) {
          const levelModifier = qualityDef.levels[level].effects.vendorPrice.modifier;
          modifier *= levelModifier;
        }
      }
    }

    // Apply trait modifiers (level-based)
    if (itemInstance.traits) {
      for (const [traitId, level] of Object.entries(itemInstance.traits)) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef?.levels?.[level]?.effects?.vendorPrice) {
          const levelModifier = traitDef.levels[level].effects.vendorPrice.modifier;
          modifier *= levelModifier;
        }
      }
    }

    return Math.round(price * modifier);
  }

  /**
   * Get full item details including definition and calculated properties
   */
  getItemDetails(itemInstance) {
    const itemDef = this.getItemDefinition(itemInstance.itemId);
    if (!itemDef) {
      return null;
    }

    const vendorPrice = this.calculateVendorPrice(itemInstance);

    // Get quality details (level-based)
    const qualityDetails = {};
    if (itemInstance.qualities) {
      for (const [qualityId, level] of Object.entries(itemInstance.qualities)) {
        const qualityDef = this.getQualityDefinition(qualityId);
        if (qualityDef && qualityDef.levels?.[level]) {
          qualityDetails[qualityId] = {
            qualityId,
            name: qualityDef.name,
            shorthand: qualityDef.shorthand,
            level,
            maxLevel: qualityDef.maxLevel,
            levelData: qualityDef.levels[level]
          };
        }
      }
    }

    // Get trait details (level-based)
    const traitDetails = {};
    if (itemInstance.traits) {
      for (const [traitId, level] of Object.entries(itemInstance.traits)) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef && traitDef.levels?.[level]) {
          traitDetails[traitId] = {
            traitId,
            name: traitDef.name,
            shorthand: traitDef.shorthand,
            rarity: traitDef.rarity,
            level,
            maxLevel: traitDef.maxLevel,
            levelData: traitDef.levels[level]
          };
        }
      }
    }

    return {
      ...itemInstance,
      definition: itemDef,
      vendorPrice,
      qualityDetails,
      traitDetails
    };
  }

  /**
   * Check if two item instances can be stacked together
   * Items must have identical itemId, qualities (levels), and traits (levels)
   */
  canStack(instance1, instance2) {
    // Must be same item
    if (instance1.itemId !== instance2.itemId) {
      return false;
    }

    const itemDef = this.getItemDefinition(instance1.itemId);
    if (!itemDef || !itemDef.stackable) {
      return false;
    }

    // Must have identical quality levels (Map comparison)
    const qualities1 = this._sortedMapString(instance1.qualities || {});
    const qualities2 = this._sortedMapString(instance2.qualities || {});
    if (qualities1 !== qualities2) {
      return false;
    }

    // Must have identical trait levels (Map comparison)
    const traits1 = this._sortedMapString(instance1.traits || {});
    const traits2 = this._sortedMapString(instance2.traits || {});
    if (traits1 !== traits2) {
      return false;
    }

    return true;
  }

  /**
   * Convert a Map/Object to a sorted JSON string for comparison
   */
  _sortedMapString(map) {
    // Handle Mongoose Map objects by converting to plain object
    let plainMap = map;
    if (map && typeof map.toObject === 'function') {
      // Mongoose Map - toObject() returns a JS Map, need to convert further
      const mongooseMapResult = map.toObject();
      if (mongooseMapResult instanceof Map) {
        plainMap = Object.fromEntries(mongooseMapResult);
      } else {
        plainMap = mongooseMapResult;
      }
    } else if (map && map instanceof Map) {
      // JavaScript Map - convert to plain object
      plainMap = Object.fromEntries(map);
    }

    // Convert to array of [key, value] pairs and sort by key
    const entries = Object.entries(plainMap || {}).sort((a, b) => a[0].localeCompare(b[0]));
    return JSON.stringify(entries);
  }

  /**
   * Generate random qualities for an item based on tier/rarity
   * Returns Map of qualityId -> level (integer 1-5)
   */
  generateRandomQualities(itemId) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef || !itemDef.allowedQualities.length) {
      return {};
    }

    const qualities = {};
    for (const qualityId of itemDef.allowedQualities) {
      const qualityDef = this.getQualityDefinition(qualityId);
      if (!qualityDef) continue;

      // Generate quality level based on item tier
      // Higher tier = better average quality levels
      const tier = itemDef.properties.tier || 1;
      const maxLevel = qualityDef.maxLevel;

      // Use weighted random distribution
      // Tier 1: average level 2-3, Tier 2: average level 3-4, Tier 3: average level 4-5
      const weights = this._getQualityLevelWeights(tier, maxLevel);
      const level = this._weightedRandomLevel(weights);

      qualities[qualityId] = level;
    }

    return qualities;
  }

  /**
   * Get weighted distribution for quality levels based on tier
   */
  _getQualityLevelWeights(tier, maxLevel) {
    // Returns array of weights for each level [1, 2, 3, 4, 5]
    if (tier === 1) {
      // Tier 1: Common quality (levels 1-3 most common)
      return [0.25, 0.40, 0.25, 0.08, 0.02];
    } else if (tier === 2) {
      // Tier 2: Better quality (levels 2-4 most common)
      return [0.10, 0.25, 0.35, 0.25, 0.05];
    } else {
      // Tier 3+: High quality (levels 3-5 most common)
      return [0.05, 0.10, 0.25, 0.35, 0.25];
    }
  }

  /**
   * Select a level based on weighted probabilities
   */
  _weightedRandomLevel(weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * total;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return i + 1; // Level is 1-indexed
      }
    }

    return weights.length; // Fallback to max level
  }

  /**
   * Generate random traits for an item based on rarity
   * Returns Map of traitId -> level (integer 1-3)
   */
  generateRandomTraits(itemId) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef || !itemDef.allowedTraits.length) {
      return {};
    }

    const traits = {};
    const rarityChances = {
      common: 0.05,
      uncommon: 0.15,
      rare: 0.30,
      epic: 0.50
    };

    for (const traitId of itemDef.allowedTraits) {
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) continue;

      // Inverted rarity: rarer traits have LOWER chance to appear
      const chance = rarityChances[traitDef.rarity] || 0.05;
      if (Math.random() < chance) {
        // Trait appears! Now determine level (1-3)
        // Higher rarity traits have better chance of higher levels
        const level = this._generateTraitLevel(traitDef.rarity);
        traits[traitId] = level;
      }
    }

    return traits;
  }

  /**
   * Generate a trait level based on trait rarity
   */
  _generateTraitLevel(rarity) {
    // Returns 1, 2, or 3
    let weights;

    if (rarity === 'common') {
      // Common: mostly level 1
      weights = [0.70, 0.25, 0.05];
    } else if (rarity === 'uncommon') {
      // Uncommon: mostly level 1-2
      weights = [0.50, 0.40, 0.10];
    } else if (rarity === 'rare') {
      // Rare: balanced distribution
      weights = [0.30, 0.50, 0.20];
    } else if (rarity === 'epic') {
      // Epic: favor higher levels
      weights = [0.15, 0.40, 0.45];
    } else {
      // Default to common distribution
      weights = [0.70, 0.25, 0.05];
    }

    return this._weightedRandomLevel(weights);
  }
}

// Create singleton instance
const itemService = new ItemService();

module.exports = itemService;
