require('tsconfig-paths/register');
const mongoose = require('mongoose');
const Player = require('../dist/models/Player').default;

async function clearCombatState(username) {
  try {
    await mongoose.connect('mongodb://localhost:27017/clearskies');
    console.log('Connected to MongoDB');

    const player = await Player.findOne({ userId: username });
    if (!player) {
      console.log(`Player "${username}" not found`);
      process.exit(1);
    }

    console.log(`\nPlayer: ${username}`);
    console.log('Current combat state:', JSON.stringify(player.activeCombat, null, 2));
    console.log('isInCombat():', player.isInCombat());

    if (player.isInCombat()) {
      console.log('\nClearing combat state...');
      player.clearCombat();
      await player.save();
      console.log('✓ Combat state cleared successfully!');
    } else {
      console.log('\nPlayer is not in combat - no action needed');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get username from command line arg or default to 'Juzi'
const username = process.argv[2] || 'Juzi';
clearCombatState(username);
