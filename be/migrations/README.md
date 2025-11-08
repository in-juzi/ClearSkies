# Database Migrations

This directory contains database migration scripts for ClearSkies.

## Why Migrations?

When you modify database schemas (like adding new fields to the Player or User models), existing records in the database won't automatically have those new fields. Migrations ensure that all existing data is updated to match the new schema.

## Migration Naming Convention

Migrations should be named with a sequential number prefix:
- `001-description.js`
- `002-description.js`
- `003-description.js`

This ensures they run in the correct order.

## Running Migrations

From the `be` directory:

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status

# Rollback the last migration
npm run migrate:down

# Run a specific migration
node utils/migrate.js run 001-add-skills-to-players
```

## Creating a Migration

1. Create a new file in this directory following the naming convention
2. Use the template below:

```javascript
/**
 * Migration: Brief description
 * Date: YYYY-MM-DD
 * Description: Detailed description of what this migration does
 */

const mongoose = require('mongoose');

async function up() {
  console.log('Running migration: Your Migration Name...');

  const Model = mongoose.model('ModelName');

  // Your migration logic here
  // Example: Update all documents
  const result = await Model.updateMany(
    { /* filter */ },
    { /* update */ }
  );

  console.log(`Successfully migrated ${result.modifiedCount} documents`);
  return {
    modified: result.modifiedCount,
    message: `Migrated ${result.modifiedCount} documents`
  };
}

async function down() {
  console.log('Rolling back migration: Your Migration Name...');

  const Model = mongoose.model('ModelName');

  // Your rollback logic here
  const result = await Model.updateMany(
    { /* filter */ },
    { /* rollback */ }
  );

  console.log(`Rolled back ${result.modifiedCount} documents`);
  return {
    modified: result.modifiedCount,
    message: `Rolled back ${result.modifiedCount} documents`
  };
}

module.exports = {
  up,
  down,
  name: '00X-your-migration-name',
  description: 'Brief description of what this migration does'
};
```

## Migration Tracking

The migration system automatically tracks which migrations have been run in the `migrations` collection in MongoDB. This ensures migrations only run once and can be properly rolled back if needed.

## Best Practices

1. **Always create a migration** when you modify a Mongoose schema
2. **Test your migration** on development data before running on production
3. **Include a `down()` function** to allow rollback if needed
4. **Make migrations idempotent** - they should be safe to run multiple times
5. **Document what changed** in the migration description
6. **Never modify existing migrations** - create a new one instead

## Example Migrations

See `001-add-skills-to-players.js` for a complete example of adding a new field to existing documents.

## When to Create Migrations

- Adding new fields to models
- Removing fields from models
- Changing field types or constraints
- Restructuring nested objects
- Data transformation or cleanup
- Adding indexes (though Mongoose handles this automatically)

## When NOT to Create Migrations

- New models that don't affect existing data
- Optional fields that default to undefined
- Schema validation changes that don't require data updates
