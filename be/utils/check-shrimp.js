/**
 * Check shrimp instances in Juzi's inventory
 */

const mongoose = require('mongoose');
const Player = require('../models/Player');
const User = require('../models/User');

async function checkShrimp() {
  try {
    await mongoose.connect('mongodb://localhost:27017/clearskies');

    const player = await Player.findOne().populate('userId');
    console.log('Player:', player.userId.username);
    console.log('Total inventory items:', player.inventory.length);

    const shrimp = player.inventory.filter(item => item.itemId === 'shrimp');
    console.log('\n=== Shrimp Instances:', shrimp.length, '===\n');

    shrimp.forEach((item, i) => {
      console.log(`--- Instance ${i + 1} ---`);
      console.log('instanceId:', item.instanceId);
      console.log('quantity:', item.quantity);
      console.log('equipped:', item.equipped);
      console.log('qualities:', item.qualities instanceof Map ? Object.fromEntries(item.qualities) : item.qualities);
      console.log('traits:', item.traits instanceof Map ? Object.fromEntries(item.traits) : item.traits);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkShrimp();
