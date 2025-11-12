import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  Item,
  ItemInstance,
  QualityDefinition,
  TraitDefinition,
  ItemGenerationConfig,
  ItemCategory,
  QualityMap,
  TraitMap,
  Rarity
} from '../types';

class ItemService {
  private itemDefinitions: Map<string, Item> = new Map();
  private qualityDefinitions: Map<string, QualityDefinition> = new Map();
  private traitDefinitions: Map<string, TraitDefinition> = new Map();
  private generationConfig: ItemGenerationConfig | null = null;
  private initialized: boolean = false;

  /**
   * Load all item, quality, and trait definitions from JSON files
   */
  async loadDefinitions(): Promise<{ items: number; qualities: number; traits: number }> {
    try {
      const dataPath = path.join(__dirname, '../data/items');

      // Load qualities
      const qualitiesPath = path.join(dataPath, 'qualities/qualities.json');
      const qualitiesData = await fs.readFile(qualitiesPath, 'utf8');
      const qualities = JSON.parse(qualitiesData);
      Object.values(qualities).forEach((quality: any) => {
        // Transform applicableCategories to applicableTo for consistency
        if (quality.applicableCategories && !quality.applicableTo) {
          quality.applicableTo = quality.applicableCategories;
        }
        this.qualityDefinitions.set(quality.qualityId, quality as QualityDefinition);
      });

      // Load traits
      const traitsPath = path.join(dataPath, 'traits/traits.json');
      const traitsData = await fs.readFile(traitsPath, 'utf8');
      const traits = JSON.parse(traitsData);
      Object.values(traits).forEach((trait: any) => {
        // Transform applicableCategories to applicableTo for consistency
        if (trait.applicableCategories && !trait.applicableTo) {
          trait.applicableTo = trait.applicableCategories;
        }
        this.traitDefinitions.set(trait.traitId, trait as TraitDefinition);
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
      } catch (error: any) {
        console.warn('⚠ Could not load generation-config.json, using default values:', error.message);
        // Fallback to default config
        this.generationConfig = {
          qualityDistribution: { none: 0.35, one: 0.45, two: 0.15, three: 0.05, four: 0 },
          traitAppearanceRates: { common: 0.02, uncommon: 0.08, rare: 0.15, epic: 0.30, legendary: 0.50 },
          qualityLevelDamping: 0.6,
          tierBasedLevelDistribution: {
            enabled: true,
            baseLevelForTier: { 1: 1, 2: 2, 3: 3 }
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
  private async _loadDefinitionsRecursive(dirPath: string): Promise<void> {
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
        Object.values(items).forEach((item: any) => {
          this.itemDefinitions.set(item.itemId, item as Item);
        });
      }
    }
  }

  /**
   * Hot reload definitions without restarting server
   */
  async reloadDefinitions(): Promise<{ items: number; qualities: number; traits: number }> {
    this.itemDefinitions.clear();
    this.qualityDefinitions.clear();
    this.traitDefinitions.clear();
    return await this.loadDefinitions();
  }

  /**
   * Get an item definition by ID
   */
  getItemDefinition(itemId: string): Item | undefined {
    return this.itemDefinitions.get(itemId);
  }

  /**
   * Get all item definitions
   */
  getAllItemDefinitions(): Item[] {
    return Array.from(this.itemDefinitions.values());
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: ItemCategory): Item[] {
    return Array.from(this.itemDefinitions.values())
      .filter(item => item.category === category);
  }

  /**
   * Get items by subcategory
   */
  getItemsBySubcategory(subcategory: string): Item[] {
    return Array.from(this.itemDefinitions.values())
      .filter(item => item.subcategories && item.subcategories.includes(subcategory));
  }

  /**
   * Get all unique subcategories from items
   */
  getAllSubcategories(category: ItemCategory | null = null): string[] {
    const subcategoriesSet = new Set<string>();

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
   */
  itemHasSubcategory(itemId: string, subcategory: string): boolean {
    const item = this.getItemDefinition(itemId);
    return item !== undefined && item.subcategories !== undefined && item.subcategories.includes(subcategory);
  }

  /**
   * Get a quality definition by ID
   */
  getQualityDefinition(qualityId: string): QualityDefinition | undefined {
    return this.qualityDefinitions.get(qualityId);
  }

  /**
   * Get a trait definition by ID
   */
  getTraitDefinition(traitId: string): TraitDefinition | undefined {
    return this.traitDefinitions.get(traitId);
  }

  /**
   * Create a new item instance with optional qualities and traits
   * qualities: Map of qualityId -> level (integer 1-5)
   * traits: Map of traitId -> level (integer 1-3)
   */
  createItemInstance(
    itemId: string,
    quantity: number = 1,
    qualities: QualityMap = {},
    traits: TraitMap = {}
  ): ItemInstance {
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
      const maxLevel = qualityDef.levels.length;
      if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        throw new Error(`Quality ${qualityId} level ${level} out of range [1, ${maxLevel}]`);
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
      const maxLevel = traitDef.levels.length;
      if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        throw new Error(`Trait ${traitId} level ${level} out of range [1, ${maxLevel}]`);
      }
    }

    return {
      instanceId: uuidv4(),
      itemId,
      quantity,
      qualities,
      traits,
      equipped: false
    };
  }

  /**
   * Calculate the vendor price for an item instance
   */
  calculateVendorPrice(itemInstance: ItemInstance): number {
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
        if (qualityDef?.levels?.[level - 1]?.effects?.vendorPriceMultiplier) {
          const levelModifier = qualityDef.levels[level - 1].effects.vendorPriceMultiplier;
          modifier *= levelModifier;
        }
      }
    }

    // Apply trait modifiers (level-based)
    if (itemInstance.traits) {
      for (const [traitId, level] of Object.entries(itemInstance.traits)) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef?.levels?.[level - 1]?.effects?.vendorPriceMultiplier) {
          const levelModifier = traitDef.levels[level - 1].effects.vendorPriceMultiplier;
          modifier *= levelModifier;
        }
      }
    }

    return Math.round(price * modifier);
  }

  /**
   * Get full item details including definition and calculated properties
   */
  getItemDetails(itemInstance: any): any {
    const itemDef = this.getItemDefinition(itemInstance.itemId);
    if (!itemDef) {
      return null;
    }

    const vendorPrice = this.calculateVendorPrice(itemInstance);

    // Get quality details (level-based)
    const qualityDetails: Record<string, any> = {};
    if (itemInstance.qualities) {
      for (const [qualityId, level] of Object.entries(itemInstance.qualities)) {
        const qualityDef = this.getQualityDefinition(qualityId);
        if (qualityDef && qualityDef.levels?.[level as number - 1]) {
          qualityDetails[qualityId] = {
            qualityId,
            name: qualityDef.name,
            level,
            maxLevel: qualityDef.levels.length,
            levelData: qualityDef.levels[level as number - 1]
          };
        }
      }
    }

    // Get trait details (level-based)
    const traitDetails: Record<string, any> = {};
    if (itemInstance.traits) {
      for (const [traitId, level] of Object.entries(itemInstance.traits)) {
        const traitDef = this.getTraitDefinition(traitId);
        if (traitDef && traitDef.levels?.[level as number - 1]) {
          traitDetails[traitId] = {
            traitId,
            name: traitDef.name,
            rarity: traitDef.rarity,
            level,
            maxLevel: traitDef.levels.length,
            levelData: traitDef.levels[level as number - 1]
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
  canStack(instance1: ItemInstance, instance2: ItemInstance): boolean {
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
  _sortedMapString(map: any): string {
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
  generateRandomQualities(itemId: string): QualityMap {
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
    const qualities: QualityMap = {};
    const tier = itemDef.properties.tier || 1;

    for (const qualityId of selectedQualities) {
      const qualityDef = this.getQualityDefinition(qualityId);
      if (!qualityDef) continue;

      const maxLevel = qualityDef.levels.length;
      const weights = this._getQualityLevelWeights(tier, maxLevel);
      const level = this._weightedRandomLevel(weights);

      qualities[qualityId] = level;
    }

    return qualities;
  }

  /**
   * Get weighted distribution for quality levels based on tier
   */
  private _getQualityLevelWeights(tier: number, maxLevel: number): number[] {
    // Base weights for each tier
    let weights: number[];
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
    const damping = this.generationConfig?.qualityLevelDamping;
    if (damping !== undefined && damping > 0 && damping < 1) {
      weights = this._applyLevelDamping(weights, damping);
    }

    return weights;
  }

  /**
   * Apply damping to shift probability distribution toward lower levels
   */
  private _applyLevelDamping(weights: number[], damping: number): number[] {
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
  private _weightedRandomLevel(weights: number[]): number {
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
  generateRandomTraits(itemId: string): TraitMap {
    const itemDef = this.getItemDefinition(itemId);
    if (!itemDef || !itemDef.allowedTraits.length) {
      return {};
    }

    const traits: TraitMap = {};
    const rarityChances = this.generationConfig?.traitAppearanceRates;

    for (const traitId of itemDef.allowedTraits) {
      const traitDef = this.getTraitDefinition(traitId);
      if (!traitDef) continue;

      // Inverted rarity: rarer traits have LOWER chance to appear
      const chance = rarityChances?.[traitDef.rarity] || 0.02;
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
  private _generateTraitLevel(rarity: Rarity): number {
    // Returns 1, 2, or 3
    let weights: number[];

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
   */
  private _rollQualityCount(maxAllowed: number): number {
    if (!this.generationConfig) return Math.min(1, maxAllowed);

    const distribution = this.generationConfig.qualityDistribution;
    const random = Math.random();
    let cumulativeProbability = 0;

    // Iterate through distribution (none, one, two, three, four)
    const countKeys = ['none', 'one', 'two', 'three', 'four'];
    for (let i = 0; i < countKeys.length; i++) {
      const key = countKeys[i] as keyof typeof distribution;
      const probability = distribution[key];
      cumulativeProbability += probability;

      if (random < cumulativeProbability) {
        // Cap at maxAllowed
        return Math.min(i, maxAllowed);
      }
    }

    // Fallback: return minimum of 1 or maxAllowed
    return Math.min(1, maxAllowed);
  }

  /**
   * Randomly select N qualities from the allowed qualities array
   */
  private _selectRandomQualities(allowedQualities: string[], count: number): string[] {
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

export default itemService;
