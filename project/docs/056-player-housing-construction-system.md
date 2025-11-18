# Player Housing & Construction System

**Date**: 2025-01-17
**Status**: Planned

## Overview

Comprehensive player housing system introducing the Construction skill, property ownership, group construction activities, and personal crafting spaces. Houses serve as expandable storage, gardening locations, and crafting bonus providers while creating significant gold and resource sinks for the economy.

## Design Rationale

### Construction as Multi-Purpose Skill

**Problem**: Many housing systems create skills that only work within housing, limiting their appeal.

**Solution**: Construction skill has value both inside and outside housing:
- **Inside Housing**: Build/upgrade structures, craft furniture, create storage
- **Outside Housing**: Build public structures (bridges, docks), craft large equipment (siege weapons, carts), repair town buildings, build guild halls
- **Standalone Value**: Players benefit from Construction even without owning property

### Social Construction Activities

**Problem**: Building a house alone can be tedious and isolated.

**Solution**: Group construction projects where multiple players contribute materials and actions:
- High material costs incentivize player economy and trading
- Other players can help build for Construction XP
- XP rewards split proportionally among all contributors
- Owner receives bonus XP on completion
- Creates social gameplay and community cooperation

### Economic Design

**Gold Sinks**:
- Plot purchases: 5,000g (Cottage) → 150,000g (Grand Estate)
- Future property taxes (weekly upkeep)
- Vendor materials (expensive emergency option)

**Resource Sinks**:
- High material costs (500-8000 planks, 100-1500 nails, stone, glass)
- Encourages crafting, gathering, and player trading
- Construction becomes viable profession (help others build for profit)

### Progression Philosophy

Houses have **functional value** through storage/garden limits, plus **customization choice** through room selection:
- Early houses: 2-4 rooms (can't fit all crafting stations)
- Late houses: 13+ rooms (all crafting skills + extras)
- Players must choose which crafting bonuses they want until high Construction levels
- Incentivizes continued progression to build larger houses

## House Tier System

| Tier | Construction Level | Plot Cost | Materials Required | Rooms | Storage | Gardens | Build Actions |
|------|-------------------|-----------|-------------------|-------|---------|---------|---------------|
| Cottage | 5 | 5,000g | 500 planks, 100 nails | 2 | 2 | 3 | 50 |
| House | 15 | 15,000g | 1,500 planks, 300 nails, 100 stone | 4 | 4 | 6 | 100 |
| Manor | 25 | 35,000g | 3,000 planks, 600 nails, 300 stone, 100 glass | 7 | 6 | 9 | 150 |
| Estate | 35 | 75,000g | 5,000 planks, 1,000 nails, 600 stone, 300 glass | 10 | 8 | 12 | 200 |
| Grand Estate | 45 | 150,000g | 8,000 planks, 1,500 nails, 1,000 stone, 500 glass | 13 | 10 | 15 | 250 |

**Design Notes**:
- 13 rooms = enough for all crafting skills (cooking, smithing, alchemy, construction, future enchanting, weaving, scribing, etc.)
- Storage slots provide multiple containers (each with capacity limits)
- Gardens scale to support serious farming operations
- Build actions = number of material contribution steps required

## Room Types & Bonuses

Rooms provide crafting bonuses using the existing effect system:

| Room Type | Affects Skill | Bonuses |
|-----------|---------------|---------|
| Kitchen | Cooking | +10% success rate, -10% duration |
| Forge | Smithing | +10% success rate, -10% duration |
| Laboratory | Alchemy | +10% success rate, -10% duration |
| Workshop | Construction | +10% success rate, -10% duration |
| Enchanting Chamber | Enchanting (future) | +10% success rate, -10% duration |
| Loom Room | Weaving (future) | +10% success rate, -10% duration |
| Study | Scribing (future) | +10% success rate, -10% duration |
| Greenhouse | Gardening | +1 quality chance on harvests |
| Storage Room | N/A | +1 extra storage container slot |
| Garden Extension | N/A | +3 extra garden plots |

**Implementation**: Rooms apply effects via `EffectContext.CRAFTING_QUALITY_BONUS` and `EffectContext.ACTIVITY_DURATION` with skill-specific conditions.

## Construction Process Flow

### Step 1: Purchase Plot

Players visit Land Office facilities at residential locations (Kennik Residential, Mountain Pass Residential, etc.):

```typescript
POST /api/housing/purchase-plot
{
  locationId: 'kennik-residential',
  plotSize: 'cottage' | 'house' | 'manor' | 'estate' | 'grand-estate'
}

// Response
{
  plotId: 'uuid',
  ownerId: userId,
  location: 'kennik-residential',
  plotSize: 'cottage',
  goldPaid: 5000,
  status: 'empty'  // Ready for construction
}
```

### Step 2: Initiate Construction Project

Player starts construction project, depositing required materials from inventory:

```typescript
POST /api/housing/start-construction
{
  plotId: 'uuid',
  buildingType: 'cottage',
  materials: {
    planks: 500,
    nails: 100
  }
}

// Creates ConstructionProject
{
  projectId: 'uuid',
  projectType: 'house-construction',
  ownerId: userId,
  status: 'in-progress',
  requiredMaterials: {
    planks: { required: 500, contributed: 500 },  // Owner deposits upfront
    nails: { required: 100, contributed: 100 }
  },
  totalActions: 50,
  completedActions: 0,
  contributors: Map<userId, { username, actionsCompleted: 0 }>,
  rewards: {
    baseXP: 1000,      // Split among contributors by action count
    ownerBonusXP: 500  // Extra for project owner
  }
}
```

### Step 3: Group Construction Activity

Players at the location can view and join active construction projects:

```typescript
// WebSocket: Browse projects at location
socket.emit('construction:browseProjects', { locationId: 'kennik-residential' });

// Response: List of active projects
[
  {
    projectId: 'uuid',
    projectType: 'house-construction',
    ownerName: 'PlayerName',
    buildingType: 'cottage',
    progress: '15/50 actions',
    contributorsCount: 3
  }
]

// Join project
socket.emit('construction:joinProject', { projectId: 'uuid' });

// Perform construction action (adds materials, progresses project)
socket.emit('construction:contribute', {
  projectId: 'uuid',
  actionCount: 1  // Player performs 1 construction action
});

// Each action:
// - Increments completedActions
// - Awards small XP to contributor (~5-10 per action)
// - Broadcasts progress to all viewers
```

### Step 4: Project Completion

When `completedActions === totalActions`, project completes:

```typescript
// WebSocket broadcast to all contributors
socket.on('construction:projectCompleted', {
  projectId: 'uuid',
  propertyId: 'new-property-uuid',  // Created property
  rewards: {
    contributors: [
      { userId, username: 'Helper1', actionsCompleted: 15, xpAwarded: 300 },
      { userId, username: 'Helper2', actionsCompleted: 20, xpAwarded: 400 },
      { userId, username: 'Owner', actionsCompleted: 15, xpAwarded: 800 }  // Includes owner bonus
    ]
  }
});

// Property created in database
{
  propertyId: 'uuid',
  ownerId: userId,
  propertyType: 'house',
  tier: 'cottage',
  location: 'kennik-residential',
  rooms: [],  // Empty, player builds rooms next
  storageContainers: [],
  gardens: [],
  createdAt: Date.now()
}
```

## Database Schema

### Property Model

```typescript
{
  propertyId: string,
  ownerId: string,
  propertyType: 'house' | 'shop' | 'workshop',
  tier: 'cottage' | 'house' | 'manor' | 'estate' | 'grand-estate',
  location: string,  // e.g., 'kennik-residential'

  // House-specific fields
  rooms: [{
    roomId: string,
    roomType: 'kitchen' | 'forge' | 'laboratory' | 'workshop' | 'storage-room' | 'greenhouse' | 'garden-extension',
    level: number,      // Future: room upgrade system
    furniture: []       // Future: visual furniture placement
  }],

  storageContainers: [{
    containerId: string,
    containerType: 'house-chest',
    name: string,
    capacity: number,   // e.g., 100 slots per container
    items: InventoryItem[]  // Reuses existing inventory schema
  }],

  gardens: [{
    plotId: string,
    crop: string | null,      // itemId of planted seed
    plantedAt: Date | null,
    harvestAt: Date | null,
    qualityBonus: number      // From greenhouse room
  }],

  createdAt: Date,
  lastVisited: Date
}
```

### ConstructionProject Model

```typescript
{
  projectId: string,
  projectType: 'house' | 'room' | 'storage' | 'garden-plot' | 'shop',
  ownerId: string,
  ownerName: string,
  propertyId: string | null,  // null if building new property
  location: string,           // Where the project is located
  status: 'in-progress' | 'completed' | 'abandoned',

  // Project requirements
  requiredMaterials: Map<itemId, {
    required: number,
    contributed: number
  }>,
  requiredGold: number,
  goldPaid: boolean,

  // Progress tracking
  totalActions: number,
  completedActions: number,

  // Contributors and rewards
  contributors: Map<userId, {
    username: string,
    actionsCompleted: number,
    materialsContributed: Map<itemId, number>
  }>,

  rewards: {
    baseXP: number,        // Split proportionally by actions
    ownerBonusXP: number,  // Extra for owner
    completionItem: string | null  // e.g., property deed
  },

  startedAt: Date,
  completedAt: Date | null
}
```

### Player Schema Additions

```typescript
// Add to Player model
{
  properties: [string],  // Array of propertyIds owned by player
  maxProperties: number, // Scales with Construction level: Math.floor(constructionLevel / 10) + 1
  activeConstructionProjects: [string]  // Array of projectIds player is participating in
}
```

## Material Pipeline

### New Materials & Recipes

**Construction Materials**:
- **Planks** - Crafted from logs at sawmill (1 log → 4 planks)
- **Nails** - Smithing recipe (1 iron ingot → 10 nails)
- **Stone** - New mining resource (quarry activity)
- **Glass** - Cooking/alchemy (sand → glass, requires high temperature)

**New Activities**:
- **Sawmill** (Construction 1) - Convert logs to planks
- **Stone Quarry** (Mining 10) - Gather stone blocks
- **Sand Collection** (Gathering 5) - Gather sand for glassmaking
- **Glassblowing** (Alchemy 15) - Convert sand to glass panes

### Vendor Availability

Land Office vendors sell construction materials at premium prices:
- Planks: 10g each (vs 2-3g if self-crafted)
- Nails: 5g each (vs 1g if self-crafted)
- Stone: 8g each (vs free if mined)
- Glass: 20g each (vs 5g if self-crafted)

Emergency option for players who want to buy progress, but incentivizes self-sufficiency.

## Integration with Existing Systems

### Storage System (Reuse)

House storage containers use the **exact same system** as bank storage:
- Same `storageContainers` array schema
- Same WebSocket events (`storage:deposit`, `storage:withdraw`, `storage:bulkDeposit`)
- Same stacking logic (itemId + qualities + traits)
- Each house container has unique `containerId` (e.g., `house-cottage-chest-001`)

**Benefits**:
- Zero duplicate code
- Proven, tested system
- Multi-user real-time updates already work
- Easy to add multiple containers per house

### Effect System Integration

Room bonuses are data-driven effects:

```typescript
// Example: Kitchen room
{
  roomType: 'kitchen',
  effects: [
    {
      context: EffectContext.CRAFTING_QUALITY_BONUS,
      value: 1,
      modifierType: ModifierType.FLAT,
      conditions: [
        { type: ConditionType.SKILL_REQUIRED, skill: 'cooking', value: 1 }
      ]
    },
    {
      context: EffectContext.ACTIVITY_DURATION,
      value: -10,
      modifierType: ModifierType.PERCENTAGE,
      conditions: [
        { type: ConditionType.SKILL_REQUIRED, skill: 'cooking', value: 1 }
      ]
    }
  ]
}
```

Effect evaluator checks player's house rooms when crafting/performing activities.

### Gardening & Farming

Garden plots are timed activities (like gathering):

```typescript
// Plant seed
socket.emit('housing:plantCrop', {
  propertyId: 'uuid',
  plotId: 'plot-001',
  seedItemId: 'wheat_seeds',
  instanceId: 'inventory-instance-uuid'
});

// Server calculates growth time based on seed definition
{
  crop: 'wheat_seeds',
  plantedAt: Date.now(),
  harvestAt: Date.now() + (3600 * 1000),  // 1 hour growth time
  qualityBonus: 1  // From greenhouse room
}

// Harvest when ready
socket.emit('housing:harvestCrop', {
  propertyId: 'uuid',
  plotId: 'plot-001'
});

// Awards produce with quality bonuses
// Uses drop table system (seed defines harvest drop table)
```

**New Skill: Farming**:
- Unlocked by planting first seed
- XP awarded on harvest
- Higher farming level = better quality crops
- Linked attribute: Will (50% XP passthrough)

### Quest System Integration

**New Tutorial Quests**:
- "A Place to Call Home" - Purchase first plot, start construction project
- "Raising the Roof" - Complete cottage construction (owner or helper)
- "First Harvest" - Plant and harvest a crop

**New Optional Quests**:
- "Master Builder" - Build a Manor-tier house
- "Green Thumb" - Harvest 50 crops from your gardens
- "Community Builder" - Help 10 other players with construction projects

## Bank Rebalancing

**Current**: Bank has 200 slots (very generous)

**After Housing**:
- **Bank**: 50 slots (secure storage for valuables, accessible from any location)
- **House Storage**: 2-10 containers × 100 slots each = 200-1000 slots total
- **Incentive**: Players need housing for serious storage expansion
- **Trade-off**: Bank is globally accessible, house storage requires visiting property

## Implementation Phases

### Phase 1: Construction Skill Foundation ✅
**Goal**: Add Construction skill and material pipeline

**Tasks**:
1. Add Construction skill to Player schema
2. Create construction material recipes:
   - Sawmill activity (logs → planks)
   - Nail recipe (iron ingots → nails)
   - Stone quarry activity (new mining resource)
   - Glassblowing recipe (sand → glass)
3. Add Land Office facilities to locations
4. Migration: Initialize Construction skill for existing players

**Files**:
- [Player.ts](../../be/models/Player.ts) - Add construction skill
- [RecipeRegistry.ts](../../be/data/recipes/RecipeRegistry.ts) - Construction recipes
- [ActivityRegistry.ts](../../be/data/locations/ActivityRegistry.ts) - Sawmill, quarry activities
- [ItemRegistry.ts](../../be/data/items/ItemRegistry.ts) - Planks, stone, glass items
- Migration: `NNN-add-construction-skill.js`

### Phase 2: Property & Project Models ✅
**Goal**: Database models for properties and construction projects

**Tasks**:
1. Create Property model (houses, shops, workshops)
2. Create ConstructionProject model (tracking, contributors, rewards)
3. Add `properties` and `maxProperties` to Player schema
4. Create property service (CRUD operations)
5. Create construction project service (create, contribute, complete)

**Files**:
- `be/models/Property.ts` (new)
- `be/models/ConstructionProject.ts` (new)
- `be/services/propertyService.ts` (new)
- `be/services/constructionService.ts` (new)
- Migration: `NNN-add-property-system.js`

### Phase 3: Group Construction Mechanics ✅
**Goal**: WebSocket-based construction activities

**Tasks**:
1. Construction WebSocket handler (join, contribute, complete)
2. Project browsing endpoints (active projects at location)
3. Plot purchase endpoint
4. Material contribution system
5. XP distribution on completion
6. Real-time progress updates

**Files**:
- `be/sockets/constructionHandler.ts` (new)
- `be/routes/housing.ts` (new)
- `be/controllers/housingController.ts` (new)

**WebSocket Events**:
- `construction:browseProjects`
- `construction:createProject`
- `construction:joinProject`
- `construction:contribute`
- `construction:abandonProject`
- `construction:projectProgress`
- `construction:projectCompleted`

### Phase 4: House Functionality ✅
**Goal**: Room building, storage, and crafting bonuses

**Tasks**:
1. Room construction projects (build rooms in existing houses)
2. Storage container integration (reuse existing storage system)
3. Room-based crafting bonuses (effect system integration)
4. House teleportation feature
5. Property viewing/management UI

**Files**:
- Update `be/services/effectEvaluator.ts` - Check house rooms for bonuses
- `be/services/storageService.ts` - Add house container support
- `ui/src/app/components/game/house/house.component.ts` (new)
- `ui/src/app/services/housing.service.ts` (new)

### Phase 5: Gardening System ✅
**Goal**: Garden plots and crop farming

**Tasks**:
1. Garden plot construction projects
2. Farming skill initialization
3. Seed planting mechanics (WebSocket-based)
4. Crop growth timers (server-side tracking)
5. Harvest system with quality bonuses
6. Greenhouse room effects

**Files**:
- Add Farming skill to Player schema
- `be/sockets/farmingHandler.ts` (new)
- Update seed item definitions with growth times and harvest drop tables
- Migration: `NNN-add-farming-skill.js`

**WebSocket Events**:
- `farming:plantCrop`
- `farming:harvestCrop`
- `farming:checkPlots`

### Phase 6: UI & Polish ✅
**Goal**: Complete housing user interface

**Tasks**:
1. House management interface (room list, storage access, gardens)
2. Active construction projects browser
3. "Help Build" multiplayer discovery UI
4. Property list (for multi-house owners)
5. Construction progress visualization
6. Room building modal

**Files**:
- `ui/src/app/components/game/house/` - All house sub-components
- `ui/src/app/components/game/construction-browser/` (new)
- Update location component to show construction projects

### Phase 7: Future Expansion (Planned)
**Goal**: Advanced features and property types

**Tasks**:
1. Shop properties (player-run vendors)
2. Workshop properties (group crafting stations)
3. Furniture system (visual placement)
4. Property taxes (weekly upkeep)
5. Construction contracts (player-to-player services)
6. Property upgrades (expand existing houses)

## Benefits

### For Players
✅ **Meaningful Progression** - Houses scale with Construction level
✅ **Social Gameplay** - Group construction creates cooperation
✅ **Economic Participation** - Buying/selling materials and services
✅ **Customization** - Choose which crafting stations to prioritize
✅ **Long-term Goals** - Grinding to afford Grand Estate
✅ **Storage Expansion** - Serious storage without relying on bank

### For Economy
✅ **Gold Sink** - Plot purchases remove 5k-150k gold per house
✅ **Resource Sink** - Thousands of materials consumed per house
✅ **Player Trading** - Incentivizes auction house/trading system
✅ **Profession Viability** - Construction becomes profitable service

### For Game Systems
✅ **Reuses Existing Code** - Storage, effects, activities, WebSocket
✅ **Extensible** - Easy to add shops, workshops, guild halls
✅ **Data-Driven** - Room bonuses use effect system
✅ **Scalable** - Supports unlimited properties per location

## Future Expansion

### Player Shops (Phase 7)
- Shop properties allow player-run vendors
- Set prices, stock items, earn gold while offline
- Competition with NPC vendors
- Auction house alternative (direct player trading)

### Guild Halls
- Large construction projects requiring multiple guild members
- Shared storage (already supported by storage system)
- Guild-wide crafting bonuses
- Meeting spaces and social features

### Property Upgrades
- Upgrade cottage → house → manor (cheaper than building new)
- Expand existing rooms (level 1 kitchen → level 2 kitchen)
- Add decorative furniture for prestige
- Property value appreciation system

### Advanced Construction
- Bridges/roads connecting locations (unlock faster travel)
- Defensive structures (town walls, guard towers)
- Public crafting stations (sawmills, forges for all players)
- Siege equipment (catapults, battering rams for future PvP)

## Related Documentation

- [031-location-system.md](031-location-system.md) - Location/activity architecture
- [033-socketio-architecture.md](033-socketio-architecture.md) - WebSocket real-time design
- [044-storage-system.md](044-storage-system.md) - Storage container reuse
- [047-data-driven-effect-system-implementation.md](047-data-driven-effect-system-implementation.md) - Room bonus effects
- [055-quest-system-design.md](055-quest-system-design.md) - Housing tutorial quests

## Implementation Files

### Backend (To Be Created)
- `be/models/Property.ts` - Property database model
- `be/models/ConstructionProject.ts` - Construction project model
- `be/services/propertyService.ts` - Property CRUD operations
- `be/services/constructionService.ts` - Construction project logic
- `be/controllers/housingController.ts` - HTTP endpoints
- `be/routes/housing.ts` - Route definitions
- `be/sockets/constructionHandler.ts` - WebSocket construction events
- `be/sockets/farmingHandler.ts` - WebSocket farming events
- `be/data/recipes/construction/` - Construction recipes directory

### Frontend (To Be Created)
- `ui/src/app/components/game/house/` - House management components
- `ui/src/app/components/game/construction-browser/` - Active projects browser
- `ui/src/app/services/housing.service.ts` - Housing API service
- `ui/src/app/models/property.model.ts` - Property types

### Migrations (To Be Created)
- `NNN-add-construction-skill.js` - Initialize Construction skill
- `NNN-add-property-system.js` - Create Property and ConstructionProject collections
- `NNN-add-farming-skill.js` - Initialize Farming skill
- `NNN-rebalance-bank-storage.js` - Reduce bank to 50 slots

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| **Group construction** | Creates social gameplay, reduces grind |
| **High material costs** | Incentivizes economy, prevents instant houses |
| **Multiple properties** | Allows specialization, creates long-term goals |
| **Room choice** | Player agency, forces prioritization early |
| **Reuse storage system** | Proven code, zero duplication |
| **Construction outside housing** | Skill has standalone value |
| **80% refund on abandon** | Penalty for starting/stopping, not too harsh |
| **Max properties scale with level** | Prevents hoarding, rewards progression |
| **Bank reduction to 50 slots** | Makes housing storage valuable |
| **XP split by contribution** | Fair rewards, encourages helping |

---

**Status**: Ready for implementation Phase 1
