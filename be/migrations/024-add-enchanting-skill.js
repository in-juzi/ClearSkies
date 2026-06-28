const mongoose = require('mongoose');

/**
 * Adds the `enchanting` skill (linked to Wisdom) to all existing players.
 * Enchanting binds crystallized mana (essences) into socketables (sigils) — the
 * first production skill keyed to Wisdom. See project/ideas/enchanting.md.
 */
async function up() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    { 'skills.enchanting': { $exists: false } },
    {
      $set: {
        'skills.enchanting': {
          level: 1,
          experience: 0,
          mainAttribute: 'wisdom'
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added enchanting skill (linked to Wisdom attribute) for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  const result = await Player.updateMany(
    {},
    { $unset: { 'skills.enchanting': '' } }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed enchanting skill from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '024-add-enchanting-skill',
  description: 'Adds enchanting skill linked to Wisdom attribute for binding essences into sigils'
};
