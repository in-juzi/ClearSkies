/**
 * Delete All Users and Players
 *
 * WARNING: This will permanently delete ALL users and players from the database.
 * Use with caution!
 *
 * Usage: node utils/delete-all-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../dist/be/models/User').default;
const Player = require('../dist/be/models/Player').default;

async function deleteAllUsers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Count before deletion
    const userCount = await User.countDocuments();
    const playerCount = await Player.countDocuments();

    console.log(`\nFound ${userCount} users and ${playerCount} players`);
    console.log('⚠️  WARNING: This will permanently delete ALL users and players!');
    console.log('Proceeding in 3 seconds... (Ctrl+C to cancel)\n');

    // Give user time to cancel
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Delete all players first (foreign key dependency)
    const playerResult = await Player.deleteMany({});
    console.log(`✓ Deleted ${playerResult.deletedCount} players`);

    // Delete all users
    const userResult = await User.deleteMany({});
    console.log(`✓ Deleted ${userResult.deletedCount} users`);

    // Verify deletion
    const remainingUsers = await User.countDocuments();
    const remainingPlayers = await Player.countDocuments();

    console.log(`\n✓ Cleanup complete`);
    console.log(`  Users remaining: ${remainingUsers}`);
    console.log(`  Players remaining: ${remainingPlayers}`);

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

deleteAllUsers();
