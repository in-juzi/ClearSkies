const mongoose = require('mongoose');

async function up() {
  console.log('Running migration: Fix NaN gold values in Player documents');

  const Player = mongoose.model('Player');
  const players = await Player.find({});
  let modified = 0;

  for (const player of players) {
    // Check if gold is NaN, undefined, or null
    if (isNaN(player.gold) || player.gold === undefined || player.gold === null) {
      console.log(`  Fixing player ${player._id}: gold was ${player.gold}`);
      player.gold = 0;
      await player.save();
      modified++;
    }
  }

  return {
    modified,
    message: `Fixed NaN gold values for ${modified} player(s)`
  };
}

async function down() {
  console.log('Rolling back migration: Cannot restore NaN gold values');

  return {
    modified: 0,
    message: 'Rollback not applicable - NaN gold values cannot be restored'
  };
}

module.exports = {
  up,
  down,
  name: '011-fix-nan-gold',
  description: 'Fix NaN gold values in Player documents'
};
