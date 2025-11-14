# Database Migrations

When modifying database schemas (Player, User models), create a migration to update existing records and maintain backward compatibility.

## Running Migrations

```bash
cd be
npm run migrate          # Run all pending migrations
npm run migrate:status   # Check migration status
npm run migrate:down     # Rollback last migration
```

## Migration System

**Files**:
- Migration scripts: `be/migrations/NNN-description.js`
- Migration runner: `be/utils/migrate.js`
- Migration tracking: MongoDB `migrations` collection

**Naming Convention**: `001-add-skills-to-players.js`
- Three-digit number (ascending)
- Descriptive hyphenated name
- `.js` extension (not `.ts`)

## Creating a New Migration

### 1. Create Migration File

Create `be/migrations/012-your-migration-name.js`:

```javascript
const mongoose = require('mongoose');

async function up() {
  const Player = mongoose.model('Player');

  // Update logic here
  const result = await Player.updateMany(
    { newField: { $exists: false } }, // Filter: only docs without newField
    {
      $set: {
        newField: 'defaultValue',
        anotherField: []
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Added newField to ${result.modifiedCount} players`
  };
}

async function down() {
  const Player = mongoose.model('Player');

  // Rollback logic here
  const result = await Player.updateMany(
    {},
    {
      $unset: {
        newField: '',
        anotherField: ''
      }
    }
  );

  return {
    modified: result.modifiedCount,
    message: `Removed newField from ${result.modifiedCount} players`
  };
}

module.exports = {
  up,
  down,
  name: '012-your-migration-name',
  description: 'Add newField to all players with default value'
};
```

### 2. Test Migration

```bash
# Check current status
npm run migrate:status

# Run migration
npm run migrate

# Verify changes in MongoDB
mongo clearskies
db.players.findOne()

# Rollback if needed
npm run migrate:down
```

### 3. Commit Migration

```bash
git add be/migrations/012-your-migration-name.js
git commit -m "feat: add newField to Player model"
```

## Migration Template

```javascript
const mongoose = require('mongoose');

/**
 * Migration: [Description]
 *
 * Purpose: [Why this migration is needed]
 *
 * Changes:
 * - [Change 1]
 * - [Change 2]
 */

async function up() {
  const ModelName = mongoose.model('ModelName');

  // TODO: Implement migration logic
  const result = await ModelName.updateMany(
    { /* filter */ },
    { $set: { /* updates */ } }
  );

  return {
    modified: result.modifiedCount,
    message: `Migration completed: ${result.modifiedCount} documents updated`
  };
}

async function down() {
  const ModelName = mongoose.model('ModelName');

  // TODO: Implement rollback logic
  const result = await ModelName.updateMany(
    { /* filter */ },
    { $unset: { /* fields to remove */ } }
  );

  return {
    modified: result.modifiedCount,
    message: `Rollback completed: ${result.modifiedCount} documents updated`
  };
}

module.exports = {
  up,
  down,
  name: 'NNN-migration-name',
  description: 'Short description of what this migration does'
};
```

## Existing Migrations

1. **001-add-skills-to-players.js** - Adds skills to existing player documents
2. **002-add-attributes-and-skill-main-attributes.js** - Adds attributes and mainAttribute field to skills
3. **003-add-location-system.js** - Adds location fields (currentLocation, discoveredLocations, activeActivity, travelState)
4. **004-add-equipment-slots.js** - Adds equipment slot system to all players with 10 default slots
5. **005-convert-quality-trait-to-levels.js** - Converts quality/trait system from decimal values to integer levels
6. **006-add-herbalism-skill.js** - Adds herbalism gathering skill to all players (linked to Will attribute)
7. **007-add-combat-system.js** - Adds combat fields (activeCombat state, combatStats tracking) to all players
8. **008-rename-herbalism-to-gathering.js** - Renames herbalism skill to gathering (more thematic for barehanded foraging)
9. **009-add-alchemy-skill.js** - Adds alchemy skill to all players (level 1, linked to Will attribute)
10. **010-fix-nan-gold-values.js** - Fixes players with NaN or undefined gold values (sets to default 100)
11. **011-add-active-buffs.js** - Adds activeBuffs Map to activeCombat for buff/debuff system

## Best Practices

### Do's

✅ **Use filters to prevent duplicate updates**:
```javascript
{ newField: { $exists: false } }  // Only update docs without newField
```

✅ **Provide meaningful rollback**:
```javascript
async function down() {
  // Reverse exactly what up() did
}
```

✅ **Return useful messages**:
```javascript
return {
  modified: result.modifiedCount,
  message: `Updated ${result.modifiedCount} players`
};
```

✅ **Test on dev database first**:
```bash
# Test migration
npm run migrate

# Verify changes
mongo clearskies
db.players.find({ newField: { $exists: true } }).count()

# Rollback if issues
npm run migrate:down
```

✅ **Use $set for adding fields**:
```javascript
{ $set: { newField: 'value' } }
```

✅ **Use $unset for removing fields**:
```javascript
{ $unset: { oldField: '' } }
```

### Don'ts

❌ **Don't modify documents without filters**:
```javascript
// BAD: Updates every document even if already migrated
await Player.updateMany({}, { $set: { newField: 'value' } });

// GOOD: Only updates documents that need it
await Player.updateMany(
  { newField: { $exists: false } },
  { $set: { newField: 'value' } }
);
```

❌ **Don't forget to export module**:
```javascript
// Always export up, down, name, and description
module.exports = { up, down, name, description };
```

❌ **Don't use TypeScript** (migration runner expects .js):
```
✗ 012-migration.ts  // Won't run
✓ 012-migration.js  // Correct
```

❌ **Don't skip rollback implementation**:
```javascript
// BAD
async function down() {
  return { modified: 0, message: 'Rollback not implemented' };
}

// GOOD
async function down() {
  const result = await Player.updateMany(...);
  return { modified: result.modifiedCount, message: '...' };
}
```

## Common Migration Patterns

### Add New Field with Default Value

```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'defaultValue' } }
  );
  return { modified: result.modifiedCount, message: '...' };
}

async function down() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    {},
    { $unset: { newField: '' } }
  );
  return { modified: result.modifiedCount, message: '...' };
}
```

### Rename Field

```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { oldField: { $exists: true } },
    { $rename: { oldField: 'newField' } }
  );
  return { modified: result.modifiedCount, message: '...' };
}

async function down() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { newField: { $exists: true } },
    { $rename: { newField: 'oldField' } }
  );
  return { modified: result.modifiedCount, message: '...' };
}
```

### Add Array Field

```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { arrayField: { $exists: false } },
    { $set: { arrayField: [] } }
  );
  return { modified: result.modifiedCount, message: '...' };
}
```

### Add Map Field

```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { mapField: { $exists: false } },
    { $set: { mapField: new Map() } }
  );
  return { modified: result.modifiedCount, message: '...' };
}
```

### Fix Data Inconsistencies

```javascript
async function up() {
  const Player = mongoose.model('Player');

  // Fix NaN values
  const result = await Player.updateMany(
    { $or: [
      { gold: NaN },
      { gold: { $exists: false } },
      { gold: null }
    ]},
    { $set: { gold: 100 } }  // Default value
  );

  return { modified: result.modifiedCount, message: '...' };
}
```

## Troubleshooting

### Migration Already Run
```
Error: Migration 012-your-migration has already been run
```
**Solution**: Check `npm run migrate:status`. If migration is already complete, no action needed.

### Migration Failed Midway
```
Error: Migration failed: ...
```
**Solution**:
1. Check MongoDB: `mongo clearskies` → `db.migrations.find()`
2. Manually rollback if needed: `npm run migrate:down`
3. Fix migration code
4. Run again: `npm run migrate`

### Model Not Found
```
Error: Schema hasn't been registered for model "ModelName"
```
**Solution**: Check model is registered in `be/index.ts` before migrations run.

## Production Considerations

**Before Deployment**:
1. Test migration on dev database
2. Back up production database
3. Run migration during low-traffic window
4. Monitor for errors
5. Have rollback plan ready

**During Deployment**:
```bash
# SSH to production server
ssh user@server

# Pull latest code
cd ClearSkies && git pull

# Run migration
cd be && npm run migrate

# Check results
npm run migrate:status

# Restart backend if needed
pm2 restart clearskies-backend
```

## References

- Player Model: `be/models/Player.js`
- User Model: `be/models/User.js`
- Migration Runner: `be/utils/migrate.js`
- MongoDB Documentation: https://docs.mongodb.com/manual/reference/operator/update/
