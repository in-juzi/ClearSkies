/**
 * Migration: Remove Legacy HP/MP Max Fields
 *
 * The old schema had stats.health.max and stats.mana.max fields, but these
 * are now replaced by virtual properties (maxHP, maxMP) calculated from attributes.
 *
 * This migration removes the legacy fields from all existing player documents.
 */

const mongoose = require('mongoose');

async function up() {
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  console.log('Starting removal of legacy max HP/MP fields...');

  const result = await playersCollection.updateMany(
    {},
    {
      $unset: {
        'stats.health.max': '',
        'stats.mana.max': ''
      }
    }
  );

  console.log(`Removed legacy max fields from ${result.modifiedCount} players`);

  return {
    message: `Removed legacy max fields from ${result.modifiedCount} players`
  };
}

async function down() {
  const db = mongoose.connection.db;
  const playersCollection = db.collection('players');

  console.log('Rolling back: Re-adding legacy max HP/MP fields...');

  // Re-add the fields with default values
  const result = await playersCollection.updateMany(
    {},
    {
      $set: {
        'stats.health.max': 100,
        'stats.mana.max': 100
      }
    }
  );

  console.log(`Re-added legacy max fields to ${result.modifiedCount} players`);

  return {
    message: `Re-added legacy max fields to ${result.modifiedCount} players`
  };
}

module.exports = {
  name: '015-remove-legacy-hp-mp-max-fields',
  description: 'Remove deprecated stats.health.max and stats.mana.max fields (replaced by virtual properties)',
  up,
  down
};
