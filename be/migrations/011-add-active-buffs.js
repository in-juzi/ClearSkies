const mongoose = require('mongoose');

/**
 * Migration: Add activeBuffs Map to activeCombat
 *
 * Adds the activeBuffs field to existing players' activeCombat state.
 * This field stores active buff/debuff instances during combat.
 */

async function up() {
  const Player = mongoose.model('Player');

  // Find all players with activeCombat
  const playersWithCombat = await Player.find({ 'activeCombat.monsterId': { $exists: true } });

  let modified = 0;

  for (const player of playersWithCombat) {
    // Add activeBuffs Map if it doesn't exist
    if (!player.activeCombat.activeBuffs) {
      player.activeCombat.activeBuffs = new Map();
      await player.save();
      modified++;
    }
  }

  return {
    modified,
    message: `Added activeBuffs Map to ${modified} players in active combat`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Find all players with activeBuffs
  const playersWithBuffs = await Player.find({ 'activeCombat.activeBuffs': { $exists: true } });

  let modified = 0;

  for (const player of playersWithBuffs) {
    // Remove activeBuffs field
    if (player.activeCombat && player.activeCombat.activeBuffs !== undefined) {
      player.activeCombat.activeBuffs = undefined;
      await player.save();
      modified++;
    }
  }

  return {
    modified,
    message: `Removed activeBuffs from ${modified} players`
  };
}

module.exports = {
  up,
  down,
  name: '011-add-active-buffs',
  description: 'Add activeBuffs Map to activeCombat for buff/debuff system'
};
