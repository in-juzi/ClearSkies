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
   */
  createItemInstance(itemId, quantity = 1, qualities = {}, traits = []) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef) {
      throw new Error(`Item definition not found: ${itemId}`);
    }

    // Validate qualities
    for (const qualityId of Object.keys(qualities)) {
      if (!itemDef.allowedQualities.includes(qualityId)) {
        throw new Error(`Quality ${qualityId} not allowed for item ${itemId}`);
      }
      const qualityDef = this.getQualityDefinition(qualityId);
      if (!qualityDef) {
        throw new Error(`Quality definition not found: ${qualityId}`);
      }
      // Validate quality value is in range
      const value = qualities[qualityId];
      const [min, max] = qualityDef.range;
      if (value < min || value > max) {
        throw new Error(`Quality ${qualityId} value ${value} out of range [${min}, ${max}]`);
      }
    }

    // Validate traits
    for (const traitId of traits) {
      if (!itemDef.allowedTraits.includes(traitId)) {
        throw new Error(`Trait ${traitId} not allowed for item ${itemId}`);
      }
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) {
        throw new Error(`Trait definition not found: ${traitId}`);
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

    // Apply quality modifiers
    if (itemInstance.qualities) {
      for (const [qualityId, value] of Object.entries(itemInstance.qualities)) {
        const qualityDef = this.getQualityDefinition(qualityId);
        if (qualityDef?.effects?.vendorPrice) {
          // For numeric modifiers, scale by quality value
          const qualityModifier = qualityDef.effects.vendorPrice.modifier;
          modifier += qualityModifier * value;
        }
      }
    }

    // Apply trait modifiers
    if (itemInstance.traits) {
      for (const traitId of itemInstance.traits) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef?.effects?.vendorPrice) {
          modifier *= traitDef.effects.vendorPrice.modifier;
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

    // Get quality details
    const qualityDetails = {};
    if (itemInstance.qualities) {
      for (const [qualityId, value] of Object.entries(itemInstance.qualities)) {
        const qualityDef = this.getQualityDefinition(qualityId);
        if (qualityDef) {
          qualityDetails[qualityId] = {
            ...qualityDef,
            value
          };
        }
      }
    }

    // Get trait details
    const traitDetails = [];
    if (itemInstance.traits) {
      for (const traitId of itemInstance.traits) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef) {
          traitDetails.push(traitDef);
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

    // Must have identical qualities
    const qualities1 = JSON.stringify(instance1.qualities || {});
    const qualities2 = JSON.stringify(instance2.qualities || {});
    if (qualities1 !== qualities2) {
      return false;
    }

    // Must have identical traits
    const traits1 = JSON.stringify((instance1.traits || []).sort());
    const traits2 = JSON.stringify((instance2.traits || []).sort());
    if (traits1 !== traits2) {
      return false;
    }

    return true;
  }

  /**
   * Generate random qualities for an item based on tier/rarity
   */
  generateRandomQualities(itemId) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef || !itemDef.allowedQualities.length) {
      return {};
    }

    const qualities = {};
    for (const qualityId of itemDef.allowedQualities) {
      // Generate quality value based on item tier
      // Higher tier = better average qualities
      const tier = itemDef.properties.tier || 1;
      const baseValue = 0.3 + (tier * 0.1); // Tier 1: 0.4, Tier 2: 0.5, Tier 3: 0.6
      const variance = 0.3;

      let value = baseValue + (Math.random() * variance * 2 - variance);
      value = Math.max(0, Math.min(1, value)); // Clamp to [0, 1]

      qualities[qualityId] = Math.round(value * 100) / 100; // Round to 2 decimals
    }

    return qualities;
  }

  /**
   * Generate random traits for an item based on rarity
   */
  generateRandomTraits(itemId) {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef || !itemDef.allowedTraits.length) {
      return [];
    }

    const traits = [];
    const rarityChances = {
      common: 0.05,
      uncommon: 0.15,
      rare: 0.30,
      epic: 0.50
    };

    for (const traitId of itemDef.allowedTraits) {
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) continue;

      const chance = rarityChances[traitDef.rarity] || 0.05;
      if (Math.random() < chance) {
        traits.push(traitId);
      }
    }

    return traits;
  }
}

// Create singleton instance
const itemService = new ItemService();

module.exports = itemService;
