const mongoose = require('mongoose');

/**
 * Migration: Fix NaN gold values
 *
 * This migration fixes players who have NaN or undefined gold values
 * by setting them to the default value of 100.
 */

async function up() {
  const Player = mongoose.model('Player');

  // Find all players
  const allPlayers = await Player.find({});
  let fixedCount = 0;

  for (const player of allPlayers) {
    // Check if gold is NaN, undefined, or not a number
    if (typeof player.gold !== 'number' || isNaN(player.gold)) {
      console.log(`Fixing gold for player ${player._id}: ${player.gold} -> 100`);
      player.gold = 100;
      await player.save();
      fixedCount++;
    }
  }

  return {
    modified: fixedCount,
    message: `Fixed ${fixedCount} players with invalid gold values`
  };
}

async function down() {
  // No rollback needed - we can't restore NaN values
  return {
    modified: 0,
    message: 'No rollback needed for gold fix'
  };
}

module.exports = {
  up,
  down,
  name: '010-fix-nan-gold-values',
  description: 'Fix players with NaN or undefined gold values'
};
