import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Player from '../models/Player';

dotenv.config();

async function checkGold() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected\n');

    const players = await Player.find({});
    console.log(`Total players: ${players.length}\n`);

    players.forEach(p => {
      const goldType = typeof p.gold;
      const goldIsNaN = isNaN(p.gold);
      const goldValue = p.gold;

      console.log(`Player ${p._id}:`);
      console.log(`  gold = ${goldValue}`);
      console.log(`  type = ${goldType}`);
      console.log(`  isNaN = ${goldIsNaN}`);
      console.log(`  userId = ${p.userId}`);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGold();
