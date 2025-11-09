const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const Player = require('./models/Player');
const itemService = require('./services/itemService');

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

    // Create bronze woodcutting axe
    const itemInstance = itemService.createItemInstance('bronze_woodcutting_axe', 1);

    // Add to inventory
    await player.addItem(itemInstance);
    await player.save();

    console.log('✅ Added bronze_woodcutting_axe to Juzi\'s inventory');
    console.log('Item details:', itemInstance);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addItemToPlayer();
