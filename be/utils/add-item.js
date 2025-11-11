const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const Player = require('../models/Player');
const itemService = require('../services/itemService');

async function addItemToPlayer() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Initialize item service
    await itemService.loadDefinitions();
    console.log('Item service initialized');

    // Find Juzi
    const player = await Player.findOne({ characterName: 'Juzi' });
    if (!player) {
      console.log('Player "Juzi" not found');
      process.exit(1);
    }

    console.log(`Found player: ${player.characterName}`);

    // Create all new flowers (8 total)
    const flowers = [
      'morning_glory', 'jasmine',           // Tier 1 Common
      'honeysuckle', 'wisteria',            // Tier 2 Uncommon
      'passionflower', 'trumpet_vine',      // Tier 3 Rare
      'moonvine', 'phoenix_vine'            // Tier 4 Epic
    ];

    const instances = flowers.map(flowerId => ({
      id: flowerId,
      instance: itemService.createItemInstance(flowerId, 1)
    }));

    // Add to inventory
    instances.forEach(({ instance }) => player.addItem(instance));
    await player.save();

    console.log(`✅ Added ${instances.length} flowers to Juzi's inventory`);
    instances.forEach(({ id, instance }) => {
      const def = itemService.getItemDefinition(id);
      console.log(`  - ${def.name} (${def.baseValue}g)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addItemToPlayer();
