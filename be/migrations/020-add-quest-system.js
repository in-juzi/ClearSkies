/**
 * Migration: Add Quest System
 *
 * Adds quest and achievement tracking to all Player documents.
 * Replaces old questProgress/achievements schema with new quest system.
 *
 * Changes:
 * - Remove old questProgress array (ObjectId-based)
 * - Remove old achievements array (ObjectId-based)
 * - Add quests object with active/completed/available arrays
 * - Add new achievements array with progress tracking
 * - Add titles, activeTitle, decorations fields
 * - Auto-accept "tutorial_welcome" quest for existing level 1 players
 */

const mongoose = require('mongoose');

module.exports = {
  async up() {
    const Player = mongoose.model('Player');

    console.log('Starting quest system migration...');

    // Update all players to add new quest fields
    const updateResult = await Player.updateMany(
      {},
      {
        $set: {
          'quests.active': [],
          'quests.completed': [],
          'quests.available': [],
          'titles': [],
          'activeTitle': null,
          'decorations': []
        },
        $unset: {
          questProgress: '',  // Remove old field
        }
      }
    );

    console.log(`Updated ${updateResult.modifiedCount} players with quest fields`);

    // Reset achievements to new structure
    await Player.updateMany(
      {},
      {
        $set: {
          achievements: []
        }
      }
    );

    console.log('Reset achievements to new structure');

    // Auto-accept tutorial_welcome quest for existing level 1 players
    // This helps existing players start the tutorial chain
    const level1Players = await Player.find({
      'attributes.strength.level': 1, // Check if player is still level 1
      'quests.completed': { $not: { $in: ['tutorial_welcome'] } } // Haven't completed tutorial
    });

    console.log(`Found ${level1Players.length} level 1 players for tutorial auto-accept`);

    for (const player of level1Players) {
      player.quests = {
        active: [{
          questId: 'tutorial_welcome',
          startedAt: new Date(),
          objectives: [{
            objectiveId: 'visit_fishing_dock',
            type: 'visit',
            current: 0,
            required: 1,
            completed: false
          }],
          turnedIn: false
        }],
        completed: [],
        available: []
      };

      await player.save();
    }

    console.log(`Auto-accepted tutorial_welcome for ${level1Players.length} level 1 players`);
    console.log('Quest system migration complete!');
  },

  async down() {
    const Player = mongoose.model('Player');

    console.log('Rolling back quest system migration...');

    // Remove new quest fields and restore old structure
    const updateResult = await Player.updateMany(
      {},
      {
        $set: {
          questProgress: [],
          achievements: []
        },
        $unset: {
          quests: '',
          titles: '',
          activeTitle: '',
          decorations: ''
        }
      }
    );

    console.log(`Rolled back ${updateResult.modifiedCount} players`);
    console.log('Quest system migration rollback complete!');
  }
};
