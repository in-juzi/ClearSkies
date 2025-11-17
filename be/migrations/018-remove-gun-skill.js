const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Remove gun skill from all players
  const result = await Player.updateMany(
    {},
    {
      $unset: { 'skills.gun': '' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed gun skill from ${result.modifiedCount} player(s) (firearms don't fit medieval fantasy theme)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Restore gun skill to all players (rollback)
  const result = await Player.updateMany(
    { 'skills.gun': { $exists: false } },
    {
      $set: {
        'skills.gun': {
          level: 1,
          experience: 0,
          totalXP: 0,
          mainAttribute: 'perception'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Restored gun skill for ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '018-remove-gun-skill',
  description: 'Removes gun combat skill - firearms don\'t fit the medieval fantasy aesthetic'
};
