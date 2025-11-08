/**
 * Migration: Add skills to existing players
 * Date: 2025-11-07
 * Description: Adds the skills object with default values to all existing players
 */

const mongoose = require('mongoose');

const defaultSkills = {
  woodcutting: {
    level: 1,
    experience: 0
  },
  mining: {
    level: 1,
    experience: 0
  },
  fishing: {
    level: 1,
    experience: 0
  },
  smithing: {
    level: 1,
    experience: 0
  },
  cooking: {
    level: 1,
    experience: 0
  }
};

async function up() {
  console.log('Running migration: Add skills to existing players...');

  const Player = mongoose.model('Player');

  // Find all players that don't have skills defined
  const playersWithoutSkills = await Player.find({
    $or: [
      { skills: { $exists: false } },
      { skills: null },
      { 'skills.woodcutting': { $exists: false } }
    ]
  });

  console.log(`Found ${playersWithoutSkills.length} players without skills`);

  if (playersWithoutSkills.length === 0) {
    console.log('No players need migration');
    return { modified: 0, message: 'No players needed migration' };
  }

  // Update each player
  let updated = 0;
  for (const player of playersWithoutSkills) {
    player.skills = defaultSkills;
    await player.save();
    updated++;
  }

  console.log(`Successfully migrated ${updated} players`);
  return { modified: updated, message: `Migrated ${updated} players` };
}

async function down() {
  console.log('Running rollback: Remove skills from players...');

  const Player = mongoose.model('Player');

  // Remove skills field from all players
  const result = await Player.updateMany(
    {},
    { $unset: { skills: '' } }
  );

  console.log(`Rolled back skills for ${result.modifiedCount} players`);
  return { modified: result.modifiedCount, message: `Rolled back ${result.modifiedCount} players` };
}

module.exports = {
  up,
  down,
  name: '001-add-skills-to-players',
  description: 'Adds the skills object with default values to all existing players'
};
