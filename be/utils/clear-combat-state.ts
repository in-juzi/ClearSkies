import mongoose from 'mongoose';
import Player from '../models/Player';
import User from '../models/User';

async function clearCombatState(username: string) {
  try {
    await mongoose.connect('mongodb://localhost:27017/clearskies');
    console.log('Connected to MongoDB');

    // First find the user to get their ObjectId
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User "${username}" not found`);
      process.exit(1);
    }

    // Then find the player by userId
    const player = await Player.findOne({ userId: user._id });
    if (!player) {
      console.log(`Player for user "${username}" not found`);
      process.exit(1);
    }

    console.log(`\nPlayer: ${username}`);
    console.log('Current combat state:', JSON.stringify(player.activeCombat, null, 2));
    console.log('isInCombat():', player.isInCombat());
    console.log('activeCombat exists:', !!player.activeCombat);

    // Clear combat if either condition is true:
    // 1. Player model thinks we're in combat
    // 2. activeCombat object exists (even if empty)
    if (player.isInCombat() || player.activeCombat) {
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
