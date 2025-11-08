/**
 * Database Migration Runner
 *
 * Usage:
 *   node utils/migrate.js up              - Run all pending migrations
 *   node utils/migrate.js down            - Rollback last migration
 *   node utils/migrate.js status          - Show migration status
 *   node utils/migrate.js run <name>      - Run specific migration
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
require('../models/Player');
require('../models/User');

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
  description: String
});

const Migration = mongoose.model('Migration', migrationSchema);

// Get all migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../migrations');

  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found');
    return [];
  }

  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort()
    .map(file => ({
      name: file.replace('.js', ''),
      path: path.join(migrationsDir, file)
    }));
}

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Get applied migrations
async function getAppliedMigrations() {
  return await Migration.find().sort({ appliedAt: 1 });
}

// Run a specific migration
async function runMigration(migrationFile) {
  const migration = require(migrationFile.path);

  console.log(`\n▶ Running migration: ${migration.name}`);
  console.log(`  Description: ${migration.description || 'No description'}`);

  try {
    const result = await migration.up();

    // Record migration
    await Migration.create({
      name: migration.name,
      description: migration.description
    });

    console.log(`✓ Migration completed successfully`);
    if (result.message) {
      console.log(`  ${result.message}`);
    }

    return true;
  } catch (error) {
    console.error(`✗ Migration failed:`, error.message);
    throw error;
  }
}

// Rollback a migration
async function rollbackMigration(migrationFile) {
  const migration = require(migrationFile.path);

  console.log(`\n▼ Rolling back migration: ${migration.name}`);

  try {
    const result = await migration.down();

    // Remove migration record
    await Migration.deleteOne({ name: migration.name });

    console.log(`✓ Rollback completed successfully`);
    if (result.message) {
      console.log(`  ${result.message}`);
    }

    return true;
  } catch (error) {
    console.error(`✗ Rollback failed:`, error.message);
    throw error;
  }
}

// Command: Run all pending migrations
async function runAllMigrations() {
  const allMigrations = getMigrationFiles();
  const applied = await getAppliedMigrations();
  const appliedNames = applied.map(m => m.name);

  const pending = allMigrations.filter(m => !appliedNames.includes(m.name));

  if (pending.length === 0) {
    console.log('\n✓ No pending migrations');
    return;
  }

  console.log(`\nFound ${pending.length} pending migration(s)`);

  for (const migration of pending) {
    await runMigration(migration);
  }

  console.log('\n✓ All migrations completed');
}

// Command: Rollback last migration
async function rollbackLastMigration() {
  const applied = await getAppliedMigrations();

  if (applied.length === 0) {
    console.log('\n✓ No migrations to rollback');
    return;
  }

  const lastMigration = applied[applied.length - 1];
  const allMigrations = getMigrationFiles();
  const migrationFile = allMigrations.find(m => m.name === lastMigration.name);

  if (!migrationFile) {
    console.error(`✗ Migration file not found: ${lastMigration.name}`);
    return;
  }

  await rollbackMigration(migrationFile);
  console.log('\n✓ Rollback completed');
}

// Command: Show migration status
async function showStatus() {
  const allMigrations = getMigrationFiles();
  const applied = await getAppliedMigrations();
  const appliedNames = applied.map(m => m.name);

  console.log('\n=== Migration Status ===\n');

  if (allMigrations.length === 0) {
    console.log('No migrations found');
    return;
  }

  allMigrations.forEach(migration => {
    const isApplied = appliedNames.includes(migration.name);
    const status = isApplied ? '✓ Applied' : '○ Pending';
    const date = applied.find(m => m.name === migration.name)?.appliedAt;

    console.log(`${status} ${migration.name}`);
    if (date) {
      console.log(`          Applied: ${date.toISOString()}`);
    }
  });

  console.log('');
}

// Command: Run specific migration
async function runSpecificMigration(name) {
  const allMigrations = getMigrationFiles();
  const migrationFile = allMigrations.find(m => m.name === name);

  if (!migrationFile) {
    console.error(`✗ Migration not found: ${name}`);
    return;
  }

  await runMigration(migrationFile);
  console.log('\n✓ Migration completed');
}

// Main execution
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];

  await connectDB();

  try {
    switch (command) {
      case 'up':
        await runAllMigrations();
        break;

      case 'down':
        await rollbackLastMigration();
        break;

      case 'status':
        await showStatus();
        break;

      case 'run':
        if (!arg) {
          console.error('✗ Please specify migration name');
          process.exit(1);
        }
        await runSpecificMigration(arg);
        break;

      default:
        console.log(`
Database Migration Tool

Usage:
  node utils/migrate.js up              - Run all pending migrations
  node utils/migrate.js down            - Rollback last migration
  node utils/migrate.js status          - Show migration status
  node utils/migrate.js run <name>      - Run specific migration

Examples:
  node utils/migrate.js up
  node utils/migrate.js status
  node utils/migrate.js run 001-add-skills-to-players
        `);
    }
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

main();
