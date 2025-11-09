# ClearSkies - Medieval Fantasy Browser Game

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure

```
ClearSkies/
├── be/                     # Backend (Node.js/Express)
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── skillsController.js
│   │   ├── attributesController.js
│   │   ├── inventoryController.js
│   │   └── locationController.js
│   ├── data/              # Game data (JSON-based)
│   │   ├── items/
│   │   │   ├── definitions/   # Item definitions (resources, equipment, consumables)
│   │   │   ├── qualities/     # Quality definitions (woodGrain, purity, etc.)
│   │   │   └── traits/        # Trait definitions (pristine, cursed, etc.)
│   │   └── locations/
│   │       ├── definitions/   # Location definitions (kennik, forest-clearing, etc.)
│   │       ├── biomes/        # Biome definitions (forest, mountain, sea)
│   │       ├── facilities/    # Facility definitions (market, dock, mine, etc.)
│   │       ├── activities/    # Activity definitions (chop-oak, fish-salmon, etc.)
│   │       └── drop-tables/   # Drop table definitions (weighted loot pools)
│   ├── middleware/        # Auth and other middleware
│   │   ├── auth.js
│   │   └── responseValidator.js  # JSON serialization validator (dev only)
│   ├── migrations/        # Database migrations
│   │   ├── 001-add-skills-to-players.js
│   │   ├── 002-add-attributes-and-skill-main-attributes.js
│   │   ├── 003-add-location-system.js
│   │   └── 004-add-equipment-slots.js
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   └── Player.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── skills.js
│   │   ├── attributes.js
│   │   ├── inventory.js
│   │   └── locations.js
│   ├── services/         # Business logic services
│   │   ├── itemService.js
│   │   ├── locationService.js
│   │   └── dropTableService.js
│   └── utils/            # Utility functions
│       ├── jwt.js            # JWT token utilities
│       ├── migrations.js     # Migration runner
│       ├── jsonSafe.js       # JSON serialization with circular ref detection
│       ├── add-item.js       # Add items to player inventory (dev tool)
│       └── content-generator.js  # Interactive content creation agent
├── ui/                    # Frontend (Angular 20)
│   └── src/
│       ├── assets/       # Static assets (icons, images)
│       └── app/
│           ├── components/      # UI components
│           │   ├── game/       # Game-related components
│           │   │   ├── game.component.*
│           │   │   ├── skills/      # Skills component
│           │   │   ├── attributes/  # Attributes component
│           │   │   ├── inventory/   # Inventory component
│           │   │   ├── equipment/   # Equipment component
│           │   │   ├── location/    # Location component
│           │   │   └── character-status/  # Character status display
│           │   ├── shared/         # Shared/reusable components
│           │   │   └── confirm-dialog/    # Confirmation dialog
│           │   ├── login/
│           │   └── register/
│           ├── services/        # Angular services
│           │   ├── auth.service.ts
│           │   ├── skills.service.ts
│           │   ├── attributes.service.ts
│           │   ├── inventory.service.ts
│           │   ├── equipment.service.ts
│           │   ├── location.service.ts
│           │   └── confirm-dialog.service.ts
│           ├── guards/          # Route guards
│           │   └── auth.guard.ts (authGuard, guestGuard)
│           ├── interceptors/    # HTTP interceptors
│           │   └── auth.interceptor.ts
│           └── models/          # TypeScript interfaces
│               ├── user.model.ts
│               ├── inventory.model.ts
│               └── location.model.ts
├── project/               # Project management
│   ├── docs/             # Project documentation
│   │   ├── inventory-system.md
│   │   ├── equipment-system.md
│   │   ├── drop-table-system.md
│   │   ├── level-based-quality-trait-system.md
│   │   ├── item-requirements-system.md
│   │   ├── error-handling-system.md
│   │   └── content-generator-agent.md
│   ├── ideas/            # Feature ideas and concepts
│   ├── tasks/
│   │   ├── todo/         # Pending tasks
│   │   └── complete/     # Completed tasks
│   └── journal.md        # Development journal
└── .claude/
    └── commands/         # Custom Claude commands
        ├── todo.md
        ├── todo-done.md
        └── context-update.md
```

## Running the Project

- **Backend**: `cd be && npm run dev` (runs on http://localhost:3000)
- **Frontend**: `cd ui && npm run dev` (runs on http://localhost:4200)
- **Both**: `npm run dev` from root (runs both concurrently)

## Utility Scripts

### Adding Items to Player Inventory

**Script**: `be/utils/add-item.js`

When the user asks to add an item to their character (Juzi), use this script:

```bash
cd be && node utils/add-item.js
```

**How to modify for different items:**
1. Open `be/utils/add-item.js`
2. Change the `itemId` in line 28: `itemService.createItemInstance('ITEM_ID_HERE', QUANTITY)`
3. Run the script from the `be` directory

**Example item IDs:**
- Resources: `oak_log`, `pine_log`, `birch_log`, `iron_ore`, `copper_ore`, `coal`, `salmon`, `trout`, `shrimp`
- Equipment: `bronze_woodcutting_axe`, `iron_woodcutting_axe`, `bronze_mining_pickaxe`, `iron_mining_pickaxe`, `bamboo_fishing_rod`, `willow_fishing_rod`, `copper_sword`, `iron_sword`, `wooden_shield`, `iron_helm`, `hemp_coif`, `leather_tunic`
- Consumables: `bread`, `health_potion`, `mana_potion`

**Note**: The script initializes the item service, connects to the database, finds the player "Juzi", and adds the specified item to their inventory.

### Content Generator Agent

**Script**: `be/utils/content-generator.js`

Interactive CLI tool for creating new game content with built-in validation.

```bash
cd be && node utils/content-generator.js
```

**Features:**
- Create locations, facilities, activities, and drop tables
- Real-time validation of all references (items, skills, biomes)
- Prevents creation of drop tables with non-existent items
- Interactive prompts with step-by-step guidance
- JSON preview before saving
- Chain creation (create drop table → activity → facility → location)

**Menu Options:**
1. Drop Table - Create weighted loot pools
2. Activity - Create activities with requirements and rewards
3. Facility - Create facilities that house activities
4. Location - Create locations with facilities and navigation

**Validation:**
- ✓ All referenced items must exist in item definitions
- ✓ All drop tables validate item existence
- ✓ All skills, biomes, and other references are checked
- ✓ Prevents common errors (negative weights, invalid ranges, etc.)

**Recommended Workflow:**
1. Create drop tables first (for activity rewards)
2. Create activities (referencing drop tables)
3. Create facilities (grouping activities)
4. Create locations (assembling facilities)
5. Add navigation links between locations

See [project/docs/content-generator-agent.md](project/docs/content-generator-agent.md) for full documentation.

## Important Context

### Completed Features
- ✅ User authentication system (register/login/logout)
- ✅ JWT token-based session management with localStorage persistence
- ✅ Session persistence across page refreshes
- ✅ Protected routes with async auth guards (authGuard, guestGuard)
- ✅ HTTP interceptor for automatic JWT token attachment
- ✅ Player profile with character stats
- ✅ MongoDB models (User, Player)
- ✅ Game interface with three-column layout (inventory, location area, character/skills/attributes/equipment)
- ✅ Tabbed sidebar navigation for character info, equipment, skills, and attributes
- ✅ Skills system with 5 skills (woodcutting, mining, fishing, smithing, cooking)
- ✅ Skills UI with compact 3-column grid layout and hover tooltips
- ✅ Edge-aware tooltip positioning (prevents cutoff at screen edges)
- ✅ XP gain and automatic skill leveling (1000 XP per level)
- ✅ Attributes system with 7 attributes (strength, endurance, magic, perception, dexterity, will, charisma)
- ✅ Skill-to-attribute XP linking (skills award 50% XP to their main attribute)
- ✅ Attributes UI with compact 3-column grid and hover details
- ✅ Database migration system with up/down functions
- ✅ Skills API endpoints (GET all skills, GET single skill, POST add XP)
- ✅ Attributes API endpoints (GET all attributes, GET single attribute, POST add XP)
- ✅ Inventory system with dynamic qualities and traits
- ✅ JSON-based item definitions (18 items: 9 resources, 6 equipment, 3 consumables)
- ✅ Quality system (5 types: woodGrain, moisture, purity, freshness, age)
- ✅ Trait system (7 types with rarity levels: common to epic)
- ✅ Item instance management with stacking logic
- ✅ Inventory UI with category filtering and detailed item views
- ✅ Draggable item details panel (repositionable via header drag)
- ✅ Random quality/trait generation for items
- ✅ Dynamic vendor pricing based on qualities and traits
- ✅ Hot-reload capability for item definitions
- ✅ Location system with travel and activity management
- ✅ JSON-based location definitions (locations, biomes, facilities, activities)
- ✅ Location discovery and travel mechanics
- ✅ Activity system with skill-based requirements and rewards
- ✅ Activity progress tracking with time-based completion
- ✅ Activity completion log with recent rewards history (last 10 entries)
- ✅ Automatic activity reward claiming (no manual claim button needed)
- ✅ Location UI with facility and activity browsing
- ✅ Location API endpoints (GET locations, POST discover, POST start activity, POST travel)
- ✅ Drop table system for flexible loot distribution
- ✅ Weighted random drop selection with quality bonuses
- ✅ Reusable drop tables across multiple activities
- ✅ Equipment slot system with 10 default slots (head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft)
- ✅ Extensible slot architecture (easy to add new slots via addEquipmentSlot method)
- ✅ Item definitions with slot assignments for equipment items
- ✅ Equip/unequip functionality with slot validation
- ✅ Equipment UI with 3x4 grid layout and square slots
- ✅ Drag-and-drop from inventory to equipment slots
- ✅ Visual indicators for equipped items (purple border, sword emoji)
- ✅ Right-click to unequip items from slots
- ✅ Equipment API endpoints (GET equipped items, POST equip, POST unequip)
- ✅ Equipment service for managing equipped items state
- ✅ SVG icon system (222+ scalable icons for abilities, items, skills, attributes, UI elements)
- ✅ Improved UI layout with viewport overflow fixes (100vh height, proper overflow handling)
- ✅ Nodemon for backend auto-restart during development
- ✅ Level-based quality and trait system (discrete levels 1-5 for qualities, 1-3 for traits)
- ✅ Quality and trait display with descriptive names instead of percentages
- ✅ Improved item stacking based on identical quality/trait levels
- ✅ Confirm dialog component for destructive action confirmation
- ✅ Character status component (placeholder for future features)
- ✅ JSON safety utilities and response validator middleware

### Database Models

**User** (Authentication):
- username, email, password (hashed)
- isActive status, lastLogin timestamp

**Player** (Game Data):
- characterName, level, experience
- stats (health, mana, strength, dexterity, intelligence, vitality)
- attributes (strength, endurance, magic, perception, dexterity, will, charisma) - each with level & experience (1000 XP per level)
- skills (woodcutting, mining, fishing, smithing, cooking) - each with level, experience, and mainAttribute
  - Woodcutting → Strength
  - Mining → Strength
  - Fishing → Endurance
  - Smithing → Endurance
  - Cooking → Will
- inventory - array of item instances with:
  - instanceId (unique ID)
  - itemId (reference to item definition)
  - quantity (stack size)
  - qualities (Map<string, number>) - quality levels as integers (1-5)
  - traits (Map<string, number>) - trait levels as integers (1-3)
  - equipped (boolean)
  - acquiredAt (timestamp)
- inventoryCapacity (default: 100)
- equipmentSlots (Map<string, string|null>) - Extensible equipment slot system
  - Default slots: head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft
  - Key = slot name, Value = instanceId of equipped item (or null)
  - New slots can be added dynamically via addEquipmentSlot() method
- currentLocation (string, default: 'kennik') - Current location ID
- discoveredLocations (array of strings, default: ['kennik']) - List of discovered location IDs
- activeActivity (object, optional) - Currently active activity with:
  - activityId, facilityId, locationId
  - startTime, endTime (timestamps)
- travelState (object, optional) - Travel progress with:
  - isTravel (boolean)
  - targetLocationId
  - startTime, endTime (timestamps)
- gold, questProgress, achievements
- Methods:
  - `addSkillExperience(skillName, xp)` - Awards skill XP and 50% to linked attribute
  - `getSkillProgress(skillName)`
  - `addAttributeExperience(attributeName, xp)`
  - `getAttributeProgress(attributeName)`
  - `addItem(itemInstance)` - Add item with stacking logic
  - `removeItem(instanceId, quantity)` - Remove items
  - `getItem(instanceId)` - Get single item
  - `getItemsByItemId(itemId)` - Get all of one type
  - `getInventorySize()` - Total item count
  - `getInventoryValue()` - Total vendor price
  - `equipItem(instanceId, slotName)` - Equip item to slot (auto-unequips current item)
  - `unequipItem(slotName)` - Unequip item from slot
  - `getEquippedItems()` - Get all equipped items
  - `isSlotAvailable(slotName)` - Check if slot is empty
  - `addEquipmentSlot(slotName)` - Add new equipment slot (for extensibility)
  - `hasEquippedSubtype(subtype, itemService)` - Check if item with subtype is equipped in any slot
  - `hasInventoryItem(itemId, minQuantity)` - Check if item exists in inventory with min quantity
  - `getInventoryItemQuantity(itemId)` - Get total quantity of item in inventory

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile (protected)
- `POST /api/auth/logout` - Logout (protected)

**Skills:**
- `GET /api/skills` - Get all player skills with progress (protected)
- `GET /api/skills/:skillName` - Get single skill details (protected)
- `POST /api/skills/:skillName/experience` - Add XP to skill, returns both skill and attribute results (protected)

**Attributes:**
- `GET /api/attributes` - Get all player attributes with progress (protected)
- `GET /api/attributes/:attributeName` - Get single attribute details (protected)
- `POST /api/attributes/:attributeName/experience` - Add XP to attribute (protected)

**Inventory:**
- `GET /api/inventory` - Get player's full inventory with enhanced details (protected)
- `GET /api/inventory/items/:instanceId` - Get single item details (protected)
- `POST /api/inventory/items` - Add item to inventory with validation (protected)
  - Body: `{ itemId, quantity, qualities, traits }`
- `POST /api/inventory/items/random` - Add item with randomly generated qualities/traits (protected)
  - Body: `{ itemId, quantity }`
- `DELETE /api/inventory/items` - Remove item from inventory (protected)
  - Body: `{ instanceId, quantity? }`
- `GET /api/inventory/definitions` - Get all item definitions (catalog) (protected)
  - Query: `?category=resource|equipment|consumable`
- `GET /api/inventory/definitions/:itemId` - Get single item definition (protected)
- `POST /api/inventory/reload` - Hot-reload item definitions (admin) (protected)

**Equipment:**
- `GET /api/inventory/equipment` - Get all equipped items and available slots (protected)
- `POST /api/inventory/equipment/equip` - Equip an item to a slot (protected)
  - Body: `{ instanceId, slotName }`
  - Automatically unequips current item in slot if occupied
- `POST /api/inventory/equipment/unequip` - Unequip an item from a slot (protected)
  - Body: `{ slotName }`

**Locations:**
- `GET /api/locations` - Get all locations (discovered and undiscovered) (protected)
- `GET /api/locations/:locationId` - Get details for a specific location (protected)
- `POST /api/locations/discover` - Discover a new location (protected)
  - Body: `{ locationId }`
- `POST /api/locations/travel` - Start travel to a location (protected)
  - Body: `{ targetLocationId }`
- `POST /api/locations/activity/start` - Start an activity at current location (protected)
  - Body: `{ activityId, facilityId }`
- `POST /api/locations/activity/complete` - Complete current activity and claim rewards (protected)
- `POST /api/locations/activity/cancel` - Cancel current activity (protected)

## Development Guidelines

1. **Backend Changes**: Always update relevant models, controllers, routes
2. **Database Schema Changes**: Create migrations for model updates (see Database Migrations below)
3. **Frontend Changes**:
   - Use Angular signals for state management
   - All game-related components should be organized under `ui/src/app/components/game/`
   - Use standalone components with Angular 20
4. **Authentication**:
   - All protected endpoints use JWT middleware
   - Token stored in localStorage with key `clearskies_token`
   - Auth interceptor directly accesses localStorage to avoid circular dependencies
   - Guards use async initialization pattern with `initialized$` observable
   - **IMPORTANT**: Auth middleware attaches the full User document to `req.user`, so access the user ID via `req.user._id` (NOT `req.user.userId`)
5. **Assets**:
   - Store icons and images in `ui/src/assets/` (configured in angular.json)
   - **Icons are SVG format** (222+ icons available for abilities, items, skills, attributes, UI elements)
   - Icon paths use `.svg` extension (e.g., `assets/icons/skill_woodcutting.svg`)
6. **Styling**:
   - Use medieval fantasy theme (dark blues, purples, gold accents)
   - Design tokens available in `ui/src/design-tokens.scss`
   - See `ui/DESIGN_SYSTEM.md` for complete guidelines
   - Global styles use `height: 100vh` and `overflow: hidden` for proper viewport management
7. **Item System**:
   - Item definitions stored in JSON files in `be/data/items/`
   - Use ItemService for all item operations (loading, creation, calculations)
   - Hot-reload available via `/api/inventory/reload` endpoint
   - **Quality system**: Level-based (1-5), each level has explicit name, description, and effects
   - **Trait system**: Level-based (1-3), stored as Map<traitId, level>
   - Trait rarities: common (5%), uncommon (15%), rare (30%), epic (50%)
   - Items with identical quality/trait levels stack together
   - Equipment items must include a `slot` field indicating which equipment slot they can be equipped to
   - See `project/docs/level-based-quality-trait-system.md` for full details
8. **Location System**:
   - Location definitions stored in JSON files in `be/data/locations/`
   - Use LocationService for all location operations
   - Four-tier structure: locations → facilities → activities → rewards
   - Activities can require skills, award XP, and give item rewards via drop tables
   - Travel and activity completion are time-based
   - Drop tables use weighted random selection for flexible loot distribution
   - Activities reference drop tables in `rewards.dropTables` array
   - Drop tables support quality bonuses and "dropNothing" entries
9. **Equipment System**:
   - Equipment items must include a `slot` field in their definition
   - Use EquipmentService for managing equipped items
   - Equipment UI uses square slots (aspect-ratio: 1) with grid layout
   - Drag-and-drop is restricted to equipment category items only
   - Visual feedback for equipped items in inventory and equipment panels
   - Auto-unequip when equipping to occupied slots
10. **UI Design**:
   - Compact 3-column grid layouts for skills, attributes, and equipment
   - Hover tooltips for detailed information (prevents clutter)
   - Edge-aware positioning to prevent tooltip cutoff
   - Tabbed navigation for multi-view sidebars
   - Draggable panels for flexible UI positioning (drag from header only)
   - Square equipment slots using grid pseudo-element technique
   - Activity completion log displays last 10 completed activities with rewards
   - Automatic reward claiming (activities complete automatically when time expires)
11. **Error Handling & Serialization**:
   - **Response Validator Middleware**: Automatically validates all API responses in development mode
   - **jsonSafe Utility**: Use `be/utils/jsonSafe.js` for circular reference detection
     - `jsonSafe(obj, label)` - Validates object can be serialized, provides detailed error analysis
     - `sanitize(obj)` - Deep clone with Mongoose Map/schema conversion
     - `safeStringify(obj)` - Stringify with automatic Mongoose handling
   - **Mongoose Maps**: Always convert to plain objects before JSON serialization
     - Use `.toObject()` method on Mongoose Maps
     - `_sortedMapString()` in ItemService handles this automatically for quality/trait comparison
   - **Common Pitfall**: Don't reference item instances after `player.addItem()` - they become Mongoose documents with circular refs
12. **File Editing Workflow**:
   - **Always attempt Edit tool first** for making changes to existing files
   - **Retry Edit tool once** if it fails with "File has been unexpectedly modified"
   - **Only use bash commands as fallback** if Edit tool fails twice (bash is significantly slower)
   - Clean up any `.bak` files created during bash operations
   - File modification errors typically occur due to file watchers (Angular dev server, linters, formatters)
13. **Documentation**: Update CLAUDE.md and relevant docs in `project/docs/`

## Database Migrations

When modifying database schemas (Player, User models), create a migration to update existing records:

**Running Migrations:**
```bash
cd be
npm run migrate          # Run all pending migrations
npm run migrate:status   # Check migration status
npm run migrate:down     # Rollback last migration
```

**Existing Migrations:**
1. `001-add-skills-to-players.js` - Adds skills to existing player documents
2. `002-add-attributes-and-skill-main-attributes.js` - Adds attributes and mainAttribute field to skills
3. `003-add-location-system.js` - Adds location fields (currentLocation, discoveredLocations, activeActivity, travelState)
4. `004-add-equipment-slots.js` - Adds equipment slot system to all players with 10 default slots
5. `005-convert-quality-trait-to-levels.js` - Converts quality/trait system from decimal values to integer levels

**Creating a New Migration:**
1. Create a file in `be/migrations/` with format: `NNN-description.js`
2. Export `up()` and `down()` functions
3. Include name and description

**Migration Template:**
```javascript
async function up() {
  const Model = mongoose.model('ModelName');
  // Update logic here
  return { modified: count, message: 'Success message' };
}

async function down() {
  const Model = mongoose.model('ModelName');
  // Rollback logic here
  return { modified: count, message: 'Rollback message' };
}

module.exports = {
  up,
  down,
  name: '001-migration-name',
  description: 'What this migration does'
};
```

## Custom Commands

- `/todo` - Save AI response as a new todo task
- `/todo-done <filename>` - Move todo to completed
- `/context-update` - Update CLAUDE.md with latest project context and changes
- `/logical-commits` - Analyze unstaged changes and create logical, atomic commits

## Environment Variables

Backend requires `.env` file with:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration (default: 7d)

## Inventory System

The inventory system uses a three-tier architecture for flexibility and easy balancing:

1. **Item Definitions** (JSON files in `be/data/items/definitions/`)
   - Canonical item templates
   - 24 items total:
     - 9 resources: oak_log, pine_log, birch_log, iron_ore, copper_ore, coal, salmon, trout, shrimp
     - 12 equipment:
       - Weapons: copper_sword, iron_sword
       - Armor: wooden_shield, iron_helm, hemp_coif, leather_tunic
       - Tools: bronze_woodcutting_axe, iron_woodcutting_axe, bronze_mining_pickaxe, iron_mining_pickaxe, rare_iron_mining_pickaxe_offhand, bamboo_fishing_rod, willow_fishing_rod
     - 3 consumables: bread, health_potion, mana_potion
   - Define base properties, allowed qualities, traits, equipment slots, and subtypes
   - Equipment items include `subtype` field for activity requirement matching (e.g., woodcutting-axe, mining-pickaxe, fishing-rod)

2. **Quality & Trait Definitions** (JSON files)
   - **Qualities**: woodGrain, moisture, age, purity, freshness (integer levels 1-5)
     - Each level has explicit name, description, and effects
     - Example: woodGrain L1 (Poor Grain) → L5 (Perfect Grain)
   - **Traits**: fragrant, knotted, weathered, pristine, cursed, blessed, masterwork (integer levels 1-3)
     - Stored as Map<traitId, level> instead of array
     - Each level has escalating effects
   - Define effects on vendor pricing, crafting, alchemy, combat

3. **Item Instances** (Player inventory in MongoDB)
   - References to base items
   - Quality levels (1-5 integers) and trait levels (1-3 integers)
   - Automatic stacking for items with identical levels
   - Calculated vendor prices based on level modifiers

**Key Features:**
- Items have discrete quality levels (1-5) with descriptive names
- Traits stored as Map with levels (1-3) for escalating effects
- Better stacking: items with identical levels stack together
- Easy balancing by editing JSON level definitions (no code changes needed)
- Hot-reload capability without server restart
- Random generation based on item tier and rarity distributions
- Full documentation in `project/docs/inventory-system.md` and `project/docs/level-based-quality-trait-system.md`

## Location System

The location system provides a rich world exploration and activity framework:

1. **Location Definitions** (JSON files in `be/data/locations/definitions/`)
   - Define locations with name, description, biome type
   - List of facilities available at each location
   - Travel requirements and discovery conditions
   - Examples: Kennik (starting town), Forest Clearing, Mountain Pass

2. **Biomes** (JSON files in `be/data/locations/biomes/`)
   - Define environmental types (forest, mountain, sea)
   - Ambient descriptions and characteristics
   - Affect available resources and activities

3. **Facilities** (JSON files in `be/data/locations/facilities/`)
   - Specific buildings or areas within locations
   - Each facility offers different activities
   - Examples: Market, Fishing Dock, Logging Camp, Mine

4. **Activities** (JSON files in `be/data/locations/activities/`)
   - Actions players can perform at facilities
   - Requirements: skills, attributes, equipped items (by subtype), inventory items (with quantity)
   - Time-based completion (duration in seconds)
   - Rewards: XP, items via drop tables
   - Examples: Chop Oak (requires woodcutting-axe equipped), Fish Salmon (requires fishing-rod equipped), Mine Iron (requires mining-pickaxe equipped)

5. **Drop Tables** (JSON files in `be/data/locations/drop-tables/`)
   - Weighted loot pools for activity rewards
   - Define relative drop rates using weight system
   - Reusable across multiple activities
   - Support for quality bonuses and rare drops
   - Examples: woodcutting-oak, rare-woodcutting, fishing-salmon, rare-fishing

**Key Features:**
- Players start in Kennik and can discover new locations
- Travel between locations takes time
- Activities award skill XP and items to inventory via drop tables
- Activity completion is time-based (tracked server-side)
- Rich location descriptions and lore through biomes
- Flexible drop table system for easy loot balancing
- Item requirements system for activities (equipped tools and inventory items)
- Easy content expansion by adding new JSON files
- Full documentation in `project/docs/drop-table-system.md` and `project/docs/item-requirements-system.md`

## Equipment System

The equipment system allows players to equip items to specific body slots for stat bonuses and character progression:

1. **Equipment Slots** (Player.equipmentSlots Map)
   - 10 default slots: head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft
   - Stored as `Map<string, string|null>` (slot name → instanceId or null)
   - Extensible architecture: new slots can be added via `addEquipmentSlot()` method
   - Each slot can hold one item at a time

2. **Equipment Items** (Item definitions with `slot` field)
   - Must include `slot` field indicating which slot they can be equipped to
   - Examples: iron_helm (head), leather_tunic (body), copper_sword (mainHand), wooden_shield (offHand)
   - Properties include defense, damage, durability, required level
   - Equipment items are non-stackable (maxStack: 1)

3. **Equipment UI** (3x4 grid with square slots)
   - Drag-and-drop from inventory to equipment slots
   - Visual feedback: purple border and sword emoji for equipped items
   - Right-click to unequip items
   - Rarity-based coloring for equipped items
   - Square slots using grid pseudo-element technique (aspect-ratio: 1)

4. **Equipment Methods** (Player model)
   - `equipItem(instanceId, slotName)` - Equip item with validation and auto-unequip
   - `unequipItem(slotName)` - Unequip and return item to inventory
   - `getEquippedItems()` - Get all currently equipped items
   - `isSlotAvailable(slotName)` - Check if slot is empty
   - `addEquipmentSlot(slotName)` - Add new equipment slot for future expansion

**Key Features:**
- Slot-based equipment validation (items can only go in designated slots)
- Auto-unequip when equipping to occupied slot
- Items marked with `equipped: true` flag in inventory
- Full API support for equip/unequip operations
- Visual feedback throughout UI (inventory and equipment panels)
- Extensible for future slots (rings, accessories, etc.)
- Full documentation in `project/docs/equipment-system.md`

## Item Requirements System

The item requirements system enables activities to require specific tools and consumables:

1. **Equipment Requirements** (by subtype)
   - Activities can require items with specific subtypes to be equipped
   - Checks all equipment slots (mainHand, offHand, etc.) for matching subtype
   - Supports tier progression (bronze, iron, steel axes all satisfy "woodcutting-axe")
   - Example: `"equipped": [{ "subtype": "woodcutting-axe" }]`

2. **Inventory Requirements** (by itemId)
   - Activities can require specific items in inventory with minimum quantities
   - Items can be equipped or unequipped, just needs to be in inventory
   - Example: `"inventory": [{ "itemId": "torch", "quantity": 3 }]`

3. **Item Subtypes**
   - Equipment items include optional `subtype` field for categorization
   - Current subtypes: woodcutting-axe, mining-pickaxe, fishing-rod, sword, shield, helm, coif, tunic
   - Multiple items can share same subtype for progression tiers
   - Enables flexible requirement matching

**Activity Requirement Schema:**
```json
{
  "requirements": {
    "skills": { "woodcutting": 1 },
    "equipped": [
      { "subtype": "woodcutting-axe" }
    ],
    "inventory": [
      { "itemId": "torch", "quantity": 2 }
    ]
  }
}
```

**Tool Items:**
- Woodcutting: bronze_woodcutting_axe, iron_woodcutting_axe
- Mining: bronze_mining_pickaxe, iron_mining_pickaxe, rare_iron_mining_pickaxe_offhand
- Fishing: bamboo_fishing_rod, willow_fishing_rod

**Player Methods:**
- `hasEquippedSubtype(subtype, itemService)` - Check if subtype equipped in any slot
- `hasInventoryItem(itemId, minQuantity)` - Check if item in inventory with quantity
- `getInventoryItemQuantity(itemId)` - Get total item quantity

**Validation:**
- LocationService checks requirements before allowing activity start
- User-friendly error messages: "Requires woodcutting-axe equipped"
- Frontend displays requirements in activity detail view

**Full documentation:** `project/docs/item-requirements-system.md`

## Content Generator Agent

The Content Generator Agent (`be/utils/content-generator.js`) is an interactive CLI tool for creating game content with built-in validation.

**Purpose:**
- Assists in generating new locations, facilities, activities, and drop tables
- Ensures thorough creation with step-by-step prompts
- Validates that all referenced items exist (prevents broken drop tables)
- Checks all references (skills, biomes, items, facilities, etc.)

**How to Use:**
```bash
cd be
node utils/content-generator.js
```

**What It Creates:**
1. **Drop Tables** - Weighted loot pools with item validation
2. **Activities** - Actions with requirements and rewards
3. **Facilities** - Buildings that house activities
4. **Locations** - Areas with facilities and navigation

**Key Features:**
- Interactive prompts guide you through creation
- Real-time validation prevents errors
- Shows list of available items/skills/biomes
- Allows chaining (create drop table → activity → facility → location in sequence)
- Preview JSON before saving
- Color-coded terminal output

**Validation:**
- ✓ Prevents non-existent items in drop tables
- ✓ Validates skill requirements
- ✓ Checks biome existence
- ✓ Verifies facility and location references
- ✓ Ensures quantity ranges are valid
- ✓ Confirms weights are positive

**Recommended Workflow:**
1. Create drop tables first (defines loot)
2. Create activities (uses drop tables for rewards)
3. Create facilities (groups activities)
4. Create locations (assembles facilities)
5. Add navigation links (connects locations)

**Full documentation:** `project/docs/content-generator-agent.md`

## Platform-Specific Tool Notes

### Windows (MSYS/Git Bash)

**taskkill command:**
- **Correct usage**: `taskkill //F //PID <pid>`
- **Incorrect usage**: `taskkill /F /PID <pid>` (fails with "Invalid argument/option - 'F:/'")
- The forward slashes need to be doubled (`//`) in MSYS/Git Bash environments
- Example: `taskkill //F //PID 35732`

**move vs mv command:**
- **Correct usage**: `mv source destination` (Unix/MSYS command)
- **Incorrect usage**: `move source destination` (Windows CMD command, not available in MSYS/Git Bash)
- MSYS/Git Bash uses Unix commands, so use `mv` for moving/renaming files
- Example: `mv test-levels.js be/test-levels.js`

## Next Steps / Ideas

See `project/journal.md` for detailed development possibilities including:
- Combat system
- Quest system
- Crafting system (using inventory items)
- Alchemy system (quality-based recipes)
- Equipment durability and repair
- Item enchantments
- Trading and auction house
- World map
- Real-time multiplayer features
- NPC interactions and vendors
