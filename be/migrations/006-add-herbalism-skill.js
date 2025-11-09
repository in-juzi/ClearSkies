const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Add herbalism skill to all existing players
  const result = await Player.updateMany(
    { 'skills.herbalism': { $exists: false } },
    {
      $set: {
        'skills.herbalism': {
          level: 1,
          experience: 0,
          mainAttribute: 'will'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added herbalism skill to ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Remove herbalism skill from all players
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        'skills.herbalism': ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed herbalism skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '006-add-herbalism-skill',
  description: 'Adds herbalism gathering skill to all players (linked to Will attribute)'
};
