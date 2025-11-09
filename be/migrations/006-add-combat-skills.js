/**
 * Migration: Add combat skills to existing players
 * Date: 2025-11-09
 * Description: Adds the 6 new combat skills (oneHanded, dualWield, twoHanded, ranged, casting, gun) with default values to all existing players
 */

const mongoose = require('mongoose');

const newCombatSkills = {
  oneHanded: {
    level: 1,
    experience: 0,
    mainAttribute: 'strength'
  },
  dualWield: {
    level: 1,
    experience: 0,
    mainAttribute: 'dexterity'
  },
  twoHanded: {
    level: 1,
    experience: 0,
    mainAttribute: 'strength'
  },
  ranged: {
    level: 1,
    experience: 0,
    mainAttribute: 'dexterity'
  },
  casting: {
    level: 1,
    experience: 0,
    mainAttribute: 'magic'
  },
  gun: {
    level: 1,
    experience: 0,
    mainAttribute: 'perception'
  }
};

async function up() {
  console.log('Running migration: Add combat skills to existing players...');

  const Player = mongoose.model('Player');

  // Find all players that don't have the new combat skills
  const playersWithoutCombatSkills = await Player.find({
    $or: [
      { 'skills.oneHanded': { $exists: false } },
      { 'skills.dualWield': { $exists: false } },
      { 'skills.twoHanded': { $exists: false } },
      { 'skills.ranged': { $exists: false } },
      { 'skills.casting': { $exists: false } },
      { 'skills.gun': { $exists: false } }
    ]
  });

  console.log(`Found ${playersWithoutCombatSkills.length} players without combat skills`);

  if (playersWithoutCombatSkills.length === 0) {
    console.log('No players need migration');
    return { modified: 0, message: 'No players needed migration' };
  }

  // Update each player
  let updated = 0;
  for (const player of playersWithoutCombatSkills) {
    // Add the new combat skills to existing skills object
    if (!player.skills) {
      player.skills = {};
    }

    Object.assign(player.skills, newCombatSkills);
    await player.save();
    updated++;
  }

  console.log(`Successfully migrated ${updated} players`);
  return { modified: updated, message: `Migrated ${updated} players with combat skills` };
}

async function down() {
  console.log('Running rollback: Remove combat skills from players...');

  const Player = mongoose.model('Player');

  // Remove combat skills fields from all players
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        'skills.oneHanded': '',
        'skills.dualWield': '',
        'skills.twoHanded': '',
        'skills.ranged': '',
        'skills.casting': '',
        'skills.gun': ''
      }
    }
  );

  console.log(`Rolled back combat skills for ${result.modifiedCount} players`);
  return { modified: result.modifiedCount, message: `Rolled back ${result.modifiedCount} players` };
}

module.exports = {
  up,
  down,
  name: '006-add-combat-skills',
  description: 'Adds 6 new combat skills (oneHanded, dualWield, twoHanded, ranged, casting, gun) to all existing players'
};
