require('tsconfig-paths/register');
require('dotenv').config();

const connectDB = require('../dist/be/config/database').default;
const Player = require('../dist/be/models/Player').default;

(async () => {
  try {
    await connectDB();
    const player = await Player.findOne({ userId: '690e863730a08e9066a9027c' });
    if (!player) {
      console.log('Player not found');
      process.exit(0);
    }

    console.log('=== Player Inventory ===');
    console.log('Total items:', player.inventory.length);
    console.log('');

    // Group by itemId
    const grouped = {};
    player.inventory.forEach(item => {
      if (!grouped[item.itemId]) {
        grouped[item.itemId] = { count: 0, totalQuantity: 0 };
      }
      grouped[item.itemId].count++;
      grouped[item.itemId].totalQuantity += item.quantity || 1;
    });

    // Sort by itemId
    Object.keys(grouped).sort().forEach(itemId => {
      console.log(`${itemId}: ${grouped[itemId].totalQuantity} (in ${grouped[itemId].count} stacks)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
