const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Add combat fields to all existing players
  const result = await Player.updateMany(
    {
      $or: [
        { activeCombat: { $exists: false } },
        { combatStats: { $exists: false } }
      ]
    },
    {
      $set: {
        'activeCombat': {
          monsterId: null,
          monsterInstance: {},
          playerLastAttackTime: null,
          monsterLastAttackTime: null,
          playerNextAttackTime: null,
          monsterNextAttackTime: null,
          turnCount: 0,
          abilityCooldowns: {},
          combatLog: [],
          startTime: null
        },
        'combatStats': {
          monstersDefeated: 0,
          totalDamageDealt: 0,
          totalDamageTaken: 0,
          deaths: 0,
          criticalHits: 0,
          dodges: 0
        }
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added combat system fields to ${result.modifiedCount} player(s)`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Remove combat fields from all players
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        'activeCombat': '',
        'combatStats': ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed combat system fields from ${result.modifiedCount} player(s)`
  };
}

module.exports = {
  up,
  down,
  name: '007-add-combat-system',
  description: 'Adds combat system with activeCombat state and combatStats tracking to all players'
};
