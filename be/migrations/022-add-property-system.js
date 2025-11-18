/**
 * Migration: Add Property System
 *
 * Adds property ownership fields to all Player documents.
 * Initializes empty properties array and sets maxProperties based on Construction level.
 *
 * Changes:
 * - Add properties array (propertyIds owned by player)
 * - Add maxProperties (scales with Construction level: Math.floor(level / 10) + 1)
 * - Add activeConstructionProjects array (projectIds player is participating in)
 */

const mongoose = require('mongoose');

module.exports = {
  async up() {
    const Player = mongoose.model('Player');

    console.log('Starting property system migration...');

    // Get all players to calculate their maxProperties based on Construction level
    const players = await Player.find({});

    let updatedCount = 0;

    for (const player of players) {
      const constructionLevel = player.skills?.construction?.level || 1;
      const maxProperties = Math.floor(constructionLevel / 10) + 1;

      await Player.updateOne(
        { _id: player._id },
        {
          $set: {
            properties: [],
            maxProperties: maxProperties,
            activeConstructionProjects: []
          }
        }
      );

      updatedCount++;
    }

    console.log(`Initialized property system for ${updatedCount} players`);

    return {
      modified: updatedCount,
      message: `Initialized property system for ${updatedCount} players with maxProperties based on Construction level`
    };
  },

  async down() {
    const Player = mongoose.model('Player');

    // Remove property system fields
    const result = await Player.updateMany(
      {},
      {
        $unset: {
          properties: '',
          maxProperties: '',
          activeConstructionProjects: ''
        }
      }
    );

    console.log(`Removed property system from ${result.modifiedCount} players`);

    return {
      modified: result.modifiedCount,
      message: `Removed property system from ${result.modifiedCount} players`
    };
  },

  name: '022-add-property-system',
  description: 'Adds property ownership system with properties array, maxProperties limit based on Construction level, and active construction projects tracking'
};
