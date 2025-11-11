const itemService = require('../services/itemService');
const locationService = require('../services/locationService');

/**
 * Manual Controller
 * Provides public (unauthenticated) access to game reference data
 */

/**
 * Get all skills with descriptions and attribute links
 * @route GET /api/manual/skills
 * @access Public
 */
const getSkills = async (req, res) => {
  try {
    const skills = [
      {
        skillId: 'woodcutting',
        name: 'Woodcutting',
        description: 'The art of felling trees and harvesting timber. Essential for gathering wood resources.',
        mainAttribute: 'strength',
        icon: 'skill_woodcutting.svg',
        xpPerLevel: 1000
      },
      {
        skillId: 'mining',
        name: 'Mining',
        description: 'Extract valuable ores and minerals from the earth. Strength and endurance are key.',
        mainAttribute: 'strength',
        icon: 'skill_mining.svg',
        xpPerLevel: 1000
      },
      {
        skillId: 'fishing',
        name: 'Fishing',
        description: 'Catch fish from rivers, lakes, and seas. Patience and endurance yield the best catches.',
        mainAttribute: 'endurance',
        icon: 'skill_fishing.svg',
        xpPerLevel: 1000
      },
      {
        skillId: 'smithing',
        name: 'Smithing',
        description: 'Forge weapons, armor, and tools at the anvil. Transform raw materials into powerful equipment.',
        mainAttribute: 'endurance',
        icon: 'skill_smithing.svg',
        xpPerLevel: 1000
      },
      {
        skillId: 'cooking',
        name: 'Cooking',
        description: 'Prepare food and potions. A well-fed adventurer is a successful one.',
        mainAttribute: 'will',
        icon: 'skill_cooking.svg',
        xpPerLevel: 1000
      }
    ];

    res.json({
      success: true,
      skills,
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
const getAttributes = async (req, res) => {
  try {
    const attributes = [
      {
        attributeId: 'strength',
        name: 'Strength',
        description: 'Physical power and melee combat prowess. Increases damage with heavy weapons.',
        icon: 'attribute_strength.svg',
        linkedSkills: ['woodcutting', 'mining'],
        xpPerLevel: 1000
      },
      {
        attributeId: 'endurance',
        name: 'Endurance',
        description: 'Stamina and resilience. Affects health, carry capacity, and sustained activities.',
        icon: 'attribute_endurance.svg',
        linkedSkills: ['fishing', 'smithing'],
        xpPerLevel: 1000
      },
      {
        attributeId: 'magic',
        name: 'Magic',
        description: 'Magical aptitude and spellcasting power. Increases spell effectiveness.',
        icon: 'attribute_magic.svg',
        linkedSkills: [],
        xpPerLevel: 1000
      },
      {
        attributeId: 'perception',
        name: 'Perception',
        description: 'Awareness and keen senses. Improves discovery chances and ranged accuracy.',
        icon: 'attribute_perception.svg',
        linkedSkills: [],
        xpPerLevel: 1000
      },
      {
        attributeId: 'dexterity',
        name: 'Dexterity',
        description: 'Agility and finesse. Enhances dodge chance and precision with light weapons.',
        icon: 'attribute_dexterity.svg',
        linkedSkills: [],
        xpPerLevel: 1000
      },
      {
        attributeId: 'will',
        name: 'Will',
        description: 'Mental fortitude and focus. Increases mana and resistance to mental effects.',
        icon: 'attribute_will.svg',
        linkedSkills: ['cooking'],
        xpPerLevel: 1000
      },
      {
        attributeId: 'charisma',
        name: 'Charisma',
        description: 'Social influence and leadership. Improves prices with vendors and NPC interactions.',
        icon: 'attribute_charisma.svg',
        linkedSkills: [],
        xpPerLevel: 1000
      }
    ];

    res.json({
      success: true,
      attributes,
      xpSystem: {
        xpPerLevel: 1000,
        skillLinking: 'Attributes gain 50% of XP from linked skills',
        levelFormula: 'Level = floor(XP / 1000) + 1'
      }
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attributes data' });
  }
};

/**
 * Get item categories overview
 * @route GET /api/manual/items
 * @access Public
 */
const getItems = async (req, res) => {
  try {
    // Ensure item service is initialized
    if (!itemService.initialized) {
      await itemService.loadDefinitions();
    }

    // Organize items by category
    const itemsByCategory = {
      resources: [],
      equipment: [],
      consumables: []
    };

    for (const [itemId, item] of itemService.itemDefinitions.entries()) {
      const itemData = {
        itemId: item.itemId,
        name: item.name,
        description: item.description,
        tier: item.tier,
        rarity: item.rarity,
        icon: item.icon,
        category: item.category,
        subcategories: item.subcategories || [],
        stackable: item.maxStack > 1,
        maxStack: item.maxStack
      };

      // Add equipment-specific data
      if (item.category === 'equipment') {
        itemData.slot = item.slot;
        itemData.subtype = item.subtype;
        if (item.stats) {
          itemData.stats = item.stats;
        }
      }

      // Map singular category names to plural for response
      const categoryMap = {
        resource: 'resources',
        equipment: 'equipment',
        consumable: 'consumables'
      };

      const pluralCategory = categoryMap[item.category] || item.category;

      // Add to category array (handle missing categories gracefully)
      if (!itemsByCategory[pluralCategory]) {
        itemsByCategory[pluralCategory] = [];
      }
      itemsByCategory[pluralCategory].push(itemData);
    }

    res.json({
      success: true,
      categories: itemsByCategory,
      totalItems: itemService.itemDefinitions.size
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
const getQualities = async (req, res) => {
  try {
    // Ensure item service is initialized
    if (!itemService.initialized) {
      await itemService.loadDefinitions();
    }

    const qualities = [];
    for (const [qualityId, quality] of itemService.qualityDefinitions.entries()) {
      // Transform levels object to array for frontend
      const levelsArray = Object.entries(quality.levels).map(([level, data]) => ({
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
        applicableTo: quality.applicableTo
      });
    }

    res.json({
      success: true,
      qualities,
      system: {
        levelRange: '1-5',
        description: 'Qualities are discrete levels (1-5) that affect item properties and vendor value',
        stacking: 'Items with identical quality levels can stack together'
      }
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
const getTraits = async (req, res) => {
  try {
    // Ensure item service is initialized
    if (!itemService.initialized) {
      await itemService.loadDefinitions();
    }

    const traits = [];
    for (const [traitId, trait] of itemService.traitDefinitions.entries()) {
      // Transform levels object to array for frontend
      const levelsArray = Object.entries(trait.levels).map(([level, data]) => ({
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
        applicableTo: trait.applicableTo
      });
    }

    res.json({
      success: true,
      traits,
      system: {
        levelRange: '1-3',
        rarities: {
          common: 'Base 5% drop chance',
          uncommon: 'Base 15% drop chance',
          rare: 'Base 30% drop chance',
          epic: 'Base 50% drop chance'
        },
        description: 'Traits are special modifiers with escalating effects across 3 levels',
        stacking: 'Items with identical trait levels can stack together'
      }
    });
  } catch (error) {
    console.error('Error fetching traits:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch traits data' });
  }
};

/**
 * Get locations overview (no player discovery status)
 * @route GET /api/manual/locations
 * @access Public
 */
const getLocations = async (req, res) => {
  try {
    // Ensure location service is initialized
    if (!locationService.loaded) {
      await locationService.loadAll();
    }

    const locations = [];
    for (const [locationId, location] of locationService.locations.entries()) {
      locations.push({
        locationId: location.locationId,
        name: location.name,
        description: location.description,
        biome: location.biome,
        facilities: location.facilities || [],
        navigationLinks: location.navigationLinks || []
      });
    }

    res.json({
      success: true,
      locations,
      totalLocations: locationService.locations.size
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch locations data' });
  }
};

/**
 * Get biome definitions
 * @route GET /api/manual/biomes
 * @access Public
 */
const getBiomes = async (req, res) => {
  try {
    // Ensure location service is initialized
    if (!locationService.loaded) {
      await locationService.loadAll();
    }

    const biomes = [];
    for (const [biomeId, biome] of locationService.biomes.entries()) {
      biomes.push({
        biomeId: biome.biomeId,
        name: biome.name,
        description: biome.description,
        ambientDescription: biome.ambientDescription,
        commonResources: biome.commonResources || []
      });
    }

    res.json({
      success: true,
      biomes,
      totalBiomes: locationService.biomes.size
    });
  } catch (error) {
    console.error('Error fetching biomes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch biomes data' });
  }
};

module.exports = {
  getSkills,
  getAttributes,
  getItems,
  getQualities,
  getTraits,
  getLocations,
  getBiomes
};
