/**
 * Migration 013: Rename 'magic' attribute to 'wisdom'
 *
 * Context:
 * - The 'magic' attribute name doesn't fit the medieval fantasy setting
 * - 'Wisdom' better represents mental fortitude, spiritual power, and magical channeling
 * - This aligns with traditional RPG conventions
 *
 * Changes:
 * - Rename attributes.magic → attributes.wisdom for all players
 * - Update casting skill mainAttribute from 'magic' → 'wisdom'
 *
 * Rollback:
 * - Can be reversed by running the down() migration
 */

const mongoose = require('mongoose');

async function up() {
  console.log('Starting migration 013: Rename magic attribute to wisdom');

  // Get the underlying MongoDB collection
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  // Count players with magic attribute
  const countBefore = await playersCollection.countDocuments({
    'attributes.magic': { $exists: true }
  });
  console.log(`Found ${countBefore} players with 'magic' attribute`);

  if (countBefore === 0) {
    console.log('No players to migrate (magic attribute not found)');
    return {
      modified: 0,
      message: 'No players had magic attribute to rename'
    };
  }

  // Rename magic → wisdom in attributes using MongoDB $rename operator
  const renameResult = await playersCollection.updateMany(
    { 'attributes.magic': { $exists: true } },
    {
      $rename: {
        'attributes.magic': 'attributes.wisdom'
      }
    }
  );

  console.log(`  Renamed 'magic' to 'wisdom' for ${renameResult.modifiedCount} players`);

  // Update casting skill mainAttribute from 'magic' to 'wisdom'
  const castingResult = await playersCollection.updateMany(
    { 'skills.casting.mainAttribute': 'magic' },
    {
      $set: {
        'skills.casting.mainAttribute': 'wisdom'
      }
    }
  );

  console.log(`  Updated casting mainAttribute for ${castingResult.modifiedCount} players`);

  // Verify migration
  const countAfter = await playersCollection.countDocuments({
    'attributes.wisdom': { $exists: true }
  });
  console.log(`Verification: ${countAfter} players now have 'wisdom' attribute`);

  if (countAfter !== countBefore) {
    throw new Error(
      `Migration verification failed: expected ${countBefore} players with wisdom, got ${countAfter}`
    );
  }

  console.log('Migration 013 complete');

  return {
    modified: renameResult.modifiedCount,
    message: `Renamed 'magic' to 'wisdom' for ${renameResult.modifiedCount} player(s)`
  };
}

async function down() {
  console.log('Rolling back migration 013: Rename wisdom attribute to magic');

  // Get the underlying MongoDB collection
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  // Count players with wisdom attribute
  const countBefore = await playersCollection.countDocuments({
    'attributes.wisdom': { $exists: true }
  });
  console.log(`Found ${countBefore} players with 'wisdom' attribute`);

  if (countBefore === 0) {
    console.log('No players to roll back (wisdom attribute not found)');
    return {
      modified: 0,
      message: 'No players had wisdom attribute to revert'
    };
  }

  // Rename wisdom → magic in attributes using MongoDB $rename operator
  const renameResult = await playersCollection.updateMany(
    { 'attributes.wisdom': { $exists: true } },
    {
      $rename: {
        'attributes.wisdom': 'attributes.magic'
      }
    }
  );

  console.log(`  Renamed 'wisdom' to 'magic' for ${renameResult.modifiedCount} players`);

  // Update casting skill mainAttribute from 'wisdom' to 'magic'
  const castingResult = await playersCollection.updateMany(
    { 'skills.casting.mainAttribute': 'wisdom' },
    {
      $set: {
        'skills.casting.mainAttribute': 'magic'
      }
    }
  );

  console.log(`  Updated casting mainAttribute for ${castingResult.modifiedCount} players`);

  // Verify rollback
  const countAfter = await playersCollection.countDocuments({
    'attributes.magic': { $exists: true }
  });
  console.log(`Verification: ${countAfter} players now have 'magic' attribute`);

  if (countAfter !== countBefore) {
    throw new Error(
      `Rollback verification failed: expected ${countBefore} players with magic, got ${countAfter}`
    );
  }

  console.log('Migration 013 rollback complete');

  return {
    modified: renameResult.modifiedCount,
    message: `Renamed 'wisdom' to 'magic' for ${renameResult.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '013-rename-magic-to-wisdom',
  description: 'Rename magic attribute to wisdom for better medieval fantasy theming'
};
