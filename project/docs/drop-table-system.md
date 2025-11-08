# Drop Table System

## Overview

The drop table system provides a flexible, weight-based loot distribution system for activities. Instead of hard-coding drop chances directly in activities, drop tables allow you to define reusable loot pools that can be shared across multiple activities.

## Benefits

1. **Reusability**: Create generic drop tables (e.g., "rare-woodcutting") that can be applied to multiple activities
2. **Easy Balancing**: Adjust drop weights without touching activity definitions
3. **Scalability**: Add or remove items from drop pools without recalculating percentages
4. **Flexibility**: Activities can use multiple drop tables (common + rare drops)
5. **Weighted Random**: Each item has a weight, making it easy to control relative drop rates

## Architecture

### File Structure

```
be/data/locations/drop-tables/
├── woodcutting-oak.json        # Common oak chopping drops
├── rare-woodcutting.json       # Rare finds while woodcutting
├── fishing-salmon.json         # Common salmon fishing drops
└── rare-fishing.json           # Rare treasures from fishing
```

### Drop Table Definition

Each drop table is a JSON file with the following structure:

```json
{
  "dropTableId": "woodcutting-oak",
  "name": "Oak Woodcutting Drops",
  "description": "Common drops from chopping oak trees",
  "drops": [
    {
      "itemId": "oak_log",
      "weight": 80,
      "quantity": { "min": 1, "max": 2 }
    },
    {
      "itemId": "oak_log",
      "weight": 15,
      "quantity": { "min": 2, "max": 3 },
      "qualityBonus": { "woodGrain": 0.2 },
      "comment": "Higher quality oak logs"
    },
    {
      "itemId": "birch_log",
      "weight": 5,
      "quantity": { "min": 1, "max": 1 },
      "comment": "Occasionally find birch mixed in"
    }
  ]
}
```

### Drop Entry Fields

- **itemId** (required): The item to drop
- **weight** (required): Relative weight for this drop (higher = more common)
- **quantity** (required): Min/max quantity range
- **qualityBonus** (optional): Object with quality bonuses (e.g., `{ "woodGrain": 0.2 }`)
- **qualityMultiplier** (optional): Multiplier for all qualities
- **comment** (optional): Developer notes for documentation
- **dropNothing** (optional): Set to `true` to represent a "no drop" entry

### Weight System

Weights are relative, not percentages. The system:
1. Sums all weights in the drop table
2. Rolls a random number between 0 and total weight
3. Selects the drop based on where the roll lands

**Example:**
```json
"drops": [
  { "itemId": "oak_log", "weight": 80 },    // 80% chance
  { "itemId": "birch_log", "weight": 15 },  // 15% chance
  { "dropNothing": true, "weight": 5 }      // 5% chance of nothing
]
```

Total weight = 100
- oak_log: 80/100 = 80%
- birch_log: 15/100 = 15%
- nothing: 5/100 = 5%

### Activity Integration

Activities reference drop tables in their rewards section:

```json
{
  "activityId": "activity-chop-oak",
  "name": "Chop Oak Trees",
  "rewards": {
    "experience": {
      "woodcutting": 30
    },
    "dropTables": [
      "woodcutting-oak",
      "rare-woodcutting"
    ]
  }
}
```

When an activity completes, the system:
1. Rolls on each drop table in the array
2. Collects all drops (excluding "dropNothing" entries)
3. Awards items to the player's inventory

## Drop Table Service

### Location: `be/services/dropTableService.js`

### Methods

#### `loadAll()`
Load all drop table definitions from JSON files.

#### `getDropTable(dropTableId)`
Get a single drop table by ID.

#### `getAllDropTables()`
Get all loaded drop tables.

#### `rollDropTable(dropTableId, options = {})`
Roll on a single drop table using weighted random selection.

**Parameters:**
- `dropTableId`: The drop table to roll on
- `options`: Optional modifiers (luck, quality multipliers, etc.)

**Returns:** Drop object or `null` if "dropNothing" was rolled

```javascript
{
  itemId: 'oak_log',
  quantity: 2,
  qualityBonus: { woodGrain: 0.2 },
  qualityMultiplier: 1.0
}
```

#### `rollMultipleDropTables(dropTableIds, options = {})`
Roll on multiple drop tables at once.

**Returns:** Array of drop objects (excludes null drops)

#### `getDropTableStats(dropTableId)`
Get statistics and probabilities for a drop table.

**Returns:**
```javascript
{
  dropTableId: 'woodcutting-oak',
  name: 'Oak Woodcutting Drops',
  totalWeight: 100,
  drops: [
    {
      itemId: 'oak_log',
      weight: 80,
      probability: '80.00%',
      quantityRange: '1-2',
      comment: 'Common oak logs'
    }
  ]
}
```

#### `reload()`
Hot-reload all drop table definitions (useful for development).

## Location Service Integration

The LocationService automatically uses drop tables when calculating activity rewards.

### Updated Method: `calculateActivityRewards(activity, options = {})`

**Backward Compatible:** Activities can still use the old `rewards.items` format with `chance` fields. The system supports both:

```javascript
// New system - drop tables (recommended)
"rewards": {
  "dropTables": ["woodcutting-oak", "rare-woodcutting"]
}

// Old system - still works
"rewards": {
  "items": [
    { "itemId": "oak_log", "quantity": { "min": 1, "max": 2 }, "chance": 0.9 }
  ]
}

// Can use both!
"rewards": {
  "dropTables": ["woodcutting-oak"],
  "items": [
    { "itemId": "special_item", "quantity": { "min": 1, "max": 1 }, "chance": 0.01 }
  ]
}
```

## Common Patterns

### Pattern 1: Generic Rare Drops

Create reusable rare drop tables for similar activities:

```json
// rare-woodcutting.json
{
  "dropTableId": "rare-woodcutting",
  "drops": [
    { "itemId": "health_potion", "weight": 3 },
    { "itemId": "copper_ore", "weight": 5 },
    { "dropNothing": true, "weight": 92 }
  ]
}
```

Apply to all woodcutting activities:
```json
"dropTables": ["woodcutting-oak", "rare-woodcutting"]
"dropTables": ["woodcutting-pine", "rare-woodcutting"]
"dropTables": ["woodcutting-birch", "rare-woodcutting"]
```

### Pattern 2: Quality Tiers

Create multiple entries for the same item with different quality bonuses:

```json
{
  "drops": [
    { "itemId": "oak_log", "weight": 70, "quantity": { "min": 1, "max": 1 } },
    { "itemId": "oak_log", "weight": 20, "quantity": { "min": 1, "max": 1 }, "qualityBonus": { "woodGrain": 0.2 } },
    { "itemId": "oak_log", "weight": 10, "quantity": { "min": 1, "max": 2 }, "qualityBonus": { "woodGrain": 0.4 } }
  ]
}
```

### Pattern 3: Bycatch/Variety

Add variety by including related items with low weights:

```json
{
  "dropTableId": "fishing-salmon",
  "drops": [
    { "itemId": "salmon", "weight": 70 },
    { "itemId": "trout", "weight": 8, "comment": "Sometimes catch trout instead" },
    { "dropNothing": true, "weight": 2, "comment": "The one that got away" }
  ]
}
```

## Testing

### Test Script: `be/test-drop-tables.js`

Run the test script to verify drop table logic:

```bash
cd be
node test-drop-tables.js
```

**Output:**
- Drop table statistics with probabilities
- Sample rolls showing distribution
- Multi-table rolling examples

### Manual Testing

Use the stats method to verify probabilities:

```javascript
const stats = dropTableService.getDropTableStats('woodcutting-oak');
console.log(JSON.stringify(stats, null, 2));
```

## Future Enhancements

Potential additions to the drop table system:

1. **Conditional Drops**: Require player stats/skills for certain drops
2. **Luck Modifiers**: Allow player attributes to influence drop rates
3. **Time-based Drops**: Different drops at different times of day
4. **Weather Effects**: Weather conditions affecting drop tables
5. **Streak Bonuses**: Improved drops after consecutive activities
6. **Drop Table Inheritance**: Base drop tables that extend/override
7. **Player-specific Drops**: Track personal drop history for balancing
8. **Drop Table Collections**: Group multiple drop tables with meta-weights

## Migration Guide

To convert an existing activity to use drop tables:

**Before:**
```json
"rewards": {
  "experience": { "woodcutting": 30 },
  "items": [
    { "itemId": "oak_log", "quantity": { "min": 1, "max": 2 }, "chance": 0.9 }
  ]
}
```

**After:**
1. Create drop table file: `be/data/locations/drop-tables/my-activity-drops.json`
2. Convert chance to weight (0.9 → 90 weight, 0.1 → 10 weight for nothing)
3. Update activity:

```json
"rewards": {
  "experience": { "woodcutting": 30 },
  "dropTables": ["my-activity-drops"]
}
```

## API Endpoints

No new endpoints required. Drop tables are used internally by the activity completion system.

However, you could add these for admin/debugging:

```javascript
// Get all drop tables (admin)
GET /api/drop-tables

// Get drop table stats (admin)
GET /api/drop-tables/:dropTableId/stats

// Reload drop tables (admin)
POST /api/drop-tables/reload
```

## Performance Considerations

- Drop tables are loaded once at startup
- Rolling is O(n) where n = number of drops in table (negligible for typical table sizes)
- No database queries during drop calculation
- Memory footprint is minimal (drop tables are simple JSON objects)

## Conclusion

The drop table system provides a robust, flexible foundation for loot distribution in ClearSkies. It's designed to be easy to balance, extend, and reuse across activities while maintaining backward compatibility with the old system.
