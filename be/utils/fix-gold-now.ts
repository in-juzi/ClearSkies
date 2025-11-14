import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Player from '../models/Player';

dotenv.config();

async function fixGoldNow() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected\n');

    // Find all players and fix any with NaN gold
    const players = await Player.find({});
    console.log(`Checking ${players.length} player(s)...\n`);

    let fixed = 0;
    for (const player of players) {
      if (isNaN(player.gold) || player.gold === undefined || player.gold === null || !isFinite(player.gold)) {
        console.log(`Player ${player._id}:`);
        console.log(`  Current gold: ${player.gold} (type: ${typeof player.gold})`);

        // Set to 100 (default) instead of 0 to be generous
        player.gold = 100;
        await player.save();

        console.log(`  ✓ Fixed: Set gold to 100\n`);
        fixed++;
      }
    }

    if (fixed === 0) {
      console.log('✓ All players have valid gold values');
    } else {
      console.log(`\n✓ Fixed ${fixed} player(s)`);
    }

    await mongoose.disconnect();
    console.log('\nDone');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixGoldNow();
