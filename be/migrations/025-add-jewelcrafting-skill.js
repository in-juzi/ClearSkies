const mongoose = require('mongoose');

/**
 * Adds the `jewelcrafting` skill (linked to Dexterity) to all existing players.
 * Jewelcrafting is the fine material craft — the deliberate opposite of smithing
 * (precision, not brute force) and the first production skill keyed to Dexterity.
 * It produces the vessels (cut gems + jewelry bases) that enchanting fills.
 * See project/ideas/jewelcrafting.md.
 */
async function up() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    { 'skills.jewelcrafting': { $exists: false } },
    {
      $set: {
        'skills.jewelcrafting': {
          level: 1,
          experience: 0,
          mainAttribute: 'dexterity'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added jewelcrafting skill (linked to Dexterity attribute) for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    {},
    { $unset: { 'skills.jewelcrafting': '' } }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed jewelcrafting skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '025-add-jewelcrafting-skill',
  description: 'Adds jewelcrafting skill linked to Dexterity attribute for cutting gems and crafting jewelry bases'
};
