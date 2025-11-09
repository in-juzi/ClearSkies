const mongoose = require('mongoose');
require('dotenv').config();
require('../models/Player');
const itemService = require('../services/itemService');

async function fixStacking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await itemService.loadDefinitions();
    console.log('Item definitions loaded');

    const Player = mongoose.model('Player');
    const player = await Player.findOne({ characterName: 'Juzi' });

    if (!player) {
      console.log('Player not found');
      process.exit(1);
    }

    console.log('\n=== BEFORE CONSOLIDATION ===');
    console.log('Total inventory items:', player.inventory.length);

    // Group items by itemId
    const itemGroups = new Map();
    for (const item of player.inventory) {
      if (!itemGroups.has(item.itemId)) {
        itemGroups.set(item.itemId, []);
      }
      itemGroups.get(item.itemId).push(item);
    }

    console.log('Unique item types:', itemGroups.size);
    for (const [itemId, items] of itemGroups.entries()) {
      if (items.length > 1) {
        console.log(`  ${itemId}: ${items.length} stacks (${items.reduce((sum, i) => sum + i.quantity, 0)} total)`);
      }
    }

    // Consolidate stacks for each item type
    const stackGroups = new Map();

    for (const item of player.inventory) {
      // Create a key based on itemId + qualities + traits
      const qualitiesKey = itemService._sortedMapString(item.qualities);
      const traitsKey = itemService._sortedMapString(item.traits);
      const key = `${item.itemId}|${qualitiesKey}|${traitsKey}`;

      if (!stackGroups.has(key)) {
        stackGroups.set(key, []);
      }
      stackGroups.get(key).push(item);
    }

    console.log(`\nFound ${stackGroups.size} unique quality/trait combinations`);

    // Merge stacks within each group
    for (const [key, items] of stackGroups.entries()) {
      if (items.length > 1) {
        console.log(`\nMerging ${items.length} stacks with key: ${key}`);

        // Keep the first item, add quantities from others
        const keepItem = items[0];
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        console.log(`  Total quantity: ${totalQuantity}`);
        keepItem.quantity = totalQuantity;

        // Remove the other items from inventory
        for (let i = 1; i < items.length; i++) {
          const removeIndex = player.inventory.findIndex(inv => inv.instanceId === items[i].instanceId);
          if (removeIndex !== -1) {
            player.inventory.splice(removeIndex, 1);
          }
        }
      }
    }

    await player.save();

    console.log('\n=== AFTER CONSOLIDATION ===');
    console.log('Total inventory items:', player.inventory.length);

    // Group items by itemId again
    const itemGroupsAfter = new Map();
    for (const item of player.inventory) {
      if (!itemGroupsAfter.has(item.itemId)) {
        itemGroupsAfter.set(item.itemId, []);
      }
      itemGroupsAfter.get(item.itemId).push(item);
    }

    console.log('Unique item types:', itemGroupsAfter.size);
    for (const [itemId, items] of itemGroupsAfter.entries()) {
      console.log(`  ${itemId}: ${items.length} stack(s) (${items.reduce((sum, i) => sum + i.quantity, 0)} total)`);
    }

    console.log('\n✓ Stacking fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixStacking();
