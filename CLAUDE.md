# ClearSkies - Medieval Fantasy Browser Game

## Current Development Focus

**Active Features**:
- ✅ Herbalism system (completed - 6 herbs, 4 gathering locations)
- ✅ Combat skills framework (completed - 6 combat skills added)
- ✅ Manual/help system (completed - full game guide with 6 sections)
- ✅ Quality/trait effect display (completed - enhanced inventory UI)
- ✅ XP scaling display (completed - shows raw vs scaled XP)
- ✅ Real-time chat system (completed - Socket.io with commands and autocomplete)
- ✅ Icon organization (completed - 220+ icons organized into 6 categories)
- ✅ Vendor/NPC trading system (completed - buy/sell at gathering locations)
- ✅ Cooking/Crafting system (completed - quality inheritance, instance selection)
- ✅ Multi-channel icon colorization (completed - path-level SVG colorization with 40+ materials)

**Recent Changes** (Last 10 commits):
- refactor: UI cleanup and polish across game components
- feat: enhance crafting UI with icon display and improved feedback
- fix: improve crafting ingredient consumption and validation
- feat: create XpMiniComponent for inline XP display
- chore: add build-check slash command
- chore: increase component stylesheet size budget
- feat: integrate icon system into inventory and location UIs
- feat: add data-channel attributes to SVG icons
- feat: add icon field to all item definitions
- feat: add multi-channel SVG icon colorization system

**Known Issues**:
- None currently identified

**Next Priorities**:
- Smithing system (equipment crafting with tier progression)
- Alchemy system (potion brewing with quality-based effects)
- Combat system implementation
- Vendor enhancements (restocking, skill-based pricing)
- Player housing
- Guild/party system

> **Maintenance Note**: Update this section regularly so AI has context without needing to explore

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing

## Quick File Reference

### Frequently Modified Files

**Backend Core:**
- Controllers: [be/controllers/inventoryController.js](be/controllers/inventoryController.js), [be/controllers/locationController.js](be/controllers/locationController.js), [be/controllers/skillsController.js](be/controllers/skillsController.js), [be/controllers/attributesController.js](be/controllers/attributesController.js), [be/controllers/authController.js](be/controllers/authController.js), [be/controllers/manualController.js](be/controllers/manualController.js), [be/controllers/vendorController.js](be/controllers/vendorController.js), [be/controllers/craftingController.js](be/controllers/craftingController.js)
- Models: [be/models/Player.js](be/models/Player.js), [be/models/User.js](be/models/User.js), [be/models/ChatMessage.js](be/models/ChatMessage.js)
- Services: [be/services/itemService.js](be/services/itemService.js), [be/services/locationService.js](be/services/locationService.js), [be/services/dropTableService.js](be/services/dropTableService.js), [be/services/vendorService.js](be/services/vendorService.js), [be/services/recipeService.js](be/services/recipeService.js)
- Routes: [be/routes/inventory.js](be/routes/inventory.js), [be/routes/locations.js](be/routes/locations.js), [be/routes/skills.js](be/routes/skills.js), [be/routes/attributes.js](be/routes/attributes.js), [be/routes/auth.js](be/routes/auth.js), [be/routes/manual.js](be/routes/manual.js), [be/routes/vendors.js](be/routes/vendors.js), [be/routes/crafting.js](be/routes/crafting.js)
- Sockets: [be/sockets/chatHandler.js](be/sockets/chatHandler.js)

**Frontend Core:**
- Game Component: [ui/src/app/components/game/game.component.ts](ui/src/app/components/game/game.component.ts), [ui/src/app/components/game/game.component.html](ui/src/app/components/game/game.component.html)
- Inventory: [ui/src/app/components/game/inventory/inventory.component.ts](ui/src/app/components/game/inventory/inventory.component.ts), [ui/src/app/components/game/inventory/inventory.component.html](ui/src/app/components/game/inventory/inventory.component.html)
- Location: [ui/src/app/components/game/location/location.ts](ui/src/app/components/game/location/location.ts), [ui/src/app/components/game/location/location.html](ui/src/app/components/game/location/location.html)
- Skills: [ui/src/app/components/game/skills/skills.ts](ui/src/app/components/game/skills/skills.ts)
- Equipment: [ui/src/app/components/game/equipment/equipment.component.ts](ui/src/app/components/game/equipment/equipment.component.ts)
- Chat: [ui/src/app/components/game/chat/chat.component.ts](ui/src/app/components/game/chat/chat.component.ts)
- Vendor: [ui/src/app/components/game/vendor/vendor.component.ts](ui/src/app/components/game/vendor/vendor.component.ts), [ui/src/app/components/game/vendor/vendor.component.html](ui/src/app/components/game/vendor/vendor.component.html)
- Crafting: [ui/src/app/components/game/crafting/crafting.component.ts](ui/src/app/components/game/crafting/crafting.component.ts), [ui/src/app/components/game/crafting/crafting.component.html](ui/src/app/components/game/crafting/crafting.component.html)
- Manual: [ui/src/app/components/manual/manual.component.ts](ui/src/app/components/manual/manual.component.ts), [ui/src/app/components/manual/sections/](ui/src/app/components/manual/sections/)
- Shared Components: [ui/src/app/components/shared/item-mini/item-mini.component.ts](ui/src/app/components/shared/item-mini/item-mini.component.ts), [ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts](ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts), [ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts), [ui/src/app/components/shared/xp-mini/xp-mini.component.ts](ui/src/app/components/shared/xp-mini/xp-mini.component.ts)
- Services: [ui/src/app/services/inventory.service.ts](ui/src/app/services/inventory.service.ts), [ui/src/app/services/location.service.ts](ui/src/app/services/location.service.ts), [ui/src/app/services/skills.service.ts](ui/src/app/services/skills.service.ts), [ui/src/app/services/auth.service.ts](ui/src/app/services/auth.service.ts), [ui/src/app/services/manual.service.ts](ui/src/app/services/manual.service.ts), [ui/src/app/services/chat.service.ts](ui/src/app/services/chat.service.ts), [ui/src/app/services/vendor.service.ts](ui/src/app/services/vendor.service.ts), [ui/src/app/services/recipe.service.ts](ui/src/app/services/recipe.service.ts), [ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts), [ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts)
- Constants: [ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts)

**Game Data:**
- Item Definitions: [be/data/items/definitions/](be/data/items/definitions/)
- Location Definitions: [be/data/locations/definitions/](be/data/locations/definitions/)
- Activities: [be/data/locations/activities/](be/data/locations/activities/)
- Drop Tables: [be/data/locations/drop-tables/](be/data/locations/drop-tables/)
- Facilities: [be/data/locations/facilities/](be/data/locations/facilities/)
- Vendors: [be/data/vendors/](be/data/vendors/)
- Recipes: [be/data/recipes/](be/data/recipes/)

**Utilities:**
- [be/utils/add-item.js](be/utils/add-item.js) - Add items to player inventory
- [be/utils/content-generator.js](be/utils/content-generator.js) - Interactive content creation
- [be/utils/test-xp-scaling.js](be/utils/test-xp-scaling.js) - XP formula testing

## Project Structure (Key Files Only)

```
be/
├── controllers/      # inventoryController, locationController, skillsController, attributesController, authController
├── models/          # Player.js (inventory, skills, equipment), User.js
├── services/        # itemService, locationService, dropTableService
├── data/
│   ├── items/definitions/    # Item JSON files
│   └── locations/           # Location, activity, drop table JSON
├── migrations/      # Database migration scripts
└── utils/          # Dev tools (add-item.js, content-generator.js, test-xp-scaling.js)

ui/src/app/
├── components/game/  # inventory/, location/, skills/, equipment/, attributes/
├── services/        # *.service.ts (match backend APIs)
└── models/         # TypeScript interfaces
```

**Full structure**: See detailed tree above or explore with Task agent if needed

## Running the Project

- **Backend**: `cd be && npm run dev` (runs on http://localhost:3000)
- **Frontend**: `cd ui && npm run dev` (runs on http://localhost:4200)
- **Both**: `npm run dev` from root (runs both concurrently)

**IMPORTANT**: During active development sessions, the backend and frontend are already running on their expected ports. Do NOT start new instances without a specific reason (e.g., after making server configuration changes, installing new dependencies, or if processes have crashed). Check for existing processes first using `netstat` or similar tools.

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
- Resources:
  - Logs: `oak_log`, `willow_log`, `maple_log`
  - Ore: `copper_ore`, `iron_ore`, `silver_ore`
  - Fish: `trout`, `salmon`, `pike`, `shrimp`
  - Herbs: `chamomile`, `sage`, `nettle`, `mandrake_root`, `moonpetal`, `dragons_breath`
- Equipment: `bronze_woodcutting_axe`, `iron_woodcutting_axe`, `bronze_mining_pickaxe`, `iron_mining_pickaxe`, `bamboo_fishing_rod`, `willow_fishing_rod`, `copper_sword`, `iron_sword`, `wooden_shield`, `iron_helm`, `hemp_coif`, `leather_tunic`
- Consumables: `bread`, `health_potion`, `mana_potion`

**Note**: The script initializes the item service, connects to the database, finds the player "Juzi", and adds the specified item to their inventory.

## Common Code Patterns (Quick Reference)

### Adding New Item Definition
**File**: `be/data/items/definitions/{category}/{itemId}.json`
**Template**:
```json
{
  "itemId": "new_item",
  "name": "New Item",
  "description": "Medieval fantasy description...",
  "category": "resource|equipment|consumable",
  "rarity": "common|uncommon|rare|epic|legendary",
  "tier": 1,
  "baseValue": 10,
  "maxStack": 99,
  "allowedQualities": ["purity"],
  "allowedTraits": ["pristine", "blessed"]
}
```

### Adding New Activity
**File**: `be/data/locations/activities/{activity-id}.json`
**Template**:
```json
{
  "activityId": "new-activity",
  "name": "Activity Name",
  "description": "What players do here...",
  "duration": 10,
  "requirements": {
    "skills": { "woodcutting": 5 },
    "equipped": [{ "subtype": "woodcutting-axe" }]
  },
  "rewards": {
    "experience": { "woodcutting": 25 },
    "dropTables": ["drop-table-id"]
  }
}
```

### Adding New Drop Table
**File**: `be/data/locations/drop-tables/{table-id}.json`
**Template**:
```json
{
  "dropTableId": "new-drop-table",
  "name": "Drop Table Name",
  "drops": [
    {
      "itemId": "oak_log",
      "weight": 70,
      "quantity": { "min": 1, "max": 3 }
    },
    {
      "itemId": "rare_item",
      "weight": 30,
      "quantity": { "min": 1, "max": 1 },
      "qualityBonus": 2
    }
  ]
}
```

### Adding Skill XP (Backend Pattern)
**Location**: Player model method
```javascript
await player.addSkillExperience('woodcutting', xpAmount);
// Automatically awards 50% to linked attribute (Strength)
// Returns { skill: {...}, attribute: {...} }
```

### Equipment Slot Validation (Backend Pattern)
**Location**: inventoryController.js equip endpoint
```javascript
const itemDef = itemService.getItemDefinition(instanceItem.itemId);
if (itemDef.slot !== slotName) {
  return res.status(400).json({
    message: `Item cannot be equipped to ${slotName}. Requires ${itemDef.slot} slot.`
  });
}
```

### Item Stacking Logic (Backend Pattern)
**Location**: Player.addItem() in Player.js
```javascript
// Items stack if: same itemId, same quality levels, same trait levels
const existingItem = this.inventory.find(item =>
  item.itemId === itemInstance.itemId &&
  !item.equipped &&
  itemService._sortedMapString(item.qualities) === itemService._sortedMapString(itemInstance.qualities) &&
  itemService._sortedMapString(item.traits) === itemService._sortedMapString(itemInstance.traits)
);
```

### Converting Mongoose Maps to Plain Objects
**Location**: Any controller sending item data
```javascript
const plainItem = item.toObject();
if (plainItem.qualities instanceof Map) {
  plainItem.qualities = Object.fromEntries(plainItem.qualities);
}
if (plainItem.traits instanceof Map) {
  plainItem.traits = Object.fromEntries(plainItem.traits);
}
```

### ⚠️ CRITICAL: Accessing Mongoose Maps (Backend Pattern)
**IMPORTANT**: Mongoose Map fields **DO NOT** support bracket notation access. You **MUST** use `.get()` method.

**Problem**: Fields defined as `{ type: Map, of: ... }` in schemas return `undefined` with bracket notation.

**Examples in codebase**:
- `player.activeCrafting.selectedIngredients` (Map<string, string[]>) - in Player schema
- `player.equipmentSlots` (Map<string, string|null>) - in Player schema
- Item `qualities` and `traits` (Map<string, number>) - in inventory items

**❌ WRONG - Returns undefined**:
```javascript
const selectedIngredients = player.activeCrafting.selectedIngredients;
const instanceIds = selectedIngredients[ingredient.itemId]; // undefined!
```

**✅ CORRECT - Use .get() method**:
```javascript
const selectedIngredients = player.activeCrafting.selectedIngredients;
const instanceIds = selectedIngredients.get(ingredient.itemId); // works!

// Safe fallback pattern for optional Maps:
const instanceIds = selectedIngredients.get
  ? selectedIngredients.get(ingredient.itemId)
  : selectedIngredients[ingredient.itemId];
```

**Why this matters**:
- Bracket notation silently fails (returns `undefined`)
- No error is thrown, making debugging difficult
- Affects all Mongoose Map types in schemas
- Common source of "data exists but can't access it" bugs

**When to use .get()**:
- Accessing Map values in controllers
- Iterating over Map entries (use `.entries()` or `for...of`)
- Checking if Map has a key (use `.has(key)`)

**Real bug example**: Crafting ingredients weren't being consumed because `selectedIngredients[itemId]` returned `undefined`, causing the code to skip ingredient consumption logic entirely.

### Content Generator Agent

**Agent**: `.claude/agents/content-generator.md`

AI-powered agent for creating game content with autonomous operation and comprehensive validation.

**How to Use:**

Simply describe what content you want in natural language:

```
"Add a mountain mine where players can mine copper ore"
```

The agent will autonomously:
- ✓ Verify all item references exist
- ✓ Create drop tables with balanced weights
- ✓ Create activities with appropriate requirements
- ✓ Create facilities and locations
- ✓ Write medieval fantasy descriptions
- ✓ Report back with summary

**Example Requests:**

```
"Create a fishing spot for catching tuna in deep water"

"Add salmon fishing to Kennik dock, requires level 10 fishing"

"I need a forest clearing with logging. Players should be able to
chop birch trees at level 5 woodcutting"

"Create a drop table for rare gemstone mining with rubies (5%),
sapphires (10%), and common ore (85%)"
```

**Features:**
- Works in background while you continue coding
- AI-powered validation and balance suggestions
- Natural language interface (no menus or prompts)
- Creates entire content chains (drop table → activity → facility → location)
- Writes evocative medieval fantasy descriptions
- Checks existing content for consistency
- Explains design decisions

**What It Creates:**
1. Drop Tables - Weighted loot pools with item validation
2. Activities - Actions with requirements and rewards
3. Facilities - Buildings that house activities
4. Locations - Areas with facilities and navigation

**Validation:**
- ✓ All referenced items must exist
- ✓ Skills, biomes, and references validated
- ✓ Drop tables checked before activities reference them
- ✓ Balanced rewards and requirements
- ✓ Prevents common errors automatically

**Workflow:**

Traditional approach: ~27 minutes + context switching
With agent: ~30 seconds of your time, agent works in background

See [project/docs/content-generator-agent.md](project/docs/content-generator-agent.md) for full documentation.

### Content Validator Agent

**Agent**: `.claude/agents/content-validator.md`

AI-powered agent for validating existing game content and identifying broken references, inconsistencies, and data integrity issues.

**How to Use:**

Simply ask to validate the content:

```
"Validate all game content"

"Check for broken references in the content files"
```

The agent will autonomously:
- ✓ Read all item, quality, trait, drop table, activity, facility, location, and biome definitions
- ✓ Build reference maps of all valid IDs
- ✓ Validate all references across content files
- ✓ Check for broken item references in drop tables
- ✓ Identify unreferenced drop tables or activities
- ✓ Verify skill, biome, and subtype references
- ✓ Check quantity ranges and balance values
- ✓ Report comprehensive findings with fix suggestions

**What It Validates:**

1. **Item References** - All item IDs in drop tables exist in item definitions
2. **Drop Table References** - All drop tables referenced by activities exist
3. **Skill References** - All skills in requirements are valid (woodcutting, mining, fishing, smithing, cooking)
4. **Biome References** - All biomes referenced by locations exist
5. **Facility References** - All facilities in locations exist
6. **Activity References** - All activities in facilities exist
7. **Navigation Links** - All location links reference existing locations
8. **Quality/Trait IDs** - All quality and trait references are valid
9. **Equipment Subtypes** - All subtypes in requirements exist
10. **Data Integrity** - Quantity ranges, level values, weight values are reasonable

**Error Severity Levels:**

- **CRITICAL**: Breaks functionality (missing items, broken references)
- **WARNING**: May cause issues (unreferenced content, unusual balance)
- **INFO**: Best practices (missing descriptions, naming conventions)

**Example Issues Caught:**

```
[CRITICAL] Forest Clearing - Chop Oak Trees Activity
  Issue: Drop table references item 'birch_log'
  Problem: Item 'birch_log' does not exist
  Fix: Either create birch_log.json or remove from drop table

[WARNING] Woodcutting Pine Drop Table
  Issue: Drop table defined but never referenced
  Fix: Remove file or add activity using this table

[INFO] Mountain Pass Location
  Issue: Missing ambient description
  Fix: Add atmospheric details for immersion
```

**Workflow:**

1. Reads all content definitions
2. Builds reference maps (valid IDs)
3. Validates each content type systematically
4. Groups errors by severity
5. Provides actionable fix suggestions
6. Reports statistics and health assessment

**Benefits:**
- Catches broken references before they cause runtime errors
- Identifies unused content (dead code)
- Ensures consistent data integrity
- Provides actionable fix suggestions
- Works autonomously in background
- Comprehensive reporting with file locations

## Optimization Guidelines for AI

### Skip Exploration For:
- **Item additions** - Use templates in Common Code Patterns, don't search existing items
- **Activity creation** - Use Content Generator agent, don't explore all activities
- **Known bug fixes** - User will provide file:line references
- **Style tweaks** - CSS changes don't need architecture exploration
- **Simple JSON additions** - Use templates, skip validation searches

### Use Direct Tools (Grep/Glob/Read) For:
- Finding specific function definitions - `Grep("functionName", type: "js")`
- Locating item/activity by ID - `Grep("itemId", path: "be/data")`
- Checking if file exists - `Glob("**/filename.js")`
- Reading specific code sections - `Read(file, offset, limit)`

### Use Task Agent Only For:
- "How does X system work overall?" (architectural questions requiring multi-file analysis)
- "Find all places where Y is used" (comprehensive codebase search)
- Complex multi-step research tasks (involving multiple file types and validation)
- Content creation via Content Generator agent
- Content validation via Content Validator agent

### Token-Efficient Patterns:
1. **Provide file:line when known** - Skip Grep/Glob entirely
2. **Use offset/limit for large files** - Read only relevant sections
3. **Batch related changes** - One message, multiple edits
4. **Reference previous reads** - "In the Player model we looked at..."
5. **Use Edit over Write** - More efficient for modifications
6. **Use head_limit with Grep** - Limit results to first N matches
7. **Use files_with_matches** - Get file list before reading content

## Critical Code Locations

### Player Model (be/models/Player.js)
- Skills schema: ~L15-40
- Attributes schema: ~L42-55
- Inventory schema: ~L57-75
- Equipment slots: ~L77-85
- `addSkillExperience()`: ~L145-165
- `addAttributeExperience()`: ~L167-185
- `addItem()`: ~L200-240 (includes stacking logic)
- `removeItem()`: ~L242-265
- `equipItem()`: ~L280-310
- `unequipItem()`: ~L312-330
- `hasEquippedSubtype()`: ~L350-365
- `hasInventoryItem()`: ~L367-380

### Item Service (be/services/itemService.js)
- Item definitions loading: ~L20-60
- `getItemDefinition()`: ~L65-70
- `createItemInstance()`: ~L85-120
- `calculateVendorPrice()`: ~L145-180
- `generateRandomQualities()`: ~L200-235
- `generateRandomTraits()`: ~L240-275
- `_sortedMapString()`: ~L310-320 (quality/trait comparison)

### Location Service (be/services/locationService.js)
- Location loading: ~L25-70
- `getLocation()`: ~L75-85
- `validateActivityRequirements()`: ~L120-180
- `calculateScaledXP()`: ~L185-205 (XP scaling formula)
- `processActivityCompletion()`: ~L230-295
- `getActivityRewards()`: ~L300-340

### Inventory Controller (be/controllers/inventoryController.js)
- GET all inventory: ~L15-50
- POST add item: ~L55-95
- POST add random item: ~L100-135
- DELETE remove item: ~L140-175
- POST equip item: ~L180-220
- POST unequip item: ~L225-250
- Mongoose Map conversion helpers: Throughout (use Object.fromEntries pattern)

### Location Controller (be/controllers/locationController.js)
- GET all locations: ~L15-45
- GET location details: ~L50-80
- POST start activity: ~L90-145
- POST complete activity: ~L150-210
- POST travel: ~L215-260

## How to Ask Questions Efficiently

### ❌ High Token Usage:
- "Explore the inventory system" → I read 10+ files exploring architecture
- "Find where items are created" → I search entire codebase with multiple Greps
- "How does equipment work?" → I explore models, controllers, services, UI components
- "Show me all activities" → I read all activity JSON files

### ✅ Low Token Usage:
- "Add copper_helmet item to items/definitions/equipment/" → Direct creation using template
- "In inventoryController.js:145, fix the stacking check to validate trait levels" → Targeted edit
- "Check equipItem method in Player.js around line 280" → Direct Read with offset
- "Use Content Generator to add salmon fishing activity" → Agent handles it autonomously

### 🎯 Optimal Request Pattern:
1. **Provide file path + line number when known** - Enables direct Read with offset
2. **Use Content Generator for game content** - Activities, items, drop tables, locations
3. **Batch multiple related requests** - "Add items: copper_helmet, iron_helmet, steel_helmet with these properties..."
4. **Reference previous reads** - "In the Player model we looked at, modify addItem method..."
5. **Specify exact change location** - "In line 145 of inventoryController.js, change X to Y"

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
- ✅ Skills system with 12 skills:
  - Gathering: woodcutting, mining, fishing, herbalism
  - Crafting: smithing, cooking
  - Combat: oneHanded, dualWield, twoHanded, ranged, casting, gun
- ✅ Skills UI with compact 3-column grid layout and hover tooltips
- ✅ Edge-aware tooltip positioning (prevents cutoff at screen edges)
- ✅ XP gain and automatic skill leveling (1000 XP per level)
- ✅ XP scaling system with diminishing returns (polynomial decay based on level difference)
- ✅ Attributes system with 7 attributes (strength, endurance, magic, perception, dexterity, will, charisma)
- ✅ Skill-to-attribute XP linking (skills award 50% XP to their main attribute)
- ✅ Attributes UI with compact 3-column grid and hover details
- ✅ Database migration system with up/down functions
- ✅ Skills API endpoints (GET all skills, GET single skill, POST add XP)
- ✅ Attributes API endpoints (GET all attributes, GET single attribute, POST add XP)
- ✅ Inventory system with dynamic qualities and traits
- ✅ JSON-based item definitions (36 items: 21 resources including 6 herbs, 12 equipment, 3 consumables)
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
- ✅ Herbalism system (6 herbs, 4 gathering facilities, herbalism skill linked to Will)
- ✅ Combat skills framework (6 combat skills: oneHanded, dualWield, twoHanded, ranged, casting, gun)
- ✅ Manual/help system (comprehensive game guide with 6 tabbed sections)
- ✅ Quality/trait effect display (enhanced inventory UI showing all effect types)
- ✅ XP scaling feedback (shows raw vs scaled XP in activity completion)
- ✅ Development utilities (content generator, validator, duplicate checker, XP tester)
- ✅ Content generator and validator AI agents (.claude/agents/)
- ✅ Real-time chat system with Socket.io (global chat room, message persistence, rate limiting)
- ✅ Chat UI with collapsible window, command system, and autocomplete
- ✅ Chat commands (/help, /online, /clear) with keyboard navigation
- ✅ Icon organization system (220+ icons organized into 6 categories)
- ✅ Item icon paths (all items include iconPath field for visual display)
- ✅ Gold sync system (auth service as single source of truth, automatic sync via Angular effects)
- ✅ Item sorting by quality/trait scores (descending order by total tier levels)
- ✅ Drag-and-drop selling to vendors (drag items from inventory to vendor sell tab)
- ✅ Active crafting ingredient display (shows items being used with quality/trait badges)
- ✅ Rich crafting completion log (timestamp, output with modifiers, XP gained)
- ✅ ItemMiniComponent for standardized item display (reusable across all game views)
- ✅ Vendor name and greeting display in location UI
- ✅ Multiple vendors per facility (vendorIds array support)
- ✅ Cooking/Crafting system (4 cooking recipes, quality inheritance with skill bonus)
- ✅ Recipe-based crafting (JSON recipe definitions with ingredients, outputs, XP)
- ✅ Time-based crafting with auto-completion (6-12 second durations)
- ✅ Ingredient instance selection (choose specific items by quality/traits)
- ✅ Quality badges (Common, Uncommon, Rare, Epic, Legendary visual indicators)
- ✅ Auto-select best quality feature (one-click optimal ingredient selection)
- ✅ Crafting UI with instance cards, selection validation, and progress display
- ✅ Crafting API endpoints (GET recipes, POST start/complete/cancel)

### Database Models

**User** (Authentication):
- username, email, password (hashed)
- isActive status, lastLogin timestamp

**ChatMessage** (Chat System):
- userId (reference to User)
- username (denormalized for performance)
- message (chat text, max 500 chars)
- channel (default: 'global')
- createdAt (timestamp)
- Static method: `getRecentMessages(channel, limit)` - Retrieve chat history

**Player** (Game Data):
- characterName, level, experience
- stats (health, mana, strength, dexterity, intelligence, vitality)
- attributes (strength, endurance, magic, perception, dexterity, will, charisma) - each with level & experience (1000 XP per level)
- skills (woodcutting, mining, fishing, smithing, cooking, herbalism, oneHanded, dualWield, twoHanded, ranged, casting, gun) - each with level, experience, and mainAttribute
  - Gathering Skills:
    - Woodcutting → Strength
    - Mining → Strength
    - Fishing → Endurance
    - Herbalism → Will
  - Crafting Skills:
    - Smithing → Endurance
    - Cooking → Will
  - Combat Skills:
    - One-Handed → Strength
    - Dual Wield → Dexterity
    - Two-Handed → Strength
    - Ranged → Dexterity
    - Casting → Magic
    - Gun → Perception
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

### API Endpoints Quick Reference

All endpoints except auth register/login require JWT token (protected).

**Auth**: `/api/auth`
- POST `/register` - Create account
- POST `/login` - Login (returns JWT token)
- GET `/me` - Get profile
- POST `/logout` - Logout

**Skills**: `/api/skills` (all protected)
- GET `/` - All player skills with progress
- GET `/:skillName` - Single skill details
- POST `/:skillName/experience` - Add XP (awards 50% to linked attribute)
  - Body: `{ xp }`
  - Returns: `{ skill: {...}, attribute: {...} }`

**Attributes**: `/api/attributes` (all protected)
- GET `/` - All player attributes with progress
- GET `/:attributeName` - Single attribute details
- POST `/:attributeName/experience` - Add XP
  - Body: `{ xp }`

**Inventory**: `/api/inventory` (all protected)
- GET `/` - Full inventory with details
- GET `/items/:instanceId` - Single item
- POST `/items` - Add item - Body: `{ itemId, quantity, qualities?, traits? }`
- POST `/items/random` - Add with random quality/traits - Body: `{ itemId, quantity }`
- DELETE `/items` - Remove item - Body: `{ instanceId, quantity? }`
- GET `/definitions` - All item definitions - Query: `?category=resource|equipment|consumable`
- GET `/definitions/:itemId` - Single definition
- POST `/reload` - Hot-reload definitions (admin)

**Equipment**: `/api/inventory/equipment` (all protected)
- GET `/` - All equipped items + available slots
- POST `/equip` - Equip to slot (auto-unequips current) - Body: `{ instanceId, slotName }`
- POST `/unequip` - Unequip from slot - Body: `{ slotName }`

**Locations**: `/api/locations` (all protected)
- GET `/` - All locations (discovered + undiscovered)
- GET `/:locationId` - Location details
- POST `/discover` - Discover location - Body: `{ locationId }`
- POST `/travel` - Travel to location - Body: `{ targetLocationId }`
- POST `/activity/start` - Start activity - Body: `{ activityId, facilityId }`
- POST `/activity/complete` - Complete activity, claim rewards
- POST `/activity/cancel` - Cancel current activity

**Manual**: `/api/manual` (all protected)
- GET `/skills` - All skill definitions for manual
- GET `/attributes` - All attribute definitions for manual
- GET `/items` - All item definitions for manual
- GET `/locations` - All location/facility/activity data for manual

**Vendors**: `/api/vendors` (all protected)
- GET `/:vendorId` - Get vendor info and stock with item definitions
- POST `/:vendorId/buy` - Buy item from vendor - Body: `{ itemId, quantity }`
- POST `/:vendorId/sell` - Sell item to vendor - Body: `{ instanceId, quantity }`

## Development Quick Rules

### Code Changes:
- ✅ Backend model change → Create migration in `be/migrations/`
- ✅ Item/location definition change → Hot-reload via `/api/inventory/reload` (no restart needed)
- ✅ New dependency → Restart backend/frontend servers
- ✅ Config change → Restart servers
- ✅ .html/.ts change → Skip `ng build` unless major refactor or TypeScript errors expected
- ✅ Use Angular signals for state management
- ✅ Game components go under `ui/src/app/components/game/`

### Authentication:
- ✅ All protected endpoints use JWT middleware
- ✅ Token in localStorage: `clearskies_token`
- ✅ `req.user._id` for user ID (NOT `req.user.userId`)
- ✅ Auth middleware attaches full User document to `req.user`
- ❌ If API auth issues, ask user for bearer token from browser Network tab

### File Operations:
- ✅ Use Edit tool first (faster than bash)
- ✅ Retry Edit once if "unexpectedly modified" error
- ✅ Fall back to bash only if Edit fails twice
- ✅ Read with offset/limit for large files
- ✅ Batch related changes in one message

### Item System:
- ✅ Definitions in `be/data/items/definitions/`
- ✅ Use ItemService for all operations
- ✅ Quality levels: 1-5 (discrete integers)
- ✅ Trait levels: 1-3 (stored as Map<traitId, level>)
- ✅ Items stack if same itemId + quality levels + trait levels
- ✅ Equipment items need `slot` field
- ✅ Hot-reload: POST `/api/inventory/reload`

### Location System:
- ✅ Definitions in `be/data/locations/`
- ✅ Use LocationService for all operations
- ✅ Structure: locations → facilities → activities → drop tables
- ✅ Activities can require: skills, equipped items (by subtype), inventory items
- ✅ XP scaling: polynomial decay based on level difference
- ✅ Time-based completion (tracked server-side)

### Mongoose Maps (CRITICAL):
- ❌ `Object.entries(map)` returns EMPTY on Mongoose Maps
- ✅ Always convert: `Object.fromEntries(map)` after `.toObject()`
- ✅ Pattern in Common Code Patterns section above
- ❌ Don't reference items after `player.addItem()` (circular refs)

### Assets & Styling:
- ✅ Icons in `ui/src/assets/` (222+ SVG icons)
- ✅ Medieval fantasy theme (dark blues, purples, gold)
- ✅ Design tokens: `ui/src/design-tokens.scss`

### Testing:
- ✅ Backend: Check API responses
- ✅ Frontend: Visual check in browser (:3000/:4200)
- ✅ Skip builds unless TypeScript errors expected

### Content Creation:
- ✅ New items/activities → Use Content Generator agent
- ✅ Validation → Use Content Validator agent
- ✅ Don't manually create JSON for game content (use agents)

### Documentation:
- ✅ Update CLAUDE.md when architecture changes
- ✅ Add docs to `project/docs/` for new systems

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
6. `006-add-herbalism-skill.js` - Adds herbalism gathering skill to all players (linked to Will attribute)

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
- `/checkpoint` - Run logical-commits + context-update in one automated workflow

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
   - 30 items total:
     - 15 resources:
       - Logs: oak_log, willow_log, maple_log
       - Ore: copper_ore, iron_ore, silver_ore
       - Fish: trout, salmon, pike, shrimp
       - Herbs: chamomile, sage, nettle, mandrake_root, moonpetal, dragons_breath
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

## Icon System

The icon system provides multi-channel SVG colorization for visual distinction between material tiers (copper vs iron vs steel, etc.):

**Architecture:**
- **IconService** ([ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts)): Fetches SVGs via HttpClient, parses with DOMParser, injects CSS styles
- **IconComponent** ([ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts)): Renders colorized SVGs using innerHTML with async pipe
- **Material Colors** ([ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts)): 40+ materials with multi-channel color definitions
- **ItemIcon interface**: `{ path: string, material: string }` stored in item definitions

**Color Channels:**
Each material defines up to 6 color channels for different icon parts:
- `primary`: Main color (always used, fallback for all paths)
- `secondary`: Secondary accent color
- `handle`: Handle/grip color (for tools/weapons)
- `blade`: Blade/head color (for tools/weapons)
- `edge`: Edge/detail color (for highlights)
- `detail`: Fine detail color (for ornaments)

**Example - Bronze Axe:**
```typescript
bronze: {
  primary: '#CD853F',   // Bronze gold
  handle: '#6B4423',    // Dark brown handle
  blade: '#CD853F',     // Bronze blade body
  edge: '#DAA520',      // Goldenrod edge
  detail: '#A0826D'     // Tan detail
}
```

**SVG Channel Metadata:**
Icons use `data-channel` attributes to tag paths explicitly:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M0 0h512v512H0z" />
  <path fill="#fff" data-channel="handle" d="..." />
  <path fill="#fff" data-channel="blade" d="..." />
  <path fill="#fff" data-channel="edge" d="..." />
</svg>
```

**How It Works:**
1. IconComponent receives `icon: { path: "item_cat_axe_SPLIT.svg", material: "bronze" }`
2. IconService fetches SVG via HTTP and caches result
3. DOMParser parses SVG, reads `data-channel` attributes from paths
4. Service generates CSS rules: `.icon-channel-handle { fill: #6B4423; }`
5. Injects `<style>` block into SVG with color rules
6. Returns SafeHtml for innerHTML binding
7. Result: Bronze axe with brown handle, bronze blade, and golden edge!

**Key Features:**
- ✅ Metadata-driven (data-channel attributes, not path order)
- ✅ Self-documenting (SVG files clearly show channel assignments)
- ✅ Order-independent (can reorder paths without breaking)
- ✅ Flexible (different icons can use different channel sets)
- ✅ Graceful fallback (paths without attributes use primary color)
- ✅ Performance (HTTP caching + in-memory cache)

**Usage in Item Definitions:**
```json
{
  "itemId": "bronze_woodcutting_axe",
  "name": "Bronze Woodcutting Axe",
  "icon": {
    "path": "item-categories/item_cat_axe_SPLIT.svg",
    "material": "bronze"
  }
}
```

**Integration:**
- IconComponent used in ItemMiniComponent for standardized display
- Integrated throughout UI: inventory grid, location lists, crafting, vendor
- Default size: 40px (inventory), 24px (mini), configurable via `[size]` input
- Colorization enabled by default, can disable with `[disableColor]="true"`

## XP System

The XP system uses a three-tier architecture with skills, attributes, and intelligent scaling to encourage content progression:

### 1. **Skills & Attributes**

**Skills** (6 gathering/crafting skills):
- woodcutting → Strength attribute
- mining → Strength attribute
- fishing → Endurance attribute
- smithing → Endurance attribute
- cooking → Will attribute
- herbalism → Will attribute

**Attributes** (7 total):
- strength, endurance, magic, perception, dexterity, will, charisma

**Leveling:**
- 1000 XP per level for both skills and attributes
- Level formula: `Math.floor(xp / 1000) + 1`
- Example: 2500 XP = Level 3

### 2. **XP Linking (Skills → Attributes)**

When a skill gains XP, **50% of that XP is automatically awarded to its linked attribute**:

```javascript
// Player completes woodcutting activity → earns 100 XP
// Woodcutting skill gains 100 XP
// Strength attribute gains 50 XP (50% of 100)
```

**Implementation:**
- `Player.addSkillExperience(skillName, xp)` - Awards skill XP and 50% to linked attribute
- Returns results for both skill and attribute level-ups

### 3. **XP Scaling System (Diminishing Returns)**

Activities award "raw XP" which is scaled based on the player's skill level vs the activity's level requirement. This prevents low-level activity farming and encourages progression to higher-level content.

**Scaling Formula:**
```javascript
calculateScaledXP(rawXP, playerLevel, activityLevel) {
  const levelDiff = playerLevel - activityLevel;

  // Grace range: 0-1 levels over = full XP
  if (levelDiff <= 1) {
    return rawXP;
  }

  // Polynomial decay: 1 / (1 + 0.3 * (diff - 1))
  const effectiveDiff = levelDiff - 1;
  const scalingFactor = 1 / (1 + 0.3 * effectiveDiff);

  // Apply floor of 1 XP
  return Math.max(1, Math.floor(rawXP * scalingFactor));
}
```

**Example Scaling** (Mine Iron: L5 requirement, 45 raw XP):

| Player Level | Level Diff | Scaled XP | % of Raw | Notes |
|--------------|------------|-----------|----------|-------|
| L5 | 0 | 45 XP | 100% | At-level |
| L6 | +1 | 45 XP | 100% | Grace range |
| L7 | +2 | 34 XP | 75% | Starts scaling |
| L10 | +5 | 20 XP | 44% | Half effectiveness |
| L15 | +10 | 12 XP | 26% | Very low |
| L25 | +20 | 6 XP | 13% | Minimum effective |

**Key Properties:**
- **Grace Range**: 0-1 levels over = full XP (forgiving for near-level content)
- **Polynomial Curve**: Smoother than linear, gentler than exponential
- **Minimum Floor**: Always awards at least 1 XP (symbolic reward)
- **Intuitive**: Players can estimate "about 75% at +2 levels, 50% at +5 levels"
- **Predictable**: Same formula applies consistently everywhere

**Implementation:**
- `LocationService.calculateScaledXP(rawXP, playerLevel, activityLevel)` - Scaling logic
- `LocationService.calculateActivityRewards(activity, { player })` - Applies scaling automatically
- Activity's skill requirement used as activity level reference
- Both raw and scaled XP returned in API responses for UI display

**UI Display:**
- Activity completion log shows: "woodcutting: 30 XP → 23 XP" (when scaled)
- Or simply: "woodcutting: +30 XP" (when at-level/in grace range)
- Clear feedback helps players understand the system

**Testing:**
- Test script available: `be/utils/test-xp-scaling.js`
- Verifies formula behavior across level ranges
- Confirms minimum floor is enforced

### 4. **How Players Earn XP**

**Activities** (Primary XP Source):
- Activities award skill XP when completed (time-based)
- XP values defined in activity JSON files
- Scaled automatically based on player level
- Attribute XP calculated from scaled value (50% passthrough)

**Example Flow:**
1. Player starts "Mine Iron" activity (45 raw mining XP)
2. Player is level 7, activity requires level 5 (+2 difference)
3. Scaled XP: 45 × 77% = 34 XP
4. Mining skill gains 34 XP
5. Strength attribute gains 17 XP (50% of 34)

### 5. **API Endpoints**

**Skills:**
- `POST /api/skills/:skillName/experience` - Add XP to skill, returns both skill and attribute results

**Attributes:**
- `POST /api/attributes/:attributeName/experience` - Add XP to attribute

**Activities:**
- Activity completion automatically awards scaled XP via `POST /api/locations/activities/complete`
- Response includes both `experience` (scaled) and `rawExperience` (original) values

### 6. **Balance Notes**

- **1000 XP per level**: Consistent progression across skills and attributes
- **50% XP flow**: Ensures attributes level slower than skills (as intended)
- **Activity XP ranges**: 20-50 XP per completion (raw values)
- **Activity durations**: 5-50 seconds (prevents instant grinding)
- **Grace range**: Allows players to continue activities 1 level below comfortably
- **Scaling curve**: Pushes players to upgrade to higher-level activities without hard forcing

**Design Philosophy:**
The XP scaling system encourages natural progression while respecting player freedom. Players can still farm lower-level content if desired (minimum 1 XP), but they're gently incentivized to seek level-appropriate challenges for maximum efficiency.

## Content Generator Agent

The Content Generator Agent (`.claude/agents/content-generator.md`) is an AI-powered autonomous agent for creating game content. It works in the background while you continue development.

**Purpose:**
- Creates locations, facilities, activities, and drop tables from natural language requests
- Works autonomously while you focus on development
- Comprehensive validation ensures all references exist
- AI-powered suggestions for balance and design

**How to Use:**

Simply describe what content you want in natural language:

```
"Add a mountain mine where players can mine copper ore"

"Create salmon fishing at Kennik dock with level 10 requirement"

"I need a forest clearing with birch logging for level 5 woodcutters"
```

**What It Does:**

The agent autonomously:
1. Reads existing game data for context
2. Validates all item/skill/biome references
3. Creates drop tables with balanced weights
4. Creates activities with appropriate requirements
5. Creates facilities grouping related activities
6. Creates locations with medieval fantasy descriptions
7. Reports back with summary and design decisions

**What It Creates:**
1. **Drop Tables** - Weighted loot pools (validates items exist)
2. **Activities** - Actions with requirements/rewards/XP
3. **Facilities** - Buildings housing activities
4. **Locations** - Areas with facilities and navigation links

**AI-Powered Features:**
- Medieval fantasy description writing
- Balance suggestions (drop rates, XP, requirements)
- Context-aware consistency checking
- Error prevention and validation
- Explains design decisions
- Works without interrupting your development flow

**Example Workflow:**

Traditional: ~27 minutes + context switching
```
1. Research items → 5 min
2. Create drop table JSON → 3 min
3. Validate items → 2 min
4. Create activity JSON → 5 min
5. Create facility JSON → 3 min
6. Create location JSON → 2 min
7. Add navigation → 2 min
8. Test → 5 min
```

With Agent: ~30 seconds of your time
```
You: "Add tuna fishing at deep water dock, level 12 fishing"
Agent: *works autonomously in background*
Agent: "Created tuna fishing with drop table, activity at deep-water-dock..."
You: *continue coding*
```

**Validation:**
- ✓ All item IDs must exist in item definitions
- ✓ Skills validated (woodcutting, mining, fishing, smithing, cooking)
- ✓ Biomes validated (forest, mountain, sea)
- ✓ Drop tables created before activities reference them
- ✓ Balanced weights, XP, durations, requirements
- ✓ Quantity ranges valid (min ≤ max)

**Invoking the Agent:**

When the user asks to create game content, invoke the content generator agent using the Task tool with `subagent_type="general-purpose"` and provide the user's request in the prompt. The agent will handle all validation, file creation, and reporting autonomously.

**Full documentation:** `project/docs/content-generator-agent.md`

## Fast Paths (Zero Exploration Needed)

### I Can Do Instantly (No Search Required):
1. **Add item definition** - You provide itemId + properties, I use template from Common Code Patterns
2. **Add drop table** - You specify items/weights, I create JSON file
3. **Add activity** - You describe activity, I create JSON with requirements/rewards
4. **Create migration** - You describe schema change, I write up/down functions
5. **Add API endpoint** - You specify route + logic, I create route handler
6. **Fix known bug** - You provide file:line reference + change description
7. **Update CLAUDE.md** - Meta improvements to this documentation
8. **Run utility scripts** - Execute scripts in `be/utils/`
9. **Git operations** - Status, add, commit, push (when requested)
10. **Modify JSON data** - Items, locations, activities, drop tables (direct edits)

### I Need Brief Search (<2K tokens):
1. **Find specific function** - Grep by function name
2. **Locate item/activity** - Glob by pattern or Grep by ID
3. **Check if file exists** - Glob verification
4. **Verify API endpoint** - Grep in routes files
5. **Find model method** - Grep in Player.js or User.js

### I Need Deep Exploration (>10K tokens):
1. **"How does X work?"** - Multi-file architectural analysis
2. **"Find all uses of Y"** - Comprehensive codebase search
3. **"Design new system"** - Architecture planning with research
4. **"Debug complex issue"** - Multi-file investigation
5. **"Refactor architecture"** - Understanding dependencies across files

### Optimization Tips:
- ✅ **Frame requests as "Fast Path" tasks when possible** - Saves 5-20K tokens
- ✅ **Provide file:line for known locations** - Enables instant targeted edits
- ✅ **Use Content Generator for game content** - Autonomous background work
- ✅ **Batch similar changes** - One message = multiple items/activities/etc.
- ✅ **Reference previous context** - "In the Player model we read earlier..."
- ❌ **Avoid exploratory questions** - "Show me everything" wastes tokens

### Example Optimal Requests:
```
✅ "Add copper_helmet to be/data/items/definitions/equipment/ with slot: head, tier: 2"
✅ "In Player.js line 280, change equipItem to validate slot compatibility"
✅ "Create 3 herb items: sage, thyme, rosemary as tier-1 resources"
✅ "Use Content Generator: add iron mining to mountain pass, level 10 requirement"

❌ "Explore how the inventory system works"
❌ "Show me all the items in the game"
❌ "How does equipment work?"
```

## Chat System

The chat system provides real-time communication between players using Socket.io for bidirectional messaging.

### Architecture

**Backend** ([be/sockets/chatHandler.js](be/sockets/chatHandler.js)):
- Socket.io server integrated with Express
- JWT authentication middleware for socket connections
- Global chat room ('global') for all players
- Message persistence using ChatMessage model
- Rate limiting (5 messages per 10 seconds per user)
- Online user counting via room socket tracking

**Frontend** ([ui/src/app/services/chat.service.ts](ui/src/app/services/chat.service.ts), [ui/src/app/components/game/chat/](ui/src/app/components/game/chat/)):
- Socket.io client service with Angular signals
- Collapsible fixed-position chat window (bottom-right)
- Auto-connects when user authenticates
- Single-line message format: `timestamp username: message`
- Command system with autocomplete dropdown
- Keyboard navigation (Arrow Up/Down, Tab, Enter, Escape)

### Features

**Socket Events**:
- `chat:sendMessage` - Send message to global chat
- `chat:message` - Receive broadcasted message
- `chat:getHistory` - Load chat history (up to 100 messages)
- `chat:getOnlineCount` - Get number of connected users

**Chat Commands**:
- `/help` - Show available commands
- `/online` - Show online user count
- `/clear` - Clear local chat history (client-side only)

**Command System**:
```typescript
// Command registry pattern for extensibility
interface ChatCommand {
  name: string;
  description: string;
  syntax?: string;
  execute: (args: string[]) => void;
}
```

**Autocomplete**:
- Dropdown appears when typing `/`
- Filters commands in real-time
- Keyboard navigation with visual feedback
- Click or Tab to autocomplete

### Configuration

**Connection**:
```typescript
// Frontend connects to Socket.io server (not /api path)
const baseUrl = environment.apiUrl.replace('/api', '');
const socket = io(baseUrl, { auth: { token } });
```

**Rate Limiting**:
```javascript
// Backend rate limiter
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const RATE_LIMIT_MAX = 5; // 5 messages per window
```

### UI Styling

The chat component uses medieval fantasy theme matching the game design:
- Purple accent colors for interactive elements
- Gold text for usernames
- Dark background with semi-transparency
- Compact single-line message format for efficient space usage
- Custom scrollbar styling

### Security

- JWT authentication required for socket connections
- Username from User model (not player-provided)
- Message length validation (max 500 characters)
- Rate limiting to prevent spam
- XSS protection via Angular's built-in sanitization

## Vendor/NPC Trading System

The vendor system provides NPC merchants at gathering locations for buying tools and selling resources.

### Architecture

**Backend** ([be/services/vendorService.js](be/services/vendorService.js), [be/controllers/vendorController.js](be/controllers/vendorController.js)):
- VendorService: Load vendor definitions, calculate buy/sell prices
- VendorController: Handle buy/sell transactions with gold validation
- API routes at `/api/vendors` with JWT auth
- Vendor definitions in `be/data/vendors/` (JSON files)

**Frontend** ([ui/src/app/services/vendor.service.ts](ui/src/app/services/vendor.service.ts), [ui/src/app/components/game/vendor/](ui/src/app/components/game/vendor/)):
- Socket-free REST API integration
- Signal-based state management
- Buy/Sell tabbed interface with transaction feedback
- Integrated into location component (replaces activity view)

### Features

**Vendor Locations**:
- Fishing Dock → Dockmaster Halvard (bamboo fishing rod)
- Logging Camp → Woodsman Bjorn (bronze woodcutting axe)
- Mountain Mine → Miner Gerta (bronze mining pickaxe)
- Herb Garden → Herbalist Miriam (future herb supplies)
- Market → Alchemist Elara (health potions), Cook Marta (cooked fish)

**Stock System**:
- **Infinite stock**: Vendors never run out (architecture supports limited stock)
- Buy prices fixed per item in vendor definition
- Sell prices: 50% of calculated vendor price (includes quality/trait bonuses)

**Transactions**:
```typescript
// Buy item
POST /api/vendors/:vendorId/buy
Body: { itemId: "bamboo_fishing_rod", quantity: 5 }
Response: { gold, inventory, transaction }

// Sell item
POST /api/vendors/:vendorId/sell
Body: { instanceId: "uuid-123", quantity: 10 }
Response: { gold, inventory, transaction }
```

**UI Features**:
- Buy tab: Stock list with buy 1/5/10 buttons
- Sell tab: Inventory list with sell 1/5/10/all buttons (sorted by quality/trait scores)
- Gold display at top (synced with auth service)
- Vendor name and greeting displayed in location UI
- Success/error message feedback
- Medieval fantasy theme (purple/gold colors)
- Item sorting by total quality+trait tier levels (descending)

### Configuration

**Vendor Definition** (`be/data/vendors/{vendorId}.json`):
```json
{
  "vendorId": "kennik-dock-merchant",
  "name": "Dockmaster Halvard",
  "description": "A weathered fisherman...",
  "greeting": "Looking for fishing gear?",
  "iconPath": "assets/icons/ui/merchant.svg",
  "acceptsAllItems": true,
  "sellPriceMultiplier": 0.5,
  "stock": [
    {
      "itemId": "bamboo_fishing_rod",
      "buyPrice": 25,
      "stockType": "infinite"
    }
  ]
}
```

**Facility Link** (add `vendorIds` array to facility definition):
```json
{
  "facilityId": "kennik-fishing-dock",
  "vendorIds": ["kennik-dock-merchant"],
  ...
}
```

**Multiple Vendors** (facilities can have multiple vendors):
```json
{
  "facilityId": "kennik-market",
  "vendorIds": ["kennik-potion-seller", "kennik-cook"],
  ...
}
```

### Pricing

**Buy Price**: Fixed in vendor definition (e.g., 25 gold for bamboo rod)

**Sell Price**: Calculated dynamically
```javascript
// Backend calculation
const vendorPrice = itemService.calculateVendorPrice(itemInstance);
// ^ Includes base value + quality bonuses + trait bonuses
const sellPrice = Math.floor(vendorPrice * 0.5); // 50% of vendor price
```

### Security

- JWT authentication required for all vendor endpoints
- Gold validation prevents negative balances
- Inventory validation checks item ownership
- Equipped items cannot be sold (must unequip first)
- Transaction atomicity (gold and inventory updated together)

### Future Enhancements

The architecture supports:
- **Restocking**: Change `stockType: "infinite"` to `"limited"` with restock timers
- **Category filtering**: Set `acceptsAllItems: false` and add `acceptedCategories`
- **Skill-based pricing**: Modify `sellPriceMultiplier` based on charisma/merchant skill
- **Vendor reputation**: Track player-vendor relationship for discounts
- **Special offers**: Time-limited deals, bulk purchase discounts
- **Quest integration**: Vendors offering quests or accepting quest items

## Cooking/Crafting System

The crafting system enables players to create items from ingredients with quality inheritance and instance selection.

### Architecture

**Backend** ([be/services/recipeService.js](be/services/recipeService.js), [be/controllers/craftingController.js](be/controllers/craftingController.js)):
- RecipeService: Load recipe definitions, validate requirements, calculate quality outcomes
- CraftingController: Handle start/complete/cancel crafting with time-based progression
- API routes at `/api/crafting` with JWT auth
- Recipe definitions in `be/data/recipes/{skill}/` (JSON files)
- Player.activeCrafting field stores current crafting state with selected ingredients

**Frontend** ([ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts), [ui/src/app/services/recipe.service.ts](ui/src/app/services/recipe.service.ts), [ui/src/app/components/game/crafting/](ui/src/app/components/game/crafting/)):
- CraftingService: Timer management, auto-completion, inventory refresh
- RecipeService: Recipe loading, client-side validation
- CraftingComponent: Recipe browser, ingredient instance selection, quality display
- Integrated into location component (shown for crafting facilities)

### Features

**Crafting Skills**:
- Cooking (kennik-kitchen facility) - Cook raw fish/meat into consumables
- Smithing (future) - Craft equipment from ore and materials
- Alchemy (future) - Brew potions from herbs

**Cooking Recipes** (Level 1-10):
- Cook Shrimp (L1, 6s, 25 XP) - shrimp → cooked_shrimp
- Cook Trout (L1, 8s, 20 XP) - trout → cooked_trout
- Cook Salmon (L5, 10s, 35 XP) - salmon → cooked_salmon
- Cook Cod (L10, 12s, 45 XP) - cod → cooked_cod

**Quality Inheritance System**:
```javascript
// Max quality from ingredients + skill bonus
const maxQuality = Math.max(...ingredientQualities);
const skillBonus = Math.min(2, Math.floor(playerSkillLevel / 10));
const outputQuality = Math.min(5, maxQuality + skillBonus);
```

**Key Features**:
- **Instance Selection**: Choose specific item instances to craft with (select high-quality, sell low-quality)
- **Quality Badges**: Visual indicators (Common, Uncommon, Rare, Epic, Legendary)
- **Auto-select Best**: One-click to select highest quality ingredients
- **Time-based Crafting**: Activities take time to complete (6-12 seconds per craft)
- **Auto-completion**: Timer triggers completion automatically when done
- **Quality Display**: Shows qualities and traits for each instance
- **Selection Validation**: Ensures correct quantity selected before starting

### Transactions

```typescript
// Start crafting with selected instances
POST /api/crafting/start
Body: {
  recipeId: "cook-shrimp",
  selectedIngredients: {
    "shrimp": ["instance-uuid-1"]  // Specific instance IDs
  }
}
Response: { activeCrafting: { recipeId, startTime, endTime } }

// Complete crafting (consumes ingredients, creates output)
POST /api/crafting/complete
Response: {
  recipe: { recipeId, name },
  output: { itemId, quantity, qualities, traits },
  experience: { skill, xp, newLevel }
}

// Cancel active crafting
POST /api/crafting/cancel
```

### UI Experience

**Recipe Browser**:
- Shows all recipes for current skill (cooking, smithing, etc.)
- Color-coded borders: green (can craft), gray (cannot craft)
- Displays level requirement, duration, XP reward
- Shows ingredient availability (X/Y format)

**Recipe Details View**:
1. Ingredient Groups (one per ingredient type)
   - Selection counter: "Selected: 1 / 1"
   - Instance cards showing quantity, quality badge, traits
   - Click to select/deselect instances
   - Visual feedback: purple border (selected), gold (fully selected)

2. Action Buttons
   - **Auto-select Best**: Automatically selects highest quality instances
   - **Clear Selection**: Deselect all ingredients
   - **Start Crafting**: Begins time-based crafting process

3. Active Crafting Display
   - Progress bar with time remaining
   - Cancel button to abort crafting
   - Auto-completion when timer reaches zero

4. Result Display
   - Shows crafted item name
   - Displays XP gained
   - Auto-refreshes inventory

### Configuration

**Recipe Definition** (`be/data/recipes/cooking/{recipe-id}.json`):
```json
{
  "recipeId": "cook-shrimp",
  "name": "Cook Shrimp",
  "description": "Sauté plump shrimp in garlic and oil...",
  "skill": "cooking",
  "requiredLevel": 1,
  "duration": 6,
  "ingredients": [
    { "itemId": "shrimp", "quantity": 1 }
  ],
  "output": {
    "itemId": "cooked_shrimp",
    "quantity": 1,
    "qualityModifier": "inherit"
  },
  "experience": 25
}
```

**Crafting Facility** (`be/data/locations/facilities/{facility-id}.json`):
```json
{
  "facilityId": "kennik-kitchen",
  "name": "Kitchen",
  "description": "A well-equipped cooking area...",
  "type": "crafting",
  "craftingSkills": ["cooking"]
}
```

### Quality System

**Skill Bonus Formula**:
- Every 10 skill levels = +1 quality level bonus (max +2)
- L1-9: +0 quality, L10-19: +1 quality, L20+: +2 quality
- Applied to primary quality type (e.g., freshness for cooked fish)

**Example Quality Calculation**:
```
Input: Shrimp with freshness: 3
Player: Cooking L15 (skill bonus = +1)
Output: Cooked shrimp with freshness: 4 (3 + 1)
```

**Quality Tier Badges**:
- Common: Avg quality < 1.5 (gray)
- Uncommon: Avg quality 1.5-2.5 (green)
- Rare: Avg quality 2.5-3.5 (blue)
- Epic: Avg quality 3.5-4.5 (purple)
- Legendary: Avg quality ≥ 4.5 (orange)

### Database Schema

**Player.activeCrafting**:
```javascript
activeCrafting: {
  recipeId: String,
  startTime: Date,
  endTime: Date,
  selectedIngredients: Map<String, [String]>  // itemId -> instanceId[]
}
```

### Security

- JWT authentication required for all crafting endpoints
- Validates recipe requirements (skill level, ingredients)
- Verifies selected instances exist and are available
- Prevents crafting with equipped items
- Transaction atomicity (ingredients consumed, output added together)

### Future Enhancements

The architecture supports:
- **Smithing**: Equipment crafting with ore, wood, leather
- **Alchemy**: Potion brewing with herbs and quality-based effects
- **Bulk Crafting**: Queue multiple crafts of the same recipe
- **Crafting Speed**: Bonuses from equipment or attributes
- **Critical Success**: Chance for bonus output or quality
- **Failure Chance**: Risk of losing ingredients (at higher tiers)

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
