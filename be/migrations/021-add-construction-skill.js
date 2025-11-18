const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Add construction skill to all existing players
  const result = await Player.updateMany(
    { 'skills.construction': { $exists: false } },
    {
      $set: {
        'skills.construction': {
          level: 1,
          experience: 0,
          totalXP: 0,
          mainAttribute: 'strength'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added construction skill (linked to Strength attribute) for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Remove construction skill from all players (rollback)
  const result = await Player.updateMany(
    {},
    {
      $unset: { 'skills.construction': '' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed construction skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '021-add-construction-skill',
  description: 'Adds construction skill linked to Strength attribute for building houses, crafting furniture, and creating structures'
};
