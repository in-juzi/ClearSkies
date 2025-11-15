const mongoose = require('mongoose');
require('ts-node/register');
const Player = require('../models/Player.ts').default;
const User = require('../models/User.ts').default;

mongoose.connect('mongodb://localhost:27017/clearskies')
  .then(async () => {
    console.log('Connected to database');

    // Find Juzi's user account
    const user = await User.findOne({ username: 'Juzi' });
    if (!user) {
      console.log('User Juzi not found');
      process.exit(1);
    }

    console.log('User ID:', user._id);

    // Find player data
    const player = await Player.findOne({ userId: user._id });
    if (!player) {
      console.log('Player data not found for Juzi');
      process.exit(1);
    }

    console.log('\n=== Player Location Data ===');
    console.log('currentLocation:', player.currentLocation);
    console.log('location object:', JSON.stringify(player.location, null, 2));

    console.log('\n=== Player Stats Data ===');
    console.log('stats:', JSON.stringify(player.stats, null, 2));
    console.log('level:', player.level);
    console.log('gold:', player.gold);

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
