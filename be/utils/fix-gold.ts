import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Player from '../models/Player';

dotenv.config();

async function fixGold() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected\n');

    const players = await Player.find({});
    console.log(`Total players: ${players.length}\n`);

    let fixed = 0;
    for (const player of players) {
      const goldIsNaN = isNaN(player.gold);

      console.log(`Player ${player._id} (userId: ${player.userId}):`);
      console.log(`  Current gold: ${player.gold} (isNaN: ${goldIsNaN})`);

      if (goldIsNaN || player.gold === undefined || player.gold === null) {
        player.gold = 0;
        await player.save();
        console.log(`  ✓ Fixed: Set gold to 0`);
        fixed++;
      } else {
        console.log(`  ✓ OK: Gold is valid`);
      }
      console.log('');
    }

    console.log(`\nFixed ${fixed} player(s) with invalid gold values`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixGold();
