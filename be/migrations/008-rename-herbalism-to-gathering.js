const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Rename herbalism skill to gathering for all existing players
  const result = await Player.updateMany(
    { 'skills.herbalism': { $exists: true } },
    {
      $rename: { 'skills.herbalism': 'skills.gathering' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Renamed herbalism skill to gathering for ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Rename gathering skill back to herbalism (rollback)
  const result = await Player.updateMany(
    { 'skills.gathering': { $exists: true } },
    {
      $rename: { 'skills.gathering': 'skills.herbalism' }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Reverted gathering skill to herbalism for ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '008-rename-herbalism-to-gathering',
  description: 'Renames herbalism skill to gathering (more thematic for barehanded foraging)'
};
