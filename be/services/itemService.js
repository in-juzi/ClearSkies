const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ItemService {
  constructor() {
    this.itemDefinitions = new Map();
    this.qualityDefinitions = new Map();
    this.traitDefinitions = new Map();
    this.generationConfig = null;
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
        // Transform applicableCategories to applicableTo for consistency
        if (quality.applicableCategories && !quality.applicableTo) {
          quality.applicableTo = quality.applicableCategories;
        }
        this.qualityDefinitions.set(quality.qualityId, quality);
      });

      // Load traits
      const traitsPath = path.join(dataPath, 'traits/traits.json');
      const traitsData = await fs.readFile(traitsPath, 'utf8');
      const traits = JSON.parse(traitsData);
      Object.values(traits).forEach(trait => {
        // Transform applicableCategories to applicableTo for consistency
        if (trait.applicableCategories && !trait.applicableTo) {
          trait.applicableTo = trait.applicableCategories;
        }
        this.traitDefinitions.set(trait.traitId, trait);
      });

      // Load item definitions from multiple files and directories
      const definitionsPath = path.join(dataPath, 'definitions');
      await this._loadDefinitionsRecursive(definitionsPath);

      // Load generation config
      const configPath = path.join(dataPath, 'generation-config.json');
      try {
        const configData = await fs.readFile(configPath, 'utf8');
        this.generationConfig = JSON.parse(configData);
        console.log('✓ Loaded generation config');
      } catch (error) {
        console.warn('⚠ Could not load generation-config.json, using default values:', error.message);
        // Fallback to default config
        this.generationConfig = {
          qualityGeneration: {
            countDistribution: { "0": 0.35, "1": 0.45, "2": 0.15, "3": 0.05 },
            tierBasedLevels: true
          },
          traitGeneration: {
            appearanceRates: { common: 0.02, uncommon: 0.08, rare: 0.15, epic: 0.30 }
          }
        };
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
   * Recursively load item definitions from a directory
   * Supports both JSON files and subdirectories with JSON files
   */
  async _loadDefinitionsRecursive(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively load from subdirectory
        await this._loadDefinitionsRecursive(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        // Load JSON file
        const fileData = await fs.readFile(fullPath, 'utf8');
        const items = JSON.parse(fileData);
        Object.values(items).forEach(item => {
          this.itemDefinitions.set(item.itemId, item);
        });
      }
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
   * Get items by subcategory
   * @param {string} subcategory - The subcategory to filter by
   * @returns {Array} Items that have the specified subcategory
   */
  getItemsBySubcategory(subcategory) {
    return Array.from(this.itemDefinitions.values())
      .filter(item => item.subcategories && item.subcategories.includes(subcategory));
  }

  /**
   * Get all unique subcategories from items
   * @param {string} [category] - Optional category to filter by
   * @returns {Array} Array of unique subcategory strings
   */
  getAllSubcategories(category = null) {
    const subcategoriesSet = new Set();

    for (const item of this.itemDefinitions.values()) {
      // Filter by category if specified
      if (category && item.category !== category) {
        continue;
      }

      // Add all subcategories from this item
      if (item.subcategories && Array.isArray(item.subcategories)) {
        item.subcategories.forEach(sub => subcategoriesSet.add(sub));
      }
    }

    return Array.from(subcategoriesSet).sort();
  }

  /**
   * Validate item has required subcategory
   * @param {string} itemId - The item ID to check
   * @param {string} subcategory - The required subcategory
   * @returns {boolean} True if item has the subcategory
   */
  itemHasSubcategory(itemId, subcategory) {
    const item = this.getItemDefinition(itemId);
    return item && item.subcategories && item.subcategories.includes(subcategory);
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

    // Convert Mongoose document to plain object if needed
    const plainInstance = itemInstance.toObject ? itemInstance.toObject() : itemInstance;

    // Convert Mongoose Maps to plain objects
    if (plainInstance.qualities instanceof Map) {
      plainInstance.qualities = Object.fromEntries(plainInstance.qualities);
    }
    if (plainInstance.traits instanceof Map) {
      plainInstance.traits = Object.fromEntries(plainInstance.traits);
    }

    return {
      ...plainInstance,
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

    const allowedCount = itemDef.allowedQualities.length;

    // Determine how many qualities to generate based on config distribution
    const qualityCount = this._rollQualityCount(allowedCount);

    if (qualityCount === 0) {
      return {}; // Plain item, no qualities
    }

    // Randomly select which qualities to include
    const selectedQualities = this._selectRandomQualities(itemDef.allowedQualities, qualityCount);

    // Generate level for each selected quality using tier-based distribution
    const qualities = {};
    const tier = itemDef.properties.tier || 1;

    for (const qualityId of selectedQualities) {
      const qualityDef = this.getQualityDefinition(qualityId);
      if (!qualityDef) continue;

      const maxLevel = qualityDef.maxLevel;
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
    // Base weights for each tier
    let weights;
    if (tier === 1) {
      // Tier 1: Common quality (levels 1-3 most common)
      weights = [0.25, 0.40, 0.25, 0.08, 0.02];
    } else if (tier === 2) {
      // Tier 2: Better quality (levels 2-4 most common)
      weights = [0.10, 0.25, 0.35, 0.25, 0.05];
    } else {
      // Tier 3+: High quality (levels 3-5 most common)
      weights = [0.05, 0.10, 0.25, 0.35, 0.25];
    }

    // Apply level damping if configured
    const damping = this.generationConfig.qualityGeneration.levelDamping;
    if (damping !== undefined && damping > 0 && damping < 1) {
      weights = this._applyLevelDamping(weights, damping);
    }

    return weights;
  }

  /**
   * Apply damping to shift probability distribution toward lower levels
   * @param {Array<number>} weights - Original weight distribution
   * @param {number} damping - Damping factor (0-1), higher = more damping toward low levels
   * @returns {Array<number>} Damped weight distribution
   */
  _applyLevelDamping(weights, damping) {
    // Apply exponential decay based on level position
    // Lower levels get boosted, higher levels get reduced
    const dampedWeights = weights.map((weight, index) => {
      const levelPosition = index / (weights.length - 1); // 0 to 1
      const dampingFactor = Math.pow(1 - levelPosition, damping * 2); // Exponential curve
      return weight * (1 + dampingFactor);
    });

    // Normalize to sum to 1
    const total = dampedWeights.reduce((sum, w) => sum + w, 0);
    return dampedWeights.map(w => w / total);
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
    const rarityChances = this.generationConfig.traitGeneration.appearanceRates;

    for (const traitId of itemDef.allowedTraits) {
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) continue;

      // Inverted rarity: rarer traits have LOWER chance to appear
      const chance = rarityChances[traitDef.rarity] || 0.02;
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

  /**
   * Roll how many qualities an item should have based on config distribution
   * @param {number} maxAllowed - Maximum allowed qualities for this item
   * @returns {number} Number of qualities to generate (0 to maxAllowed)
   */
  _rollQualityCount(maxAllowed) {
    const distribution = this.generationConfig.qualityGeneration.countDistribution;
    const random = Math.random();
    let cumulativeProbability = 0;

    // Iterate through distribution (0, 1, 2, 3, etc.)
    for (const [countStr, probability] of Object.entries(distribution)) {
      const count = parseInt(countStr);
      cumulativeProbability += probability;

      if (random < cumulativeProbability) {
        // Cap at maxAllowed
        return Math.min(count, maxAllowed);
      }
    }

    // Fallback: return minimum of 1 or maxAllowed
    return Math.min(1, maxAllowed);
  }

  /**
   * Randomly select N qualities from the allowed qualities array
   * @param {Array<string>} allowedQualities - Array of quality IDs
   * @param {number} count - How many to select
   * @returns {Array<string>} Array of selected quality IDs
   */
  _selectRandomQualities(allowedQualities, count) {
    if (count >= allowedQualities.length) {
      return [...allowedQualities]; // Return all if count >= allowed
    }

    // Fisher-Yates shuffle and take first N elements
    const shuffled = [...allowedQualities];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }
}

// Create singleton instance
const itemService = new ItemService();

module.exports = itemService;
