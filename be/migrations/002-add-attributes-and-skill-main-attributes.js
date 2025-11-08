/**
 * Migration: Add attributes to players and mainAttribute to skills
 * Date: 2025-11-07
 * Description: Adds the attributes object with 7 attributes and adds mainAttribute field to each skill
 */

const mongoose = require('mongoose');

const defaultAttributes = {
  strength: {
    level: 1,
    experience: 0
  },
  endurance: {
    level: 1,
    experience: 0
  },
  magic: {
    level: 1,
    experience: 0
  },
  perception: {
    level: 1,
    experience: 0
  },
  dexterity: {
    level: 1,
    experience: 0
  },
  will: {
    level: 1,
    experience: 0
  },
  charisma: {
    level: 1,
    experience: 0
  }
};

const skillMainAttributes = {
  woodcutting: 'strength',
  mining: 'strength',
  fishing: 'endurance',
  smithing: 'endurance',
  cooking: 'will'
};

async function up() {
  console.log('Running migration: Add attributes and skill main attributes...');

  const Player = mongoose.model('Player');

  // Find all players
  const allPlayers = await Player.find({});
  console.log(`Found ${allPlayers.length} players to migrate`);

  if (allPlayers.length === 0) {
    console.log('No players need migration');
    return { modified: 0, message: 'No players needed migration' };
  }

  let updated = 0;
  for (const player of allPlayers) {
    let needsUpdate = false;

    // Add attributes if they don't exist
    if (!player.attributes) {
      player.attributes = defaultAttributes;
      needsUpdate = true;
    }

    // Add mainAttribute to each skill if it doesn't exist
    if (player.skills) {
      for (const [skillName, attributeName] of Object.entries(skillMainAttributes)) {
        if (player.skills[skillName] && !player.skills[skillName].mainAttribute) {
          player.skills[skillName].mainAttribute = attributeName;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      await player.save();
      updated++;
    }
  }

  console.log(`Successfully migrated ${updated} players`);
  return { modified: updated, message: `Migrated ${updated} players with attributes and skill main attributes` };
}

async function down() {
  console.log('Running rollback: Remove attributes and skill main attributes...');

  const Player = mongoose.model('Player');

  // Remove attributes field and mainAttribute from skills
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        attributes: '',
        'skills.woodcutting.mainAttribute': '',
        'skills.mining.mainAttribute': '',
        'skills.fishing.mainAttribute': '',
        'skills.smithing.mainAttribute': '',
        'skills.cooking.mainAttribute': ''
      }
    }
  );

  console.log(`Rolled back attributes for ${result.modifiedCount} players`);
  return { modified: result.modifiedCount, message: `Rolled back ${result.modifiedCount} players` };
}

module.exports = {
  up,
  down,
  name: '002-add-attributes-and-skill-main-attributes',
  description: 'Adds attributes object with 7 attributes and mainAttribute field to each skill'
};
