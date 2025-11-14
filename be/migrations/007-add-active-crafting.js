const mongoose = require('mongoose');

async function up() {
  console.log('Running migration: Add activeCrafting field to Player model');

  const Player = mongoose.model('Player');
  const players = await Player.find({});
  let modified = 0;

  for (const player of players) {
    // Add activeCrafting field if it doesn't exist
    if (player.activeCrafting === undefined) {
      player.activeCrafting = {
        recipeId: null,
        startTime: null,
        endTime: null
      };
      await player.save();
      modified++;
    }
  }

  return {
    modified,
    message: `Added activeCrafting field to ${modified} player(s)`
  };
}

async function down() {
  console.log('Rolling back migration: Remove activeCrafting field from Player model');

  const Player = mongoose.model('Player');
  const players = await Player.find({});
  let modified = 0;

  for (const player of players) {
    if (player.activeCrafting !== undefined) {
      player.activeCrafting = undefined;
      await player.save();
      modified++;
    }
  }

  return {
    modified,
    message: `Removed activeCrafting field from ${modified} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '007-add-active-crafting',
  description: 'Add activeCrafting field to Player model for crafting system'
};
