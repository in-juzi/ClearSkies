/**
 * Migration: Convert existing player XP to new tiered XP curve
 *
 * Old System:
 * - 1000 XP per level (flat)
 * - XP stored as cumulative total
 * - Level = floor(totalXP / 1000) + 1
 *
 * New System:
 * - Tiered XP requirements (100/500/1500/3000/5000 per level)
 * - XP stored as progress within current level (0 to xpNeeded-1)
 * - Level stored separately
 *
 * Conversion Strategy:
 * - Calculate current level from total XP
 * - Calculate total XP required to reach that level in new system
 * - Store remainder as experience progress within level
 */

const mongoose = require('mongoose');

// Import XP curve (must match shared/constants/attribute-constants.ts)
const XP_PER_LEVEL = [
  0,    // Level 0 (placeholder)
  // Levels 1-10: 100 XP per level
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  // Levels 11-20: 500 XP per level
  500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
  // Levels 21-30: 1500 XP per level
  1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,
  // Levels 31-40: 3000 XP per level
  3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
  // Levels 41-50: 5000 XP per level
  5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000
];

function getTotalXPForLevel(targetLevel) {
  let total = 0;
  for (let level = 1; level < targetLevel; level++) {
    total += XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  }
  return total;
}

function getXPForLevel(level) {
  if (level < 1 || level >= XP_PER_LEVEL.length) {
    return XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  }
  return XP_PER_LEVEL[level];
}

/**
 * Convert old XP system to new XP system
 * @param {number} oldTotalXP - Cumulative XP from old system
 * @returns {{ level: number, experience: number }} - New level and progress within level
 */
function convertXP(oldTotalXP) {
  // Old system: level = floor(totalXP / 1000) + 1
  const oldLevel = Math.floor(oldTotalXP / 1000) + 1;

  // New system: Calculate total XP needed to reach this level
  const newTotalXPForLevel = getTotalXPForLevel(oldLevel);

  // Remaining XP is progress within current level
  const experienceInLevel = Math.max(0, oldTotalXP - newTotalXPForLevel);

  // Cap experience at level's XP requirement (prevent overflow)
  const maxXPInLevel = getXPForLevel(oldLevel);
  const cappedExperience = Math.min(experienceInLevel, maxXPInLevel - 1);

  return {
    level: oldLevel,
    experience: cappedExperience
  };
}

async function up() {
  try {
    console.log('Starting XP curve migration...');

    const Player = mongoose.model('Player');
    const players = await Player.find({});

    console.log(`Found ${players.length} players to migrate`);

    let migratedCount = 0;
    const skillNames = [
      'woodcutting', 'mining', 'fishing', 'gathering', 'smithing', 'cooking', 'alchemy',
      'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'
    ];
    const attributeNames = ['strength', 'endurance', 'wisdom', 'perception', 'dexterity', 'will', 'charisma'];

    for (const player of players) {
      try {
        let changed = false;

        // Convert skills
        for (const skillName of skillNames) {
          if (player.skills && player.skills[skillName]) {
            const skill = player.skills[skillName];
            const oldTotalXP = skill.experience || 0;
            const { level, experience } = convertXP(oldTotalXP);

            console.log(`  ${player.userId} - ${skillName}: ${oldTotalXP} XP → L${level} + ${experience} XP`);

            skill.level = level;
            skill.experience = experience;
            changed = true;
          }
        }

        // Convert attributes
        for (const attrName of attributeNames) {
          if (player.attributes && player.attributes[attrName]) {
            const attr = player.attributes[attrName];
            const oldTotalXP = attr.experience || 0;
            const { level, experience } = convertXP(oldTotalXP);

            console.log(`  ${player.userId} - ${attrName}: ${oldTotalXP} XP → L${level} + ${experience} XP`);

            attr.level = level;
            attr.experience = experience;
            changed = true;
          }
        }

        if (changed) {
          await player.save({ validateBeforeSave: false });
          migratedCount++;
        }
      } catch (playerError) {
        console.error(`❌ Error migrating player ${player.userId}:`, playerError);
        throw playerError;
      }
    }

    console.log(`✅ Migration complete! Migrated ${migratedCount} players`);

    return {
      modified: migratedCount,
      message: `Converted XP curve for ${migratedCount} players`
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

async function down() {
  try {
    console.log('Rolling back XP curve migration...');

    const Player = mongoose.model('Player');
    const players = await Player.find({});

    console.log(`Found ${players.length} players to rollback`);

    let rolledBackCount = 0;
    const skillNames = [
      'woodcutting', 'mining', 'fishing', 'gathering', 'smithing', 'cooking', 'alchemy',
      'oneHanded', 'dualWield', 'twoHanded', 'ranged', 'casting', 'gun'
    ];
    const attributeNames = ['strength', 'endurance', 'wisdom', 'perception', 'dexterity', 'will', 'charisma'];

    for (const player of players) {
      try {
        let changed = false;

        // Convert skills back to old system
        for (const skillName of skillNames) {
          if (player.skills && player.skills[skillName]) {
            const skill = player.skills[skillName];
            const level = skill.level || 1;
            const experienceInLevel = skill.experience || 0;

            // Calculate total XP in new system
            const totalXPForLevel = getTotalXPForLevel(level);
            const oldTotalXP = totalXPForLevel + experienceInLevel;

            console.log(`  ${player.userId} - ${skillName}: L${level} + ${experienceInLevel} XP → ${oldTotalXP} total XP`);

            skill.level = level; // Keep level the same
            skill.experience = oldTotalXP; // Revert to cumulative total
            changed = true;
          }
        }

        // Convert attributes back to old system
        for (const attrName of attributeNames) {
          if (player.attributes && player.attributes[attrName]) {
            const attr = player.attributes[attrName];
            const level = attr.level || 1;
            const experienceInLevel = attr.experience || 0;

            const totalXPForLevel = getTotalXPForLevel(level);
            const oldTotalXP = totalXPForLevel + experienceInLevel;

            console.log(`  ${player.userId} - ${attrName}: L${level} + ${experienceInLevel} XP → ${oldTotalXP} total XP`);

            attr.level = level;
            attr.experience = oldTotalXP;
            changed = true;
          }
        }

        if (changed) {
          await player.save({ validateBeforeSave: false });
          rolledBackCount++;
        }
      } catch (playerError) {
        console.error(`❌ Error rolling back player ${player.userId}:`, playerError);
        throw playerError;
      }
    }

    console.log(`✅ Rollback complete! Rolled back ${rolledBackCount} players`);

    return {
      modified: rolledBackCount,
      message: `Rolled back XP curve for ${rolledBackCount} players`
    };
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

module.exports = {
  up,
  down,
  name: '017-convert-to-new-xp-curve',
  description: 'Converts player XP from old flat 1000 XP/level system to new tiered XP curve (100/500/1500/3000/5000 per level)'
};
