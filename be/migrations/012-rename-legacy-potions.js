/**
 * Migration: Rename legacy potion item IDs to new naming convention
 *
 * Context: Potion naming was standardized to medieval alchemy conventions:
 * - health_potion_minor -> health_tincture
 * - mana_potion_minor -> mana_tincture
 * - health_potion -> health_draught
 * - mana_potion -> mana_draught
 * - weak_health_potion -> health_tincture
 * - weak_mana_potion -> mana_tincture
 * - minor_health_potion -> health_tincture
 * - minor_mana_potion -> mana_tincture
 * - strong_health_potion -> health_elixir
 * - strong_mana_potion -> mana_elixir (if exists)
 *
 * This migration updates all player inventories to use the new item IDs.
 */

const mongoose = require('mongoose');

// Mapping of old item IDs to new item IDs
const ITEM_ID_MAPPING = {
  'health_potion_minor': 'health_tincture',
  'mana_potion_minor': 'mana_tincture',
  'health_potion': 'health_draught',
  'mana_potion': 'mana_draught',
  'weak_health_potion': 'health_tincture',
  'weak_mana_potion': 'mana_tincture',
  'minor_health_potion': 'health_tincture',
  'minor_mana_potion': 'mana_tincture',
  'strong_health_potion': 'health_elixir',
  'strong_mana_potion': 'mana_elixir'
};

async function up() {
  console.log('Starting migration: Rename legacy potion item IDs...');

  const Player = mongoose.model('Player');
  const players = await Player.find({});
  let totalUpdates = 0;
  let playersUpdated = 0;

  for (const player of players) {
    let playerModified = false;

    // Update inventory items
    player.inventory.forEach(item => {
      if (ITEM_ID_MAPPING[item.itemId]) {
        console.log(`  Player ${player.characterName || player._id}: ${item.itemId} -> ${ITEM_ID_MAPPING[item.itemId]}`);
        item.itemId = ITEM_ID_MAPPING[item.itemId];
        playerModified = true;
        totalUpdates++;
      }
    });

    if (playerModified) {
      await player.save();
      playersUpdated++;
    }
  }

  console.log(`Migration complete: Updated ${totalUpdates} items across ${playersUpdated} players`);

  return {
    modified: playersUpdated,
    message: `Updated ${totalUpdates} legacy potion items across ${playersUpdated} player(s)`
  };
}

async function down() {
  console.log('Rolling back migration: Rename legacy potion item IDs...');

  const Player = mongoose.model('Player');

  // Create reverse mapping
  const REVERSE_MAPPING = {};
  for (const [oldId, newId] of Object.entries(ITEM_ID_MAPPING)) {
    // For multiple old IDs mapping to same new ID, use the first variant
    if (!REVERSE_MAPPING[newId]) {
      REVERSE_MAPPING[newId] = oldId;
    }
  }

  const players = await Player.find({});
  let totalUpdates = 0;
  let playersUpdated = 0;

  for (const player of players) {
    let playerModified = false;

    // Revert inventory items
    player.inventory.forEach(item => {
      if (REVERSE_MAPPING[item.itemId]) {
        console.log(`  Player ${player.characterName || player._id}: ${item.itemId} -> ${REVERSE_MAPPING[item.itemId]}`);
        item.itemId = REVERSE_MAPPING[item.itemId];
        playerModified = true;
        totalUpdates++;
      }
    });

    if (playerModified) {
      await player.save();
      playersUpdated++;
    }
  }

  console.log(`Rollback complete: Reverted ${totalUpdates} items across ${playersUpdated} players`);

  return {
    modified: playersUpdated,
    message: `Reverted ${totalUpdates} potion items across ${playersUpdated} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '012-rename-legacy-potions',
  description: 'Rename legacy potion item IDs to new medieval alchemy naming convention'
};
