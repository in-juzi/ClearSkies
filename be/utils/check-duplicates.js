const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const Player = require('../models/Player');
const User = require('../models/User');
const itemService = require('../services/itemService');

async function findDuplicates() {
  try {
    await itemService.loadDefinitions();

    const user = await User.findOne({ username: 'Juzi' });
    const player = await Player.findOne({ userId: user._id });

    const chamomile = player.inventory.filter(item => item.itemId === 'chamomile');

    console.log('Analyzing all', chamomile.length, 'chamomile stacks:');
    console.log('');

    // Group by quality/trait signature
    const groups = {};
    chamomile.forEach(item => {
      const qStr = itemService._sortedMapString(item.qualities);
      const tStr = itemService._sortedMapString(item.traits);
      const signature = 'q:' + qStr + '|t:' + tStr;

      if (!groups[signature]) {
        groups[signature] = [];
      }
      groups[signature].push(item);
    });

    console.log('Found', Object.keys(groups).length, 'unique quality/trait combinations');
    console.log('');

    let groupNum = 1;
    for (const [sig, items] of Object.entries(groups)) {
      const sample = items[0];
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      console.log('Group ' + groupNum + ': ' + items.length + ' stack(s), total quantity: ' + totalQty);
      console.log('  Qualities:', sample.qualities);
      console.log('  Traits:', sample.traits);

      if (items.length > 1) {
        console.log('  WARNING: These stacks SHOULD be combined!');
      }
      groupNum++;
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

findDuplicates();
