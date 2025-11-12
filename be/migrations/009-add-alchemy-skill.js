const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Add alchemy skill to all existing players
  const result = await Player.updateMany(
    { 'skills.alchemy': { $exists: false } },
    {
      $set: {
        'skills.alchemy': {
          level: 1,
          experience: 0,
          mainAttribute: 'will'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added alchemy skill (linked to Will attribute) for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Remove alchemy skill from all players (rollback)
  const result = await Player.updateMany(
    {},
    {
      $unset: { 'skills.alchemy': '' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed alchemy skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '009-add-alchemy-skill',
  description: 'Adds alchemy crafting skill linked to Will attribute (potion/reagent crafting from herbs)'
};
