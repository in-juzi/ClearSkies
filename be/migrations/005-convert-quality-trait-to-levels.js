const mongoose = require('mongoose');

/**
 * Migration: Convert quality and trait values from decimals to discrete levels
 *
 * This migration converts the old 0-1 decimal system to the new level-based system:
 * - Qualities: 0-1 decimals → 1-5 integer levels
 * - Traits: array of strings → Map of traitId -> level (1-3)
 */

async function up() {
  const Player = mongoose.model('Player');
  const players = await Player.find({});

  let modifiedCount = 0;
  let itemsConverted = 0;

  for (const player of players) {
    let playerModified = false;

    // Convert each item in inventory
    for (const item of player.inventory) {
      let itemModified = false;

      // Convert qualities from decimal values to levels
      if (item.qualities && item.qualities.size > 0) {
        const newQualities = new Map();

        for (const [qualityId, value] of item.qualities.entries()) {
          // Convert decimal (0-1) to level (1-5)
          const level = decimalToLevel(value, 5);
          newQualities.set(qualityId, level);
          itemModified = true;
        }

        item.qualities = newQualities;
      }

      // Convert traits from array to Map with levels
      if (item.traits) {
        // Check if traits is already a Map (migration already run or new format)
        if (Array.isArray(item.traits)) {
          const newTraits = new Map();

          // Convert each trait from array item to Map entry with random level
          for (const traitId of item.traits) {
            // Assign level based on trait rarity
            // Since we don't have rarity info here, use random level 1-2
            const level = Math.random() < 0.7 ? 1 : 2;
            newTraits.set(traitId, level);
            itemModified = true;
          }

          item.traits = newTraits;
        }
      }

      if (itemModified) {
        itemsConverted++;
      }
    }

    if (itemsConverted > 0) {
      playerModified = true;
    }

    if (playerModified) {
      // Mark the inventory as modified
      player.markModified('inventory');
      await player.save();
      modifiedCount++;
    }
  }

  return {
    modified: modifiedCount,
    message: `Successfully converted ${itemsConverted} items across ${modifiedCount} players from decimal values to level-based system`
  };
}

async function down() {
  const Player = mongoose.model('Player');
  const players = await Player.find({});

  let modifiedCount = 0;
  let itemsConverted = 0;

  for (const player of players) {
    let playerModified = false;

    // Convert each item in inventory back to old format
    for (const item of player.inventory) {
      let itemModified = false;

      // Convert qualities from levels back to decimals
      if (item.qualities && item.qualities.size > 0) {
        const newQualities = new Map();

        for (const [qualityId, level] of item.qualities.entries()) {
          // Convert level (1-5) back to decimal (0-1)
          const value = levelToDecimal(level, 5);
          newQualities.set(qualityId, value);
          itemModified = true;
        }

        item.qualities = newQualities;
      }

      // Convert traits from Map back to array
      if (item.traits && item.traits instanceof Map) {
        const traitArray = Array.from(item.traits.keys());
        item.traits = traitArray;
        itemModified = true;
      }

      if (itemModified) {
        itemsConverted++;
      }
    }

    if (itemsConverted > 0) {
      playerModified = true;
    }

    if (playerModified) {
      player.markModified('inventory');
      await player.save();
      modifiedCount++;
    }
  }

  return {
    modified: modifiedCount,
    message: `Successfully rolled back ${itemsConverted} items across ${modifiedCount} players to decimal-based system`
  };
}

/**
 * Convert a decimal value (0-1) to a discrete level (1-maxLevel)
 */
function decimalToLevel(decimal, maxLevel) {
  // Map decimal ranges to levels
  // 0.0-0.2 = level 1
  // 0.2-0.4 = level 2
  // 0.4-0.6 = level 3
  // 0.6-0.8 = level 4
  // 0.8-1.0 = level 5

  const normalizedValue = Math.max(0, Math.min(1, decimal));
  const level = Math.ceil(normalizedValue * maxLevel);

  // Ensure level is at least 1
  return Math.max(1, level);
}

/**
 * Convert a discrete level (1-maxLevel) to a decimal value (0-1)
 */
function levelToDecimal(level, maxLevel) {
  // Map level to middle of its decimal range
  // Level 1 → 0.1
  // Level 2 → 0.3
  // Level 3 → 0.5
  // Level 4 → 0.7
  // Level 5 → 0.9

  const normalizedLevel = Math.max(1, Math.min(maxLevel, level));
  const decimal = (normalizedLevel / maxLevel) - (0.5 / maxLevel);

  return Math.max(0, Math.min(1, decimal));
}

module.exports = {
  up,
  down,
  name: '005-convert-quality-trait-to-levels',
  description: 'Convert quality and trait values from decimal (0-1) to discrete levels (1-5 for qualities, 1-3 for traits)'
};
