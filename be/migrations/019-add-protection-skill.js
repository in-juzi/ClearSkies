const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Add protection skill to all existing players
  const result = await Player.updateMany(
    { 'skills.protection': { $exists: false } },
    {
      $set: {
        'skills.protection': {
          level: 1,
          experience: 0,
          totalXP: 0,
          mainAttribute: 'endurance'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added protection skill (linked to Endurance attribute) for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Remove protection skill from all players (rollback)
  const result = await Player.updateMany(
    {},
    {
      $unset: { 'skills.protection': '' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed protection skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '019-add-protection-skill',
  description: 'Adds protection defensive skill linked to Endurance attribute (tank/defensive playstyle)'
};
