import { Request, Response } from 'express';
import itemService from '../services/itemService';
import locationService from '../services/locationService';

/**
 * Manual Controller
 * Provides public (unauthenticated) access to game reference data
 */

// ============================================================================
// Static Reference Data
// ============================================================================

const SKILLS_DATA = [
  {
    skillId: 'woodcutting',
    name: 'Woodcutting',
    description: 'The art of felling trees and harvesting timber. Essential for gathering wood resources.',
    mainAttribute: 'strength',
    icon: 'icons/skills/skill_woodcutting.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'mining',
    name: 'Mining',
    description: 'Extract valuable ores and minerals from the earth. Strength and endurance are key.',
    mainAttribute: 'strength',
    icon: 'icons/ui/ui_dig_1.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'fishing',
    name: 'Fishing',
    description: 'Catch fish from rivers, lakes, and seas. Patience and endurance yield the best catches.',
    mainAttribute: 'endurance',
    icon: 'icons/ui/ui_fishing_new.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'smithing',
    name: 'Smithing',
    description: 'Forge weapons, armor, and tools at the anvil. Transform raw materials into powerful equipment.',
    mainAttribute: 'endurance',
    icon: 'icons/skills/skill_blacksmithing.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'cooking',
    name: 'Cooking',
    description: 'Prepare food and potions. A well-fed adventurer is a successful one.',
    mainAttribute: 'will',
    icon: 'icons/skills/skill_cooking.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'herbalism',
    name: 'Herbalism',
    description: 'Gather herbs and plants for cooking and alchemy.',
    mainAttribute: 'will',
    icon: 'icons/skills/skill_herbalism.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'oneHanded',
    name: 'One-Handed',
    description: 'Master weapons wielded in one hand for versatile combat.',
    mainAttribute: 'strength',
    icon: 'icons/skills/skill_one_handed.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'dualWield',
    name: 'Dual Wield',
    description: 'Wield two weapons simultaneously for devastating attacks.',
    mainAttribute: 'dexterity',
    icon: 'icons/skills/skill_dual_wield.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'twoHanded',
    name: 'Two-Handed',
    description: 'Swing massive weapons that require both hands to wield.',
    mainAttribute: 'strength',
    icon: 'icons/skills/skill_two_handed.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'ranged',
    name: 'Ranged',
    description: 'Attack from distance with bows and thrown weapons.',
    mainAttribute: 'dexterity',
    icon: 'icons/skills/skill_ranged.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'casting',
    name: 'Casting',
    description: 'Channel magical energies for powerful spells.',
    mainAttribute: 'magic',
    icon: 'icons/skills/skill_casting.svg',
    xpPerLevel: 1000
  },
  {
    skillId: 'gun',
    name: 'Gun',
    description: 'Precision shooting with firearms.',
    mainAttribute: 'perception',
    icon: 'icons/skills/skill_gun.svg',
    xpPerLevel: 1000
  }
];

const ATTRIBUTES_DATA = [
  {
    attributeId: 'strength',
    name: 'Strength',
    description: 'Physical power and melee combat prowess. Increases damage with heavy weapons.',
    icon: 'icons/attributes/attr_strength.svg',
    linkedSkills: ['woodcutting', 'mining', 'oneHanded', 'twoHanded'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'endurance',
    name: 'Endurance',
    description: 'Stamina and resilience. Affects health, carry capacity, and sustained activities.',
    icon: 'icons/attributes/attr_endurance.svg',
    linkedSkills: ['fishing', 'smithing'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'magic',
    name: 'Magic',
    description: 'Arcane power and spellcasting ability. Essential for mages.',
    icon: 'icons/attributes/attr_magic.svg',
    linkedSkills: ['casting'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'perception',
    name: 'Perception',
    description: 'Awareness and accuracy. Improves ranged attacks and critical hits.',
    icon: 'icons/attributes/attr_perception.svg',
    linkedSkills: ['gun'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'dexterity',
    name: 'Dexterity',
    description: 'Agility and finesse. Increases evasion and attack speed.',
    icon: 'icons/attributes/attr_dexterity.svg',
    linkedSkills: ['dualWield', 'ranged'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'will',
    name: 'Will',
    description: 'Mental fortitude and focus. Enhances crafting and gathering.',
    icon: 'icons/attributes/attr_will.svg',
    linkedSkills: ['cooking', 'herbalism'],
    xpPerLevel: 1000
  },
  {
    attributeId: 'charisma',
    name: 'Charisma',
    description: 'Social influence and leadership. Improves vendor prices and party bonuses.',
    icon: 'icons/attributes/attr_charisma.svg',
    linkedSkills: [],
    xpPerLevel: 1000
  }
];

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * Get all skills with descriptions and attribute links
 * @route GET /api/manual/skills
 * @access Public
 */
export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      skills: SKILLS_DATA,
      xpSystem: {
        xpPerLevel: 1000,
        attributeLinking: 'Skills award 50% of earned XP to their linked attribute',
        levelFormula: 'Level = floor(XP / 1000) + 1'
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch skills data' });
  }
};

/**
 * Get all attributes with descriptions
 * @route GET /api/manual/attributes
 * @access Public
 */
export const getAttributes = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      attributes: ATTRIBUTES_DATA,
      xpSystem: {
        xpPerLevel: 1000,
        levelFormula: 'Level = floor(XP / 1000) + 1'
      }
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attributes data' });
  }
};

/**
 * Get all items grouped by category
 * @route GET /api/manual/items
 * @access Public
 */
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all items using public method
    const allItems = itemService.getAllItemDefinitions();
    const itemsByCategory: Record<string, any[]> = {};

    for (const item of allItems) {
      const itemData: any = {
        itemId: item.itemId,
        name: item.name,
        description: item.description,
        category: item.category,
        subcategories: item.subcategories,
        rarity: item.rarity,
        baseValue: item.baseValue,
        stackable: item.stackable,
        icon: item.icon
      };

      // Add tier if it exists (on equipment items)
      if ('properties' in item && item.properties && 'tier' in item.properties) {
        itemData.tier = (item.properties as any).tier;
      }

      // Map categories to plural form
      const categoryMap: Record<string, string> = {
        equipment: 'equipment',
        resource: 'resources',
        consumable: 'consumables'
      };

      const pluralCategory = categoryMap[item.category] || item.category;

      if (!itemsByCategory[pluralCategory]) {
        itemsByCategory[pluralCategory] = [];
      }
      itemsByCategory[pluralCategory].push(itemData);
    }

    res.json({
      success: true,
      categories: itemsByCategory,
      totalItems: allItems.length
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch items data' });
  }
};

/**
 * Get quality definitions
 * @route GET /api/manual/qualities
 * @access Public
 */
export const getQualities = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access using public interface - qualities are loaded as part of item service
    const qualities = [];
    const qualityDefs = (itemService as any).qualityDefinitions || new Map();

    for (const [qualityId, quality] of qualityDefs.entries()) {
      const levelsArray = Object.entries(quality.levels).map(([level, data]: [string, any]) => ({
        level: parseInt(level),
        name: data.name,
        description: data.description,
        vendorPriceModifier: data.effects?.vendorPrice?.modifier || 1.0
      }));

      qualities.push({
        qualityId: quality.qualityId,
        name: quality.name,
        description: quality.description,
        levels: levelsArray,
        maxLevel: quality.maxLevel
      });
    }

    res.json({
      success: true,
      qualities,
      totalQualities: qualityDefs.size
    });
  } catch (error) {
    console.error('Error fetching qualities:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch qualities data' });
  }
};

/**
 * Get trait definitions
 * @route GET /api/manual/traits
 * @access Public
 */
export const getTraits = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access using public interface - traits are loaded as part of item service
    const traits = [];
    const traitDefs = (itemService as any).traitDefinitions || new Map();

    for (const [traitId, trait] of traitDefs.entries()) {
      const levelsArray = Object.entries(trait.levels).map(([level, data]: [string, any]) => ({
        level: parseInt(level),
        name: data.name,
        description: data.description,
        vendorPriceModifier: data.effects?.vendorPrice?.modifier || 1.0
      }));

      traits.push({
        traitId: trait.traitId,
        name: trait.name,
        description: trait.description,
        rarity: trait.rarity,
        levels: levelsArray,
        maxLevel: trait.maxLevel
      });
    }

    res.json({
      success: true,
      traits,
      totalTraits: traitDefs.size
    });
  } catch (error) {
    console.error('Error fetching traits:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch traits data' });
  }
};

/**
 * Get all locations
 * @route GET /api/manual/locations
 * @access Public
 */
export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access using public interface
    const locationDefs = (locationService as any).locations || new Map();

    const locations = [];
    for (const [locationId, location] of locationDefs.entries()) {
      locations.push({
        locationId: location.locationId,
        name: location.name,
        description: location.description,
        biomeId: location.biome || location.biomeId,
        facilities: location.facilities
      });
    }

    res.json({
      success: true,
      locations,
      totalLocations: locationDefs.size
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch locations data' });
  }
};

/**
 * Get all biomes
 * @route GET /api/manual/biomes
 * @access Public
 */
export const getBiomes = async (req: Request, res: Response): Promise<void> => {
  try {
    // Access using public interface
    const biomeDefs = (locationService as any).biomes || new Map();

    const biomes = [];
    for (const [biomeId, biome] of biomeDefs.entries()) {
      biomes.push({
        biomeId: biome.biomeId,
        name: biome.name,
        description: biome.description
      });
    }

    res.json({
      success: true,
      biomes,
      totalBiomes: biomeDefs.size
    });
  } catch (error) {
    console.error('Error fetching biomes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch biomes data' });
  }
};
