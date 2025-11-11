const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const Player = require('../models/Player');
const itemService = require('../services/itemService');

// ============================================================================
// ITEM PRESETS - Reusable item sets for testing and development
// ============================================================================

const ITEM_PRESETS = {
  // Combat consumables - potions and food
  combatConsumables: [
    { itemId: 'health_potion_minor', quantity: 5 },
    { itemId: 'mana_potion_minor', quantity: 5 },
    { itemId: 'cooked_shrimp', quantity: 10 }
  ],

  // Gathering tools - basic tier
  gatheringTools: [
    { itemId: 'bronze_woodcutting_axe', quantity: 1 },
    { itemId: 'bronze_mining_pickaxe', quantity: 1 },
    { itemId: 'bamboo_fishing_rod', quantity: 1 }
  ],

  // Resources - common materials
  commonResources: [
    { itemId: 'oak_log', quantity: 10 },
    { itemId: 'copper_ore', quantity: 10 },
    { itemId: 'shrimp', quantity: 10 }
  ],

  // Example: All flowers
  allFlowers: [
    { itemId: 'morning_glory', quantity: 1 },
    { itemId: 'jasmine', quantity: 1 },
    { itemId: 'honeysuckle', quantity: 1 },
    { itemId: 'wisteria', quantity: 1 },
    { itemId: 'passionflower', quantity: 1 },
    { itemId: 'trumpet_vine', quantity: 1 },
    { itemId: 'moonvine', quantity: 1 },
    { itemId: 'phoenix_vine', quantity: 1 }
  ]
};

// ============================================================================
// CONFIGURATION - Edit these values to customize the script
// ============================================================================

// Which preset to use (change this to use different item sets)
const ACTIVE_PRESET = 'combatConsumables';

// Target player character name
const TARGET_PLAYER = 'Juzi';

// ============================================================================

async function addItemToPlayer() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Initialize item service
    await itemService.loadDefinitions();
    console.log('Item service initialized');

    // Find player
    const player = await Player.findOne({ characterName: TARGET_PLAYER });
    if (!player) {
      console.log(`Player "${TARGET_PLAYER}" not found`);
      process.exit(1);
    }

    console.log(`Found player: ${player.characterName}`);

    // Get items to add from preset
    const itemsToAdd = ITEM_PRESETS[ACTIVE_PRESET];
    if (!itemsToAdd) {
      console.log(`Preset "${ACTIVE_PRESET}" not found`);
      console.log('Available presets:', Object.keys(ITEM_PRESETS).join(', '));
      process.exit(1);
    }

    console.log(`Using preset: ${ACTIVE_PRESET}`);

    const instances = [];
    for (const { itemId, quantity } of itemsToAdd) {
      const instance = itemService.createItemInstance(itemId, quantity);
      instances.push({ itemId, quantity, instance });
      player.addItem(instance);
    }

    await player.save();

    console.log(`✅ Added ${itemsToAdd.length} item types to Juzi's inventory`);
    instances.forEach(({ itemId, quantity }) => {
      const def = itemService.getItemDefinition(itemId);
      console.log(`  - ${quantity}x ${def.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addItemToPlayer();
