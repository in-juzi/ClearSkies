# Location System

The location system provides a rich world exploration and activity framework with a four-tier hierarchy: Locations → Facilities → Activities → Drop Tables.

## Architecture

### 1. Location Definitions

**File Location**: `be/data/locations/definitions/{LocationId}.ts`
**Registry**: `be/data/locations/LocationRegistry.ts`

Locations define areas in the game world with:
- Name and description
- Biome type (forest, mountain, sea)
- List of facilities available
- Travel requirements and discovery conditions

**Example**: Kennik (starting town), Forest Clearing, Mountain Pass

### 2. Biomes

**File Location**: `be/data/locations/biomes/{BiomeId}.ts`
**Registry**: `be/data/locations/BiomeRegistry.ts`

Biomes define environmental types:
- Forest, Mountain, Sea
- Ambient descriptions and characteristics
- Affect available resources and activities

### 3. Facilities

**File Location**: `be/data/locations/facilities/{FacilityId}.ts`
**Registry**: `be/data/locations/FacilityRegistry.ts`

Facilities are specific buildings or areas within locations:
- Examples: Market, Fishing Dock, Logging Camp, Mine
- Each facility offers different activities
- Can have vendors associated (vendorIds array)
- Support crafting (type: "crafting", craftingSkills array)

### 4. Activities

**File Location**: `be/data/locations/activities/{ActivityId}.ts`
**Registry**: `be/data/locations/ActivityRegistry.ts`

Activities are actions players can perform at facilities:

**Properties**:
- `activityId`: Unique identifier
- `name`: Display name
- `description`: What players do here
- `duration`: Time in seconds (server-enforced)
- `requirements`: Skills, equipped items, inventory items
- `rewards`: XP and drop tables

**Requirements Schema**:
```typescript
requirements: {
  skills: { woodcutting: 5 },
  equipped: [{ subtype: 'woodcutting-axe' }],
  inventory: [{ itemId: 'torch', quantity: 2 }]
}
```

**Examples**:
- Chop Oak (requires woodcutting-axe equipped)
- Fish Salmon (requires fishing-rod equipped)
- Mine Iron (requires mining-pickaxe equipped)

### 5. Drop Tables

**File Location**: `be/data/locations/drop-tables/{TableId}.ts`
**Registry**: `be/data/locations/DropTableRegistry.ts`

Drop tables define weighted loot pools for activity rewards:

**Properties**:
- `dropTableId`: Unique identifier
- `name`: Descriptive name
- `drops`: Array of drop entries

**Drop Entry Schema**:
```typescript
{
  itemId: 'oak_log',
  weight: 70,              // Relative probability
  quantity: { min: 1, max: 3 },
  qualityBonus: 2          // Optional: +2 to quality rolls
}
```

**Features**:
- Weighted loot system (higher weight = more common)
- Configurable quantity ranges
- Quality bonuses for rare drops
- Reusable across multiple activities

## Key Features

### Real-Time Socket.io
- Activity system uses Socket.io for instant completion events
- No HTTP polling overhead
- Events: `activity:start`, `activity:started`, `activity:completed`, `activity:cancelled`, `activity:getStatus`

### Server-Authoritative Timing
- Activity durations enforced server-side using setTimeout
- Prevents client-side manipulation of completion times
- Reconnection support restores in-progress activities

### Client-Driven Auto-Restart
- Activities automatically restart on completion
- Requires active player at completion (prevents AFK grinding)
- Can be disabled for cancelled or error states

### Activity Overwriting
- Starting a new activity automatically cancels the current one
- Starting travel automatically cancels the current activity
- No blocking errors - actions seamlessly overwrite each other
- Only combat blocks travel (cannot flee via travel action)

### XP Scaling
- Progressive XP reduction for activities below player level
- Scaling formula: `1 / (1 + 0.3 * (playerLevel - activityLevel - 1))`
- Grace range: 0-1 levels above activity = full XP
- Minimum floor: Always awards at least 1 XP
- See [xp-system.md](xp-system.md) for full details

## Backend Implementation

### LocationService
**File**: `be/services/locationService.ts`

**Key Methods**:
- `getLocation(locationId)`: Returns typed Location objects
- `validateActivityRequirements(player, activity)`: Validates skills, equipment, inventory
- `calculateScaledXP(playerLevel, activityLevel, baseXP)`: XP scaling formula
- `processActivityCompletion(player, activity)`: Awards XP and loot from drop tables
- `getActivityRewards(dropTableIds)`: Processes drop table rewards

### ActivityHandler (Socket.io)
**File**: `be/sockets/activityHandler.ts`

**Events**:
- `activity:start` - Client requests activity start
- `activity:started` - Server confirms activity started
- `activity:completed` - Server broadcasts completion with rewards
- `activity:cancelled` - Player cancelled activity
- `activity:getStatus` - Reconnection status check

## Frontend Implementation

### LocationService
**File**: `ui/src/app/services/location.service.ts`

**Features**:
- Socket.io client service with Angular signals
- Reactive state updates for active activities
- Auto-restart logic for completed activities
- Effect hooks for setting up listeners when connected

### Location Component
**File**: `ui/src/app/components/game/location/location.ts`

**Features**:
- Signal-based reactivity with computed signals
- Facility and activity browser
- Progress tracking with countdown timers
- Client-side auto-restart on completion

## Creating New Content

### Add a New Location
1. Create `be/data/locations/definitions/NewLocation.ts`
2. Define location properties (name, description, biome, facilities)
3. Register in `LocationRegistry.ts`
4. Run `npm run validate` to check references

### Add a New Activity
1. Create drop table first (if needed): `be/data/locations/drop-tables/NewDropTable.ts`
2. Create activity: `be/data/locations/activities/NewActivity.ts`
3. Register both in respective registries
4. Link activity to facility in facility definition
5. Run `npm run validate` to check all references

### Use Content Generator Agent
For complex content creation, use the Content Generator agent:
```
"Add salmon fishing at deep water dock, level 12 fishing requirement"
```

The agent will autonomously create drop tables, activities, facilities, and locations with proper validation.

See [content-generator-agent.md](content-generator-agent.md) for full documentation.

## Validation

The game data validation script checks:
- All item IDs exist in ItemRegistry
- All skill names are valid
- All biome IDs exist in BiomeRegistry
- Drop tables created before activities reference them
- Quantity ranges valid (min ≤ max)

Run validation:
```bash
cd be && npm run validate
```

## References

- [drop-table-system.md](drop-table-system.md) - Detailed drop table mechanics
- [item-requirements-system.md](item-requirements-system.md) - Activity requirement validation
- [xp-system.md](xp-system.md) - XP scaling formulas
- [content-generator-agent.md](content-generator-agent.md) - Automated content creation
