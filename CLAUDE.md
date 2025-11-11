# ClearSkies - Medieval Fantasy Browser Game

## Current Development Focus

**Active Features**:
- ✅ Herbalism system (completed - 6 herbs, 4 gathering locations)
- ✅ Combat skills framework (completed - 6 combat skills added)
- ✅ Turn-based combat system (completed - monsters, abilities, combat activities)
- ✅ Manual/help system (completed - full game guide with 6 sections)
- ✅ Quality/trait effect display (completed - enhanced inventory UI)
- ✅ XP scaling display (completed - shows raw vs scaled XP)
- ✅ Real-time chat system (completed - Socket.io with commands and autocomplete)
- ✅ Icon organization (completed - 220+ icons organized into 6 categories)
- ✅ Vendor/NPC trading system (completed - buy/sell at gathering locations)
- ✅ Cooking/Crafting system (completed - quality inheritance, instance selection)
- ✅ Multi-channel icon colorization (completed - path-level SVG colorization with 40+ materials)
- ✅ Item system reorganization (completed - category subdirectories for scalability)
- ✅ 5-level quality system with 3-level trait system (completed - quality expanded to 5 levels)
- ✅ Smithing foundation (completed - ore smelting, ingot crafting, Village Forge)

**Recent Changes** (Last 7 commits):
- feat: expand material color system for combat items
- refactor: enhance inventory and UI components
- feat: add combat content and activities
- feat: add combat UI implementation
- feat: add combat system foundation
- feat: add quality level damping system
- feat: implement probabilistic item generation system

**Known Issues**:
- None currently identified

**Next Priorities**:
- Combat system enhancements (more monsters, abilities, boss fights)
- Smithing system completion (weapon/armor crafting with tier progression)
- Alchemy system (potion brewing with quality-based effects)
- Vendor enhancements (restocking, skill-based pricing)
- Player housing
- Guild/party system

> **Maintenance Note**: Update this section regularly so AI has context without needing to explore

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing

## Quick Task Guide

**Add items to player:** `cd be && node utils/add-item.js` (edit itemId on line 28)
**Create content:** Use Content Generator agent - describe what you want in natural language
**Add recipe:** Template in Common Code Patterns → `be/data/recipes/{skill}/{recipe-id}.json`
**Fix backend bug:** Check Critical Code Locations section for file:line references
**Restart servers:** Backend (:3000), Frontend (:4200) - check if already running first!
**Make migration:** Template in Database Migrations section → `be/migrations/NNN-description.js`
**Hot-reload items:** POST `/api/inventory/reload` (no restart needed)
**API endpoints:** See route files in `be/routes/` - all require JWT except auth register/login

## Quick File Reference

### Frequently Modified Files

**Backend Core:**
- Controllers: [be/controllers/inventoryController.js](be/controllers/inventoryController.js), [be/controllers/locationController.js](be/controllers/locationController.js), [be/controllers/skillsController.js](be/controllers/skillsController.js), [be/controllers/attributesController.js](be/controllers/attributesController.js), [be/controllers/authController.js](be/controllers/authController.js), [be/controllers/manualController.js](be/controllers/manualController.js), [be/controllers/vendorController.js](be/controllers/vendorController.js), [be/controllers/craftingController.js](be/controllers/craftingController.js), [be/controllers/combatController.js](be/controllers/combatController.js)
- Models: [be/models/Player.js](be/models/Player.js), [be/models/User.js](be/models/User.js), [be/models/ChatMessage.js](be/models/ChatMessage.js)
- Services: [be/services/itemService.js](be/services/itemService.js), [be/services/locationService.js](be/services/locationService.js), [be/services/dropTableService.js](be/services/dropTableService.js), [be/services/vendorService.js](be/services/vendorService.js), [be/services/recipeService.js](be/services/recipeService.js), [be/services/combatService.js](be/services/combatService.js)
- Routes: [be/routes/inventory.js](be/routes/inventory.js), [be/routes/locations.js](be/routes/locations.js), [be/routes/skills.js](be/routes/skills.js), [be/routes/attributes.js](be/routes/attributes.js), [be/routes/auth.js](be/routes/auth.js), [be/routes/manual.js](be/routes/manual.js), [be/routes/vendors.js](be/routes/vendors.js), [be/routes/crafting.js](be/routes/crafting.js), [be/routes/combat.js](be/routes/combat.js)
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
- Combat: [ui/src/app/components/game/combat/combat.component.ts](ui/src/app/components/game/combat/combat.component.ts), [ui/src/app/components/game/combat/combat.component.html](ui/src/app/components/game/combat/combat.component.html)
- Manual: [ui/src/app/components/manual/manual.component.ts](ui/src/app/components/manual/manual.component.ts), [ui/src/app/components/manual/sections/](ui/src/app/components/manual/sections/)
- Shared Components: [ui/src/app/components/shared/item-mini/item-mini.component.ts](ui/src/app/components/shared/item-mini/item-mini.component.ts), [ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts](ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts), [ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts), [ui/src/app/components/shared/xp-mini/xp-mini.component.ts](ui/src/app/components/shared/xp-mini/xp-mini.component.ts)
- Services: [ui/src/app/services/inventory.service.ts](ui/src/app/services/inventory.service.ts), [ui/src/app/services/location.service.ts](ui/src/app/services/location.service.ts), [ui/src/app/services/skills.service.ts](ui/src/app/services/skills.service.ts), [ui/src/app/services/auth.service.ts](ui/src/app/services/auth.service.ts), [ui/src/app/services/manual.service.ts](ui/src/app/services/manual.service.ts), [ui/src/app/services/chat.service.ts](ui/src/app/services/chat.service.ts), [ui/src/app/services/vendor.service.ts](ui/src/app/services/vendor.service.ts), [ui/src/app/services/recipe.service.ts](ui/src/app/services/recipe.service.ts), [ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts), [ui/src/app/services/combat.service.ts](ui/src/app/services/combat.service.ts), [ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts)
- Constants: [ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts)

**Game Data:**
- Item Definitions: [be/data/items/definitions/](be/data/items/definitions/)
- Location Definitions: [be/data/locations/definitions/](be/data/locations/definitions/)
- Activities: [be/data/locations/activities/](be/data/locations/activities/)
- Drop Tables: [be/data/locations/drop-tables/](be/data/locations/drop-tables/)
- Facilities: [be/data/locations/facilities/](be/data/locations/facilities/)
- Vendors: [be/data/vendors/](be/data/vendors/)
- Recipes: [be/data/recipes/](be/data/recipes/)
- Monsters: [be/data/monsters/definitions/](be/data/monsters/definitions/)
- Abilities: [be/data/abilities/definitions/](be/data/abilities/definitions/)

**Utilities:**
- [be/utils/add-item.js](be/utils/add-item.js) - Add items to player inventory
- [be/utils/content-generator.js](be/utils/content-generator.js) - Interactive content creation
- [be/utils/test-xp-scaling.js](be/utils/test-xp-scaling.js) - XP formula testing
- [project/utils/split-svg-paths.js](project/utils/split-svg-paths.js) - Split SVG paths (basic, no normalization)
- [project/utils/split-svg-paths-normalized.js](project/utils/split-svg-paths-normalized.js) - Split SVG paths with coordinate normalization (recommended)

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

```bash
cd be && node utils/add-item.js
```

**How to modify:** Edit line 28 in `be/utils/add-item.js` to change `itemId` and quantity.

**Item examples:** See [be/data/items/](be/data/items/) for full catalog organized by category (consumables, equipment, resources).

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
  "stackable": true,
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

### Content Generator & Validator Agents

**Content Generator** (`.claude/agents/content-generator.md`): Describe what you want in natural language ("Add tuna fishing at dock, level 12"), agent creates drop tables, activities, facilities, locations with validation.

**Content Validator** (`.claude/agents/content-validator.md`): Run "validate all game content" to check references, detect broken links, find unused content.

See [project/docs/content-generator-agent.md](project/docs/content-generator-agent.md) for full documentation.

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

**Core Systems**: Auth/JWT, Player/User models, MongoDB with migrations
**Game Mechanics**: Skills (12), Attributes (7), XP scaling with 50% skill→attribute passthrough
**Inventory**: Items (50+), Quality/Trait (5-tier/3-tier), Stacking, Equipment slots (10)
**World**: Locations, Activities, Drop tables, Travel, Time-based completion
**Combat**: Turn-based combat, Monsters (3), Abilities (6), Combat stats tracking
**Crafting**: Cooking/Smithing, Recipe system, Quality inheritance, Instance selection
**UI**: IconComponent (multi-channel colorization), ItemMiniComponent, Manual/help system
**Social**: Real-time chat (Socket.io), Vendor trading, Gold system

See [project/docs/completed-features.md](project/docs/completed-features.md) for full list.

### Database Models

**User** ([be/models/User.js](be/models/User.js) ~L10-25): Auth (username, email, password hash, isActive)

**ChatMessage** ([be/models/ChatMessage.js](be/models/ChatMessage.js) ~L10-20): Chat history (userId, username, message, channel)

**Player** ([be/models/Player.js](be/models/Player.js) ~L15-135): Game data
- Skills (12): woodcutting, mining, fishing, herbalism, smithing, cooking, oneHanded, dualWield, twoHanded, ranged, casting, gun
- Attributes (7): strength, endurance, magic, perception, dexterity, will, charisma
- Skill-Attribute links: woodcutting/mining→strength, fishing/smithing→endurance, herbalism/cooking→will, oneHanded/twoHanded→strength, dualWield/ranged→dexterity, casting→magic, gun→perception
- Inventory: items with qualities (Map), traits (Map), quantities, equipped flag
- Equipment slots (Map): 10 default slots (head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft)
- Location state: currentLocation, discoveredLocations, activeActivity, travelState
- Combat state: activeCombat (monster instance, turn tracking, cooldowns, combat log), combatStats (defeats, damage, deaths, crits, dodges)
- Gold, questProgress, achievements

**Key Methods:** See [be/models/Player.js](be/models/Player.js) for full list
- Skills/Inventory: `addSkillExperience()` ~L145, `addItem()` ~L200, `equipItem()` ~L280
- Combat: `takeDamage()` ~L610, `heal()` ~L620, `useMana()` ~L628, `isInCombat()` ~L650, `addCombatLog()` ~L655

### API Routes Reference

All endpoints require JWT authentication except `/api/auth/register` and `/api/auth/login`.

**Route Files:**
- Auth: `/api/auth` → [be/routes/auth.js](be/routes/auth.js)
- Skills: `/api/skills` → [be/routes/skills.js](be/routes/skills.js)
- Attributes: `/api/attributes` → [be/routes/attributes.js](be/routes/attributes.js)
- Inventory: `/api/inventory` → [be/routes/inventory.js](be/routes/inventory.js)
- Equipment: `/api/inventory/equipment` → [be/routes/inventory.js](be/routes/inventory.js)
- Locations: `/api/locations` → [be/routes/locations.js](be/routes/locations.js)
- Vendors: `/api/vendors` → [be/routes/vendors.js](be/routes/vendors.js)
- Crafting: `/api/crafting` → [be/routes/crafting.js](be/routes/crafting.js)
- Combat: `/api/combat` → [be/routes/combat.js](be/routes/combat.js)
- Manual: `/api/manual` → [be/routes/manual.js](be/routes/manual.js)

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
7. `007-add-combat-system.js` - Adds combat fields (activeCombat state, combatStats tracking) to all players

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
   - **New Structure**: Organized into category subdirectories
     - `consumables/` - food.json, potions.json
     - `equipment/` - tools.json, weapons.json, armor.json
     - `resources/` - wood.json, ore.json, fish.json, herbs.json, gemstones.json, ingots.json
   - **Recursive Loading**: ItemService automatically loads from all subdirectories
   - 40+ items total (expanded from 30):
     - Resources: logs, ore (copper, tin, iron, silver), fish, herbs, gemstones, ingots (bronze, iron)
     - Equipment: weapons (copper_sword, iron_sword), armor, tools (axes, pickaxes, fishing rods)
     - Consumables: cooked food, potions
   - Define base properties, allowed qualities, traits, equipment slots, and subtypes
   - All items include `icon` field with path and material for multi-channel colorization
   - Equipment items include `subtype` field for activity requirement matching

2. **Quality & Trait Definitions** (JSON files)
   - **Qualities**: woodGrain, moisture, age, purity, sheen (integer levels 1-5)
     - Each level has explicit name, description, and effects
     - Example: woodGrain L1 (Fine Grain, 1.1x) → L5 (Mythical Grain, 1.5x)
     - Example: purity L1 (High Purity, 1.1x) → L5 (Transcendent, 1.5x)
     - Escalating effects: 8-10% per level depending on quality type
   - **Traits**: fragrant, knotted, weathered, pristine, cursed, blessed, masterwork (integer levels 1-3)
     - Stored as Map<traitId, level> instead of array
     - Each level has escalating effects
   - Define effects on vendor pricing, crafting, alchemy, combat
   - 5-level quality system provides granular progression, 3-level traits for special modifiers

3. **Item Instances** (Player inventory in MongoDB)
   - References to base items
   - Quality levels (1-5 integers) and trait levels (1-3 integers)
   - Automatic stacking for items with identical levels
   - Calculated vendor prices based on level modifiers

**Key Features:**
- Items have discrete quality levels (1-5) with descriptive names and escalating bonuses
- Traits stored as Map with levels (1-3) for escalating effects
- Better stacking: items with identical levels stack together
- Easy balancing by editing JSON level definitions (no code changes needed)
- Hot-reload capability without server restart
- **Probabilistic generation**: Most items have 0-1 qualities (config: 35% plain, 45% one quality, 15% two, 5% three+)
- **Selective traits**: Reduced appearance rates (common: 2%, uncommon: 8%, rare: 15%, epic: 30%)
- **Level damping**: Quality levels biased toward L1-L2 (0.6 damping reduces avg by ~0.2 levels)
- Tier-independent quality count with tier-based level distribution
- Configuration via `be/data/items/generation-config.json` for easy balancing
- Category-based organization improves scalability for growing item catalog
- Multi-channel icon colorization with 40+ material definitions
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
   - Equipment items are non-stackable (stackable: false)

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

Multi-channel SVG colorization for visual distinction between material tiers (copper vs iron vs steel).

**Key Files:**
- IconService: [ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts) - HTTP fetch, parsing, CSS injection
- IconComponent: [ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts) - Renders colorized SVGs
- Material Colors: [ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts) - 40+ materials with 6 color channels each

**How It Works:**
- SVG paths tagged with `data-channel` attributes (blade, handle, edge, detail, etc.)
- Material definitions provide colors for each channel (e.g., bronze: handle=#6B4423, blade=#CD853F)
- IconService fetches SVG, generates CSS rules, injects styles, returns SafeHtml
- Result: Same SVG, different colors per material

**Usage in Item Definitions:**
```json
{ "icon": { "path": "item-categories/item_cat_axe_SPLIT.svg", "material": "bronze" } }
```

**SVG Preparation:**
- Split single-path SVGs: `node project/utils/split-svg-paths-normalized.js path/to/icon.svg`
- Add `data-channel` attributes manually to each path
- See [project/docs/svg-path-splitting-process.md](project/docs/svg-path-splitting-process.md)

## XP System

Three-tier architecture: Skills → Attributes with intelligent scaling to encourage progression.

**Key Mechanics:**
- **1000 XP per level** for both skills and attributes
- **50% XP passthrough**: Skill XP automatically awards 50% to linked attribute (e.g., woodcutting → strength)
- **Scaling formula**: `1 / (1 + 0.3 * (playerLevel - activityLevel - 1))` with grace range (0-1 levels = full XP)
- **Minimum floor**: Always awards at least 1 XP

**Scaling Examples** (L5 activity, 45 raw XP):
- L5-6: 45 XP (100%, grace range)
- L7: 34 XP (75%, starts scaling)
- L10: 20 XP (44%)
- L15: 12 XP (26%)

**Key Files:**
- LocationService ~L185-205: [be/services/locationService.js](be/services/locationService.js) - `calculateScaledXP()` formula
- Player ~L145-165: [be/models/Player.js](be/models/Player.js) - `addSkillExperience()` with attribute linking
- Test script: [be/utils/test-xp-scaling.js](be/utils/test-xp-scaling.js)

**Balance:** 20-50 XP per activity, 5-50 second durations, encourages level-appropriate content without hard forcing.

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

NPC merchants at gathering locations for buying tools and selling resources.

**Key Files:**
- VendorService: [be/services/vendorService.js](be/services/vendorService.js) - Load definitions, calculate prices
- VendorController: [be/controllers/vendorController.js](be/controllers/vendorController.js) - Buy/sell transactions
- Vendor Component: [ui/src/app/components/game/vendor/](ui/src/app/components/game/vendor/) - Buy/Sell tabs
- Vendor definitions: [be/data/vendors/](be/data/vendors/)

**Key Features:**
- Infinite stock (architecture supports limited)
- Buy prices: Fixed per item in vendor JSON
- Sell prices: 50% of vendor price (base + quality/trait bonuses)
- Drag-and-drop selling from inventory
- Gold sync via auth service

**Configuration:**
- Vendor JSON: `be/data/vendors/{vendorId}.json` with stock array
- Facility link: Add `vendorIds` array to facility JSON
- Multiple vendors per facility supported

## Cooking/Crafting System

Create items from ingredients with quality inheritance and instance selection.

**Key Files:**
- RecipeService: [be/services/recipeService.js](be/services/recipeService.js) - Load recipes, validate, calculate quality
- CraftingController: [be/controllers/craftingController.js](be/controllers/craftingController.js) - Start/complete/cancel
- Crafting Component: [ui/src/app/components/game/crafting/](ui/src/app/components/game/crafting/) - Recipe browser, instance selection
- Recipe definitions: [be/data/recipes/{skill}/](be/data/recipes/)

**Key Features:**
- **Instance selection**: Choose specific items by quality/traits (Player.activeCrafting.selectedIngredients Map)
- **Quality inheritance**: Max ingredient quality + skill bonus (every 10 levels = +1, max +2)
- **Time-based**: 6-12 second durations with auto-completion
- **Auto-select best**: One-click highest quality ingredient selection
- **Quality badges**: Common, Uncommon, Rare, Epic, Legendary

**Current Skills:**
- Cooking (4 recipes: shrimp/trout/salmon/cod at kennik-kitchen)
- Smithing (future: equipment from ore/wood/leather)
- Alchemy (future: potions from herbs)

**Configuration:**
- Recipe JSON: `be/data/recipes/{skill}/{recipe-id}.json` with ingredients, output, qualityModifier
- Facility: Set `type: "crafting"` and `craftingSkills: ["cooking"]` in facility JSON

## Combat System

Turn-based combat system with monsters, abilities, and stat tracking.

**Key Files:**
- CombatService: [be/services/combatService.js](be/services/combatService.js) - Combat logic, damage calculation, monster AI
- CombatController: [be/controllers/combatController.js](be/controllers/combatController.js) - Start/attack/ability/flee endpoints
- Combat Component: [ui/src/app/components/game/combat/](ui/src/app/components/game/combat/) - Combat UI, health bars, combat log
- Monster definitions: [be/data/monsters/definitions/](be/data/monsters/definitions/)
- Ability definitions: [be/data/abilities/definitions/](be/data/abilities/definitions/)

**Key Features:**
- **Turn-based combat**: Player and monster alternate attacks based on weapon speed
- **Combat abilities**: Weapon-specific special attacks (6 abilities for different weapon types)
- **Damage calculation**: Base damage + skill level + equipment bonuses, with crit/dodge mechanics
- **Monster AI**: Basic attack patterns with ability usage
- **Combat stats**: Track defeats, damage dealt/taken, deaths, critical hits, dodges
- **Combat log**: Color-coded event history with timestamps
- **Loot drops**: Monsters drop items via drop tables on defeat

**Current Content:**
- Monsters: Bandit Thug (L3, one-handed), Forest Wolf (L2, ranged), Goblin Warrior (L4, two-handed)
- Abilities: Heavy Strike, Quick Slash (one-handed), Aimed Shot, Rapid Fire (ranged), Fire Bolt, Ice Shard (casting)
- Combat activities: 3 combat encounters at different locations requiring appropriate weapon skills
- Combat drops: Raw meat, fangs, animal hide, saber tooth + gold and basic equipment

**Combat Flow:**
1. Player starts combat via activity (requires appropriate weapon equipped)
2. Turn-based attacks with weapon speed determining attack intervals
3. Use abilities (cooldown-based) or basic attacks
4. Monster defeated → rewards (XP, loot, gold) → combat ends
5. Player defeated → respawn at location with no penalty

**Configuration:**
- Monster JSON: `be/data/monsters/definitions/{monster-id}.json` with stats, abilities, resistances
- Ability JSON: `be/data/abilities/definitions/{ability-id}.json` with damage, cooldown, mana cost
- Combat activity: Set activity type with combat flag, link to monster via drop table
- Full documentation: [project/docs/combat-system.md](project/docs/combat-system.md)

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
