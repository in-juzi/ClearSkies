# ClearSkies - Medieval Fantasy Browser Game

## Current Development Focus

**Active Features**:
- ✅ Gathering system (completed - 14 herbs, 4 gathering locations, renamed from Herbalism)
- ✅ Alchemy skill system (completed - 6 potion recipes with progressive unlocks)
- ✅ Subcategory-based crafting (completed - recipes can use "any herb" instead of specific items)
- ✅ Recipe unlock system (completed - progressive discovery via crafting achievements)
- ✅ Combat skills framework (completed - 6 combat skills added)
- ✅ Turn-based combat system (completed - 5 monsters, abilities, combat activities)
- ✅ Combat UI components (completed - ability/item buttons, auto-scroll log, restart encounters)
- ✅ Consumable items system (completed - health/mana potions usable in/out of combat)
- ✅ Manual/help system (completed - full game guide with 6 sections)
- ✅ Quality/trait effect display (completed - enhanced inventory UI)
- ✅ XP scaling display (completed - shows raw vs scaled XP)
- ✅ Real-time chat system (completed - Socket.io with commands and autocomplete)
- ✅ Icon organization (completed - 250+ icons organized into 6 categories)
- ✅ Vendor/NPC trading system (completed - buy/sell at gathering locations)
- ✅ Cooking/Crafting system (completed - quality inheritance, instance selection, filters)
- ✅ Multi-channel icon colorization (completed - path-level SVG colorization with 42+ materials)
- ✅ Item system reorganization (completed - category subdirectories for scalability)
- ✅ 5-level quality system with 3-level trait system (completed - quality expanded to 5 levels)
- ✅ Smithing foundation (completed - ore smelting, ingot crafting, Village Forge)
- ✅ TypeScript data layer migration (completed - all game data migrated from JSON to TypeScript registries)
- ✅ Item constants system (completed - type-safe constants for item definitions)
- ✅ Game data validation (completed - comprehensive cross-reference validation script)
- ✅ Goblin Village location (completed - 3 combat encounters with progressive difficulty)
- ✅ Item details panel (completed - enhanced inventory UI with combat stats preview)
- ✅ Bronze/Iron equipment crafting (completed - 8 armor pieces + 6 tools via smithing)
- ✅ Equipment stats summary (completed - total armor/evasion/damage display in equipment panel)
- ✅ Durability system removal (completed - simplified item system by removing unused durability mechanic)
- ✅ Signal-based reactivity (completed - location component uses computed signals for better change detection)
- ✅ Socket.io migration (completed - activities, crafting, and combat migrated from HTTP polling to real-time events)
- ✅ Shared type system (completed - @shared/types package eliminates duplicate type definitions)
- ✅ CATEGORY/SUBCATEGORY constants (completed - type-safe constants for all 90+ item definitions)
- ✅ AWS deployment configuration (completed - S3 static hosting for frontend, EC2 for backend API)

**Recent Changes** (Last 10 commits):
- chore: update production API endpoint to new EC2 instance
- refactor: improve server binding configuration with explicit HOST constant
- docs: update CLAUDE.md with completed deployment configuration
- refactor: migrate frontend services to use environment configuration
- fix: configure production environment and build scripts
- feat: configure backend server to bind to 0.0.0.0 for EC2 deployment
- docs: update CLAUDE.md with AWS deployment architecture
- feat: configure production API endpoint for EC2 backend
- feat: configure CORS for S3 static hosting deployment
- chore: add EC2 SSH key to .gitignore

**Known Issues**:
- None currently identified

**Next Priorities**:
- Equipment stat application (apply armor/damage/evasion bonuses to combat calculations)
- SSL/HTTPS setup with CloudFront CDN for production deployment
- Steel tier equipment (requires steel ingots from iron + coal)
- More alchemy recipes (buff potions, debuff potions, transmutation)
- Combat system enhancements (more monsters, abilities, boss fights)
- Vendor enhancements (restocking, skill-based pricing, buy orders)
- Player housing system
- Guild/party system
- Enchanting/runecarving skill

> **Maintenance Note**: Update this section regularly so AI has context without needing to explore

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing
- **Deployment**: AWS S3 (frontend static hosting) + EC2 (backend API)

## Quick Task Guide

**Add items to player:** `cd be && node utils/add-item.js` (edit itemId on line 28)
**Create content:** Use Content Generator agent - describe what you want in natural language
**Validate game data:** `cd be && npm run validate` - checks all cross-references
**Add recipe:** Create TypeScript module in `be/data/recipes/{skill}/{RecipeId}.ts` and register in RecipeRegistry
**Fix backend bug:** Check Critical Code Locations section for file:line references
**Restart servers:** Backend (:3000), Frontend (:4200) - check if already running first!
**Make migration:** Template in Database Migrations section → `be/migrations/NNN-description.js`
**Hot-reload data:** Restart backend server - data layer now uses TypeScript registries
**API endpoints:** See route files in `be/routes/` - all require JWT except auth register/login

> **IMPORTANT**: **NEVER start backend/frontend servers** - they are always running during development. Only rebuild with `npm run build` if code changes require it. If you need to restart servers, ask the user first.

> **Content Creation Reference**: When creating new game content (monsters, locations, activities, drop tables), refer to [project/docs/content-creation-pitfalls.md](project/docs/content-creation-pitfalls.md) for common pitfalls and solutions.

## Quick File Reference

### Frequently Modified Files

**Backend Core:**
- Controllers: [be/controllers/inventoryController.js](be/controllers/inventoryController.js), [be/controllers/locationController.js](be/controllers/locationController.js), [be/controllers/skillsController.js](be/controllers/skillsController.js), [be/controllers/attributesController.js](be/controllers/attributesController.js), [be/controllers/authController.js](be/controllers/authController.js), [be/controllers/manualController.js](be/controllers/manualController.js), [be/controllers/vendorController.js](be/controllers/vendorController.js), [be/controllers/craftingController.js](be/controllers/craftingController.js), [be/controllers/combatController.js](be/controllers/combatController.js)
- Models: [be/models/Player.js](be/models/Player.js), [be/models/User.js](be/models/User.js), [be/models/ChatMessage.js](be/models/ChatMessage.js)
- Services (TypeScript): [be/services/itemService.ts](be/services/itemService.ts), [be/services/locationService.ts](be/services/locationService.ts), [be/services/dropTableService.ts](be/services/dropTableService.ts), [be/services/vendorService.ts](be/services/vendorService.ts), [be/services/recipeService.ts](be/services/recipeService.ts), [be/services/combatService.ts](be/services/combatService.ts)
- Routes: [be/routes/inventory.js](be/routes/inventory.js), [be/routes/locations.js](be/routes/locations.js), [be/routes/skills.js](be/routes/skills.js), [be/routes/attributes.js](be/routes/attributes.js), [be/routes/auth.js](be/routes/auth.js), [be/routes/manual.js](be/routes/manual.js), [be/routes/vendors.js](be/routes/vendors.js), [be/routes/crafting.js](be/routes/crafting.js), [be/routes/combat.js](be/routes/combat.js)
- Sockets: [be/sockets/chatHandler.js](be/sockets/chatHandler.js), [be/sockets/activityHandler.ts](be/sockets/activityHandler.ts), [be/sockets/craftingHandler.ts](be/sockets/craftingHandler.ts), [be/sockets/combatHandler.ts](be/sockets/combatHandler.ts)

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
- Shared Components: [ui/src/app/components/shared/item-mini/item-mini.component.ts](ui/src/app/components/shared/item-mini/item-mini.component.ts), [ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts](ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts), [ui/src/app/components/shared/item-details-panel/item-details-panel.component.ts](ui/src/app/components/shared/item-details-panel/item-details-panel.component.ts), [ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts), [ui/src/app/components/shared/xp-mini/xp-mini.component.ts](ui/src/app/components/shared/xp-mini/xp-mini.component.ts), [ui/src/app/components/shared/ability-button/ability-button.component.ts](ui/src/app/components/shared/ability-button/ability-button.component.ts), [ui/src/app/components/shared/item-button/item-button.component.ts](ui/src/app/components/shared/item-button/item-button.component.ts)
- Services: [ui/src/app/services/inventory.service.ts](ui/src/app/services/inventory.service.ts), [ui/src/app/services/location.service.ts](ui/src/app/services/location.service.ts), [ui/src/app/services/skills.service.ts](ui/src/app/services/skills.service.ts), [ui/src/app/services/auth.service.ts](ui/src/app/services/auth.service.ts), [ui/src/app/services/manual.service.ts](ui/src/app/services/manual.service.ts), [ui/src/app/services/chat.service.ts](ui/src/app/services/chat.service.ts), [ui/src/app/services/vendor.service.ts](ui/src/app/services/vendor.service.ts), [ui/src/app/services/recipe.service.ts](ui/src/app/services/recipe.service.ts), [ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts), [ui/src/app/services/combat.service.ts](ui/src/app/services/combat.service.ts), [ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts)
- Constants: [ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts)

**Game Data (TypeScript):**
- Shared Types: [shared/types/](shared/types/) - Shared type definitions used by both frontend and backend
- Item Registry: [be/data/items/ItemRegistry.ts](be/data/items/ItemRegistry.ts) - All items in [definitions/](be/data/items/definitions/)
- Item Constants: [be/data/constants/item-constants.ts](be/data/constants/item-constants.ts) - Type-safe CATEGORY, SUBCATEGORY, RARITY, TIER, and more
- Location Registry: [be/data/locations/LocationRegistry.ts](be/data/locations/LocationRegistry.ts) - All locations in [definitions/](be/data/locations/definitions/)
- Activity Registry: [be/data/locations/ActivityRegistry.ts](be/data/locations/ActivityRegistry.ts) - All activities in [activities/](be/data/locations/activities/)
- Drop Table Registry: [be/data/locations/DropTableRegistry.ts](be/data/locations/DropTableRegistry.ts) - All drop tables in [drop-tables/](be/data/locations/drop-tables/)
- Facility Registry: [be/data/locations/FacilityRegistry.ts](be/data/locations/FacilityRegistry.ts) - All facilities in [facilities/](be/data/locations/facilities/)
- Vendor Registry: [be/data/vendors/VendorRegistry.ts](be/data/vendors/VendorRegistry.ts) - All vendors as TypeScript modules
- Recipe Registry: [be/data/recipes/RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts) - All recipes by skill
- Monster Registry: [be/data/monsters/MonsterRegistry.ts](be/data/monsters/MonsterRegistry.ts) - All monsters in [definitions/](be/data/monsters/definitions/)
- Ability Registry: [be/data/abilities/AbilityRegistry.ts](be/data/abilities/AbilityRegistry.ts) - All abilities in [definitions/](be/data/abilities/definitions/)
- Quality Registry: [be/data/items/qualities/QualityRegistry.ts](be/data/items/qualities/QualityRegistry.ts)
- Trait Registry: [be/data/items/traits/TraitRegistry.ts](be/data/items/traits/TraitRegistry.ts)

**Utilities:**
- [be/utils/add-item.js](be/utils/add-item.js) - Add items to player inventory
- [be/utils/content-generator.js](be/utils/content-generator.js) - Interactive content creation
- [be/utils/test-xp-scaling.js](be/utils/test-xp-scaling.js) - XP formula testing
- [be/scripts/validate-game-data.ts](be/scripts/validate-game-data.ts) - Validate cross-references (npm run validate)
- [project/utils/split-svg-paths.js](project/utils/split-svg-paths.js) - Split SVG paths (basic, no normalization)
- [project/utils/split-svg-paths-normalized.js](project/utils/split-svg-paths-normalized.js) - Split SVG paths with coordinate normalization (recommended)
- [update-category-constants.py](update-category-constants.py) - Python script to migrate item definitions to use constants

## Project Structure (Key Files Only)

```
shared/
└── types/           # Shared TypeScript type definitions (Item, Monster, Location, etc.)

be/
├── controllers/     # inventoryController, locationController, skillsController, attributesController, authController
├── models/          # Player.js (inventory, skills, equipment), User.js
├── services/        # itemService, locationService, dropTableService (all use @shared/types)
├── data/
│   ├── constants/   # item-constants.ts (CATEGORY, SUBCATEGORY, RARITY, TIER, etc.)
│   ├── items/definitions/    # Item TypeScript modules (90+ items use constants)
│   └── locations/   # Location, activity, drop table TypeScript modules
├── migrations/      # Database migration scripts
├── types/           # Compatibility layer (re-exports from @shared/types)
└── utils/          # Dev tools (add-item.js, content-generator.js, test-xp-scaling.js)

ui/src/app/
├── components/game/  # inventory/, location/, skills/, equipment/, attributes/
├── services/        # *.service.ts (match backend APIs, use @shared/types)
└── models/         # TypeScript interfaces (import from @shared/types)
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
**File**: `be/data/items/definitions/{category}/{ItemId}.ts`
**Template** (with constants - recommended):
```typescript
import { ResourceItem } from '@shared/types';
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const NewItem: ResourceItem = {
  itemId: 'new_item',
  name: 'New Item',
  description: 'Medieval fantasy description...',
  category: CATEGORY.RESOURCE,
  subcategories: [SUBCATEGORY.ORE],
  rarity: RARITY.COMMON,
  baseValue: 10,
  stackable: true,
  properties: {
    tier: TIER.T1,
    material: MATERIAL.GENERIC
  },
  allowedQualities: QUALITY_SETS.ORE,
  allowedTraits: TRAIT_SETS.EQUIPMENT_PRISTINE,
  icon: {
    path: 'item-categories/icon.svg',
    material: 'generic'
  }
};
```
**Then register in**: `be/data/items/ItemRegistry.ts`

**Item Constants**: See [be/data/constants/item-constants.ts](be/data/constants/item-constants.ts) and [README](be/data/constants/README.md) for all available constants:
- **CATEGORY**: CONSUMABLE, EQUIPMENT, RESOURCE
- **SUBCATEGORY**: 60+ values (HERB, FLOWER, FISH, ORE, INGOT, GEMSTONE, WOOD, WEAPON, ARMOR, TOOL, etc.)
- **SUBCATEGORY_SETS**: Predefined arrays (ALL_HERBS, ALL_FLOWERS, ALL_GEMSTONES, etc.)
- **RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE**

### Adding New Activity
**File**: `be/data/locations/activities/{ActivityId}.ts`
**Template**:
```typescript
import { Activity } from '../../../types';

export const NewActivity: Activity = {
  activityId: 'new-activity',
  name: 'Activity Name',
  description: 'What players do here...',
  duration: 10,
  requirements: {
    skills: { woodcutting: 5 },
    equipped: [{ subtype: 'woodcutting-axe' }]
  },
  rewards: {
    experience: { woodcutting: 25 },
    dropTables: ['drop-table-id']
  }
};
```
**Then register in**: `be/data/locations/ActivityRegistry.ts`

### Adding New Drop Table
**File**: `be/data/locations/drop-tables/{TableId}.ts`
**Template**:
```typescript
import { DropTable } from '../../../types';

export const NewDropTable: DropTable = {
  dropTableId: 'new-drop-table',
  name: 'Drop Table Name',
  drops: [
    {
      itemId: 'oak_log',
      weight: 70,
      quantity: { min: 1, max: 3 }
    },
    {
      itemId: 'rare_item',
      weight: 30,
      quantity: { min: 1, max: 1 },
      qualityBonus: 2
    }
  ]
};
```
**Then register in**: `be/data/locations/DropTableRegistry.ts`

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
- `player.activeCrafting.selectedIngredients` (Map<string, string[]>) - in Player.js schema
- `player.equipmentSlots` (Map<string, string|null>) - in Player.js schema
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
- Checking if file exists - `Glob("**/filename.{js,ts}")`
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

### Item Service (be/services/itemService.ts)
- Item registry loading: Loads from ItemRegistry.ts
- `getItemDefinition()`: Returns typed Item objects
- `createItemInstance()`: Creates typed item instances
- `calculateVendorPrice()`: Price calculation with quality/trait modifiers
- `generateRandomQualities()`: Probabilistic quality generation
- `generateRandomTraits()`: Probabilistic trait generation
- `_sortedMapString()`: Quality/trait comparison helper

### Location Service (be/services/locationService.ts)
- Location/Activity/DropTable registry loading
- `getLocation()`: Returns typed Location objects
- `validateActivityRequirements()`: Validates skills, equipment, inventory
- `calculateScaledXP()`: XP scaling formula with polynomial decay
- `processActivityCompletion()`: Awards XP and loot from drop tables
- `getActivityRewards()`: Processes drop table rewards

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

**Core Systems**: Auth/JWT, Player/User models, MongoDB with migrations, Socket.io real-time communication
**Game Mechanics**: Skills (13), Attributes (7), XP scaling with 50% skill→attribute passthrough
**Inventory**: Items (68+), Quality/Trait (5-tier/3-tier), Stacking, Equipment slots (10), Consumables (potions)
**World**: Locations, Activities (Socket.io), Drop tables, Travel, Server-authoritative timing
**Combat**: Turn-based combat (Socket.io), Monsters (5), Abilities (6), Combat stats tracking, Restart encounters, Real-time events
**Crafting**: Cooking (4 recipes) + Smithing (16 recipes) + Alchemy (6 recipes, Socket.io), Quality inheritance, Instance selection, Recipe filtering, Subcategory ingredients, Recipe unlocks, Auto-restart
**UI**: IconComponent (multi-channel colorization), ItemMiniComponent, AbilityButtonComponent, ItemButtonComponent, Manual/help system
**Social**: Real-time chat (Socket.io), Vendor trading, Gold system
**Architecture**: Full Socket.io migration (activities, crafting, combat) - eliminated HTTP polling, server-authoritative timing, client-driven auto-restart

See [project/docs/completed-features.md](project/docs/completed-features.md) for full list.

### Database Models

**User** ([be/models/User.js](be/models/User.js) ~L10-25): Auth (username, email, password hash, isActive)

**ChatMessage** ([be/models/ChatMessage.js](be/models/ChatMessage.js) ~L10-20): Chat history (userId, username, message, channel)

**Player** ([be/models/Player.js](be/models/Player.js) ~L15-135): Game data
- Skills (13): woodcutting, mining, fishing, gathering (renamed from herbalism), smithing, cooking, alchemy (new), oneHanded, dualWield, twoHanded, ranged, casting, gun
- Attributes (7): strength, endurance, magic, perception, dexterity, will, charisma
- Skill-Attribute links: woodcutting/mining→strength, fishing/smithing→endurance, gathering/cooking/alchemy→will, oneHanded/twoHanded→strength, dualWield/ranged→dexterity, casting→magic, gun→perception
- Inventory: items with qualities (Map), traits (Map), quantities, equipped flag
- Equipment slots (Map): 10 default slots (head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft)
- Location state: currentLocation, discoveredLocations, activeActivity, travelState
- Combat state: activeCombat (monster instance, turn tracking, cooldowns, combat log, activityId), combatStats (defeats, damage, deaths, crits, dodges), lastCombatActivityId
- Character: characterName (optional display name), gold, questProgress, achievements

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
8. `008-rename-herbalism-to-gathering.js` - Renames herbalism skill to gathering (more thematic for barehanded foraging)
9. `009-add-alchemy-skill.js` - Adds alchemy skill to all players (level 1, linked to Will attribute)

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

1. **Item Definitions** (TypeScript modules in `be/data/items/definitions/`)
   - **Registry-Based**: Organized into category subdirectories with centralized ItemRegistry
     - `consumables/` - Individual .ts files for each food item and potion
     - `equipment/` - Individual .ts files for each weapon, armor, and tool
     - `resources/` - Individual .ts files for each resource (wood, ore, fish, herbs, gemstones, ingots)
   - **Type-Safe Loading**: ItemService loads from ItemRegistry.ts with compile-time validation
   - 68+ items total (expanded from 40):
     - Resources: logs, ore (copper, tin, iron, silver), fish, herbs, gemstones, ingots (bronze, iron)
     - Equipment:
       - Weapons: copper_sword, bronze_sword, iron_sword
       - Armor: Bronze tier (helm, plate, gloves, boots), Iron tier (helm, plate, gloves, boots)
       - Tools: Bronze/Iron axes, pickaxes, fishing rods
     - Consumables: cooked food, potions
   - Define base properties, allowed qualities, traits, equipment slots, and subtypes
   - All items include `icon` field with path and material for multi-channel colorization
   - Equipment items include `subtype` field for activity requirement matching

2. **Quality & Trait Definitions** (TypeScript modules)
   - **Qualities**: woodGrain, moisture, age, purity, sheen (integer levels 1-5)
     - QualityRegistry.ts exports all quality definitions
     - Each level has explicit name, description, and effects
     - Example: woodGrain L1 (Fine Grain, 1.1x) → L5 (Mythical Grain, 1.5x)
     - Example: purity L1 (High Purity, 1.1x) → L5 (Transcendent, 1.5x)
     - Escalating effects: 8-10% per level depending on quality type
   - **Traits**: fragrant, knotted, weathered, pristine, cursed, blessed, masterwork (integer levels 1-3)
     - TraitRegistry.ts exports all trait definitions
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
- Easy balancing by editing TypeScript definitions with compile-time validation
- TypeScript registries provide centralized data management
- **Probabilistic generation**: Most items have 0-1 qualities (config: 35% plain, 45% one quality, 15% two, 5% three+)
- **Selective traits**: Reduced appearance rates (common: 2%, uncommon: 8%, rare: 15%, epic: 30%)
- **Level damping**: Quality levels biased toward L1-L2 (0.6 damping reduces avg by ~0.2 levels)
- Tier-independent quality count with tier-based level distribution
- Configuration via `be/data/items/generation-config.json` for easy balancing
- Category-based organization improves scalability for growing item catalog
- Multi-channel icon colorization with 40+ material definitions
- **Alt+Click quick actions**: Drop 1 item (or sell entire stack if vendor open) without confirmation
- Full documentation in `project/docs/inventory-system.md` and `project/docs/level-based-quality-trait-system.md`

## Location System

The location system provides a rich world exploration and activity framework:

1. **Location Definitions** (TypeScript modules in `be/data/locations/definitions/`)
   - LocationRegistry.ts exports all location definitions
   - Define locations with name, description, biome type
   - List of facilities available at each location
   - Travel requirements and discovery conditions
   - Examples: Kennik (starting town), Forest Clearing, Mountain Pass

2. **Biomes** (TypeScript modules in `be/data/locations/biomes/`)
   - BiomeRegistry.ts exports all biome definitions
   - Define environmental types (forest, mountain, sea)
   - Ambient descriptions and characteristics
   - Affect available resources and activities

3. **Facilities** (TypeScript modules in `be/data/locations/facilities/`)
   - FacilityRegistry.ts exports all facility definitions
   - Specific buildings or areas within locations
   - Each facility offers different activities
   - Examples: Market, Fishing Dock, Logging Camp, Mine

4. **Activities** (TypeScript modules in `be/data/locations/activities/`)
   - ActivityRegistry.ts exports all activity definitions
   - Actions players can perform at facilities
   - Requirements: skills, attributes, equipped items (by subtype), inventory items (with quantity)
   - Time-based completion (duration in seconds)
   - Rewards: XP, items via drop tables
   - Examples: Chop Oak (requires woodcutting-axe equipped), Fish Salmon (requires fishing-rod equipped), Mine Iron (requires mining-pickaxe equipped)

5. **Drop Tables** (TypeScript modules in `be/data/locations/drop-tables/`)
   - DropTableRegistry.ts exports all drop table definitions
   - Weighted loot pools for activity rewards
   - Define relative drop rates using weight system
   - Reusable across multiple activities
   - Support for quality bonuses and rare drops
   - Examples: woodcutting-oak, rare-woodcutting, fishing-salmon, rare-fishing

**Key Features:**
- **Real-time Socket.io**: Activity system uses Socket.io for instant completion events (no HTTP polling)
- **Server-authoritative timing**: Activity durations enforced server-side using setTimeout
- **Client-driven auto-restart**: Activities automatically restart on completion (requires active player)
- Players start in Kennik and can discover new locations
- Travel between locations takes time
- Activities award skill XP and items to inventory via drop tables
- Activity completion is time-based (tracked server-side)
- Rich location descriptions and lore through biomes
- Flexible drop table system for easy loot balancing
- Item requirements system for activities (equipped tools and inventory items)
- Easy content expansion by creating new TypeScript modules and registering in registries
- Compile-time validation of all references (itemIds, skillIds, etc.)
- Reconnection support restores in-progress activities
- Full documentation in `project/docs/drop-table-system.md` and `project/docs/item-requirements-system.md`

**Backend Socket Handler:**
- [activityHandler.ts](be/sockets/activityHandler.ts) - Real-time activity events, reward processing
- Events: `activity:start`, `activity:started`, `activity:completed`, `activity:cancelled`, `activity:getStatus`

**Frontend Socket Service:**
- [location.service.ts](ui/src/app/services/location.service.ts) - Activity state management with Socket.io

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
   - Properties include armor, evasion, damage, required level
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
- LocationService: [be/services/locationService.ts](be/services/locationService.ts) - `calculateScaledXP()` formula
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
5. **Find model method** - Grep in Player.js (models still JavaScript)

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

## Socket.io Real-Time Architecture

The game uses Socket.io for real-time bidirectional communication between client and server, replacing HTTP polling for activities, crafting, and combat systems.

### Architecture Overview

**Backend Socket Handlers** ([be/sockets/](be/sockets/)):
- [activityHandler.ts](be/sockets/activityHandler.ts) - Activity system (gathering, combat encounters)
- [craftingHandler.ts](be/sockets/craftingHandler.ts) - Crafting system (recipes, quality inheritance)
- [combatHandler.ts](be/sockets/combatHandler.ts) - Combat system (turn-based combat, abilities)
- [chatHandler.js](be/sockets/chatHandler.js) - Chat system (global chat, commands)
- JWT authentication middleware for all socket connections
- Server-authoritative timing using setTimeout for action completion

**Frontend Socket Services** ([ui/src/app/services/](ui/src/app/services/)):
- [location.service.ts](ui/src/app/services/location.service.ts) - Activity state management
- [crafting.service.ts](ui/src/app/services/crafting.service.ts) - Crafting state management
- [combat.service.ts](ui/src/app/services/combat.service.ts) - Combat state management
- [chat.service.ts](ui/src/app/services/chat.service.ts) - Chat state management
- [socket.service.ts](ui/src/app/services/socket.service.ts) - Base Socket.io client wrapper
- Angular signals for reactive state updates
- Effect hooks for setting up listeners when connected
- Auto-reconnection and status restoration

### Key Features

**Server-Authoritative Timing:**
- Backend controls when actions complete using setTimeout
- Prevents client-side manipulation of completion times
- Activity durations, crafting times, and combat turn timings enforced server-side

**Client-Driven Auto-Restart:**
- Frontend stores last action parameters (e.g., lastRecipeId, lastActivityId)
- Automatically restarts completed actions without user input
- Prevents AFK grinding: player must be active at completion to restart
- Can be disabled for cancelled or error states

**Activity Overwriting:**
- Starting a new activity automatically cancels the current one
- Starting a new crafting automatically cancels the current one
- Starting travel automatically cancels the current activity
- No blocking errors - actions seamlessly overwrite each other
- Only combat blocks travel (cannot flee via travel action)

**Real-Time State Updates:**
- Socket events broadcast state changes instantly
- No HTTP polling overhead (previously 500ms-1s intervals)
- Player actions immediately visible without page refresh
- Combat turns, crafting progress, activity completion all real-time

**Reconnection Handling:**
- Status check events restore state after disconnect/reload
- `activity:getStatus`, `crafting:getStatus`, `combat:getStatus`
- Progress timers resume from server timestamps
- No lost progress on temporary disconnections

### Socket Event Patterns

**Activity System Events:**
- `activity:start` - Start gathering/combat activity
- `activity:started` - Server confirms activity started
- `activity:completed` - Activity finished, rewards awarded
- `activity:cancelled` - Activity cancelled by player
- `activity:getStatus` - Reconnection status check

**Crafting System Events:**
- `crafting:start` - Start crafting recipe
- `crafting:started` - Server confirms crafting started
- `crafting:completed` - Crafting finished, item created
- `crafting:cancelled` - Crafting cancelled by player
- `crafting:error` - Insufficient materials or other error
- `crafting:getStatus` - Reconnection status check

**Combat System Events:**
- `combat:attack` - Player basic attack
- `combat:playerAttack` - Server broadcasts player attack result
- `combat:monsterAttack` - Server broadcasts monster attack
- `combat:useAbility` - Player uses combat ability
- `combat:abilityUsed` - Server broadcasts ability result
- `combat:useItem` - Player uses consumable item
- `combat:itemUsed` - Server broadcasts item use result
- `combat:victory` - Combat won, rewards awarded
- `combat:defeat` - Combat lost, player respawns
- `combat:fled` - Player fled from combat
- `combat:getStatus` - Reconnection status check

**Chat System Events:**
- `chat:sendMessage` - Send message to global chat
- `chat:message` - Receive broadcasted message
- `chat:getHistory` - Load chat history
- `chat:getOnlineCount` - Get online player count

### Frontend Service Pattern

All Socket.io services follow a consistent pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private socketService = inject(SocketService);

  // Signals for reactive state
  activeState = signal<State | null>(null);
  isActive = signal<boolean>(false);

  // Observables for events
  completed$ = new Subject<Result>();
  error$ = new Subject<Error>();

  // Store for auto-restart
  private lastActionParams: any = null;

  constructor() {
    // Setup listeners when connected
    effect(() => {
      if (this.socketService.isConnected()) {
        this.setupSocketListeners();
      }
    });
  }

  private setupSocketListeners(): void {
    this.socketService.on('event:started', (data) => {
      // Update signals
    });

    this.socketService.on('event:completed', (data) => {
      // Handle completion, emit event, auto-restart
      this.completed$.next(result);
      if (this.lastActionParams) {
        this.startAction(this.lastActionParams);
      }
    });
  }

  async startAction(params: any): Promise<any> {
    this.lastActionParams = params; // Store for auto-restart
    return await this.socketService.emit('event:start', params);
  }

  ngOnDestroy(): void {
    // Clean up listeners
    this.socketService.off('event:started');
    this.socketService.off('event:completed');
  }
}
```

### Migration from HTTP Polling

**Before (HTTP Polling):**
- Location/Activity: 1-second polling interval in locationController
- Crafting: HTTP endpoint with manual status checks
- Combat: 500ms polling for real-time combat feel
- High server load, network overhead, delayed updates

**After (Socket.io):**
- All systems use real-time socket events
- Zero polling overhead
- Instant state updates
- Server-authoritative timing prevents exploits
- Client-driven auto-restart prevents AFK grinding
- Reconnection support for seamless experience

### Benefits

- **Performance**: Eliminated 1000+ HTTP requests per minute during active gameplay
- **Responsiveness**: Instant feedback on all player actions
- **Scalability**: Reduced server CPU and network usage
- **User Experience**: Smooth real-time gameplay without polling delays
- **Security**: Server-authoritative timing prevents client manipulation
- **Anti-AFK**: Client-driven restart requires active player presence

## Vendor/NPC Trading System

NPC merchants at gathering locations for buying tools and selling resources.

**Key Files:**
- VendorService: [be/services/vendorService.ts](be/services/vendorService.ts) - Load from VendorRegistry, calculate prices
- VendorController: [be/controllers/vendorController.js](be/controllers/vendorController.js) - Buy/sell transactions
- Vendor Component: [ui/src/app/components/game/vendor/](ui/src/app/components/game/vendor/) - Buy/Sell tabs
- Vendor Registry: [be/data/vendors/VendorRegistry.ts](be/data/vendors/VendorRegistry.ts) - TypeScript vendor definitions

**Key Features:**
- Infinite stock (architecture supports limited)
- Buy prices: Fixed per item in vendor JSON
- Sell prices: 50% of vendor price (base + quality/trait bonuses)
- Drag-and-drop selling from inventory
- Gold sync via auth service

**Configuration:**
- Vendor TypeScript: Create module in `be/data/vendors/{VendorId}.ts` and register in VendorRegistry
- Facility link: Add `vendorIds` array to facility TypeScript definition
- Multiple vendors per facility supported

## Cooking/Crafting System

Create items from ingredients with quality inheritance and instance selection.

**Key Files:**
- RecipeService: [be/services/recipeService.ts](be/services/recipeService.ts) - Load from RecipeRegistry, validate, calculate quality
- CraftingHandler: [be/sockets/craftingHandler.ts](be/sockets/craftingHandler.ts) - Socket.io real-time crafting (replaces HTTP polling)
- CraftingController: [be/controllers/craftingController.js](be/controllers/craftingController.js) - Legacy HTTP endpoints (deprecated)
- CraftingService: [ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts) - Frontend Socket.io service
- Crafting Component: [ui/src/app/components/game/crafting/](ui/src/app/components/game/crafting/) - Recipe browser, instance selection
- Recipe Registry: [be/data/recipes/RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts) - TypeScript recipe definitions

**Key Features:**
- **Real-time Socket.io**: Server-authoritative timing, instant completion events, no HTTP polling
- **Instance selection**: Choose specific items by quality/traits (Player.activeCrafting.selectedIngredients Map)
- **Quality inheritance**: Max ingredient quality + skill bonus (every 10 levels = +1, max +2)
- **Time-based**: 6-12 second durations with server-controlled completion
- **Auto-select best**: One-click highest quality ingredient selection
- **Quality badges**: Common, Uncommon, Rare, Epic, Legendary
- **Recipe filtering**: Search by name/description, show craftable only, sort by level/name/XP
- **Auto-restart**: Client-driven automatic restart of last completed recipe
- **Progress timer**: Client-side countdown with server timestamp synchronization

**Current Skills:**
- Cooking (4 recipes: shrimp/trout/salmon/cod at kennik-kitchen)
- Smithing (16 recipes: ore smelting, bronze/iron equipment - weapons, armor, tools)
- Alchemy (6 recipes: health/mana potions levels 1-15 at village-apothecary)

**Advanced Features:**
- **Subcategory ingredients**: Recipes can require "any herb" instead of specific itemIds
  - Backend validates both `itemId` and `subcategory` ingredient types
  - Frontend filters inventory by `item.definition.subcategories.includes(subcategory)`
  - Enables flexible ingredient selection and quality optimization
- **Recipe unlock system**: Progressive discovery via crafting achievements
  - `unlockConditions: { craftedRecipes: ['basic_health_tincture'] }` for recipe chains
  - `discoveredByDefault: true` for starter recipes
  - Player.unlockedRecipes tracks discovered recipes
  - Backend `checkRecipeUnlocks()` awards new recipes on craft completion
- **Multi-instance selection**: Can select 2+ of same item instance as ingredients
  - Cycling logic: 0 → 1 → 2 → max → 0
  - Quality badge display for each instance
  - Auto-select best quality feature
- See [project/docs/alchemy-subcategory-implementation.md](project/docs/alchemy-subcategory-implementation.md) for full technical details

**Configuration:**
- Recipe TypeScript: Create module in `be/data/recipes/{skill}/{RecipeId}.ts` and register in RecipeRegistry
- Facility: Set `type: "crafting"` and `craftingSkills: ["alchemy"]` in facility TypeScript definition
- Subcategory ingredients: Use `{ subcategory: 'herb', quantity: 2 }` instead of `{ itemId: 'sage', quantity: 2 }`
- Item subcategories: Add `subcategories: ['herb']` to item definition

## Combat System

Turn-based combat system with monsters, abilities, and stat tracking.

**Key Files:**
- CombatService: [be/services/combatService.ts](be/services/combatService.ts) - Combat logic, damage calculation, monster AI
- CombatHandler: [be/sockets/combatHandler.ts](be/sockets/combatHandler.ts) - Socket.io real-time combat (replaces HTTP polling)
- CombatController: [be/controllers/combatController.js](be/controllers/combatController.js) - Legacy HTTP endpoints (deprecated)
- CombatService (Frontend): [ui/src/app/services/combat.service.ts](ui/src/app/services/combat.service.ts) - Frontend Socket.io service
- Combat Component: [ui/src/app/components/game/combat/](ui/src/app/components/game/combat/) - Combat UI, health bars, combat log
- Monster Registry: [be/data/monsters/MonsterRegistry.ts](be/data/monsters/MonsterRegistry.ts) - TypeScript monster definitions
- Ability Registry: [be/data/abilities/AbilityRegistry.ts](be/data/abilities/AbilityRegistry.ts) - TypeScript ability definitions

**Key Features:**
- **Real-time Socket.io**: Instant combat events, no 500ms HTTP polling, server-authoritative turn timing
- **Turn-based combat**: Player and monster alternate attacks based on weapon speed
- **Combat abilities**: Weapon-specific special attacks (6 abilities for different weapon types)
- **Timestamp-based cooldowns**: Real-time cooldown tracking using server timestamps instead of turn counts
- **Consumable items**: Use health/mana potions during combat via item-button component
- **Combat restart**: "Start New Encounter" button to repeat same activity without navigation
- **Damage calculation**: Base damage + skill level + equipment bonuses, with crit/dodge mechanics
- **Monster AI**: Basic attack patterns with ability usage
- **Combat stats**: Track defeats, damage dealt/taken, deaths, critical hits, dodges
- **Combat log**: Color-coded event history with timestamps and auto-scroll
- **Loot drops**: Monsters drop items via drop tables on defeat
- **UI components**: Reusable ability-button and item-button components with cooldowns, tooltips
- **Real-time updates**: HP/mana changes, attack timings, ability usage all broadcast instantly

**Current Content:**
- Monsters: Bandit Thug (L3, one-handed), Forest Wolf (L2, ranged), Goblin Warrior (L4, two-handed), Goblin Scout (L5, ranged), Goblin Shaman (L6, casting)
- Abilities: Heavy Strike, Quick Slash (one-handed), Aimed Shot, Rapid Fire (ranged), Fire Bolt, Ice Shard (casting)
- Combat activities: 6 combat encounters at 3 locations (Forest Clearing, Goblin Village) requiring appropriate weapon skills
- Combat drops: Raw meat, fangs, leather scraps, herbs, potions, crude equipment + gold
- Locations: Goblin Village (3 progressive combat encounters), Forest Clearing (3 encounters)

**Combat Flow:**
1. Player starts combat via activity (requires appropriate weapon equipped)
2. Turn-based attacks with weapon speed determining attack intervals
3. Use abilities (cooldown-based), consumables, or basic attacks
4. Monster defeated → rewards (XP, loot, gold) → option to restart or return
5. Player defeated → respawn at location with no penalty
6. Flee during combat (confirmation) or return after combat ends (instant)

**Configuration:**
- Monster TypeScript: Create module in `be/data/monsters/definitions/{MonsterId}.ts` and register in MonsterRegistry
- Ability TypeScript: Create module in `be/data/abilities/definitions/{AbilityId}.ts` and register in AbilityRegistry
- Combat activity: Create activity TypeScript module linking to monster drop table
- Full documentation: [project/docs/combat-system.md](project/docs/combat-system.md)

## Next Steps / Ideas

See `project/journal.md` for detailed development possibilities including:
- Combat system
- Quest system
- Crafting system (using inventory items)
- Alchemy system (quality-based recipes)
- Item enchantments
- Trading and auction house
- World map
- Real-time multiplayer features
- NPC interactions and vendors

## TypeScript Type System

The project uses a **comprehensive TypeScript type system** with shared types between frontend and backend, eliminating duplicate definitions and ensuring type consistency across the stack.

### Shared Type System (@shared/types)

**IMPORTANT**: Type definitions are now centralized in the `shared/types/` directory and used by both frontend and backend via `@shared/types` path alias. This is the single source of truth for all game data types.

**Benefits**:
- ✅ Single source of truth - types defined once, used everywhere
- ✅ Zero type drift between frontend and backend
- ✅ Compile-time validation across entire stack
- ✅ Clean imports without complex relative paths
- ✅ Better refactoring - rename types across all code
- ✅ IDE autocomplete works consistently everywhere

**Shared Type Files** ([shared/types/](shared/types/)):
- [common.ts](shared/types/common.ts) - Base types (Rarity, Stats, Skill, IconConfig, ItemInstance)
- [items.ts](shared/types/items.ts) - Item hierarchy (Item, EquipmentItem, WeaponItem, ArmorItem, ConsumableItem, ResourceItem)
- [combat.ts](shared/types/combat.ts) - Combat system (Monster, Ability, ActiveCombat, CombatStats)
- [locations.ts](shared/types/locations.ts) - Locations (Location, Facility, Activity, DropTable, Biome)
- [crafting.ts](shared/types/crafting.ts) - Crafting (Recipe, Vendor, ActiveCrafting)
- [guards.ts](shared/types/guards.ts) - Type guard functions (isWeaponItem, isEquipmentItem, etc.)
- [models.ts](shared/types/models.ts) - Frontend model types
- [index.ts](shared/types/index.ts) - Central export file

**Usage Pattern**:
```typescript
// Both frontend and backend use same import
import { Item, Monster, Activity, isWeaponItem } from '@shared/types';
```

**Backend Compatibility Layer**:
- [be/types/index.ts](be/types/index.ts) re-exports from @shared/types for backward compatibility
- Existing code using `import { Item } from '../types'` continues to work
- New code should use `import { Item } from '@shared/types'` directly

### TypeScript Data Layer Migration

**IMPORTANT**: All game data (items, locations, activities, drop tables, recipes, monsters, abilities, vendors) has been migrated from JSON to TypeScript modules with centralized registries.

**Benefits**:
- ✅ Compile-time validation of all game data
- ✅ IDE autocomplete for item properties, stats, abilities
- ✅ Type safety prevents invalid references (e.g., misspelled itemIds)
- ✅ Centralized registries for easy data management
- ✅ Better refactoring support (rename symbols across all files)
- ✅ Runtime TypeScript loading via ts-node/register

**Registry Pattern**:
Each game system has a central registry that exports all definitions:
- `ItemRegistry.ts` - 60+ items (resources, equipment, consumables)
- `LocationRegistry.ts` - All locations with biomes and facilities
- `ActivityRegistry.ts` - 18+ gathering/combat/crafting activities
- `DropTableRegistry.ts` - 16+ loot tables for activities
- `RecipeRegistry.ts` - Cooking and smithing recipes
- `MonsterRegistry.ts` - Combat monsters with stats
- `AbilityRegistry.ts` - Combat abilities with damage formulas
- `VendorRegistry.ts` - NPC merchants and their stock
- `QualityRegistry.ts` - 7 quality types with 5 levels each
- `TraitRegistry.ts` - 6 trait types with escalating effects

**Creating New Content**:
1. Create TypeScript module in appropriate directory (e.g., `be/data/items/definitions/resources/NewItem.ts`)
2. Import types from `@shared/types` and constants from `be/data/constants/item-constants`
3. Export const with strongly-typed object (e.g., `export const NewItem: ResourceItem = {...}`)
4. Use type-safe constants (CATEGORY, SUBCATEGORY, RARITY, etc.) instead of magic strings
5. Import and register in appropriate registry (e.g., add to `ItemRegistry.ts`)
6. TypeScript compiler validates structure at build time
7. Services automatically load from registries at runtime

### Type-Safe Constants System

**Item Constants** ([be/data/constants/item-constants.ts](be/data/constants/item-constants.ts)):
All item definitions use type-safe constants to eliminate magic strings and enable autocomplete:

- **CATEGORY**: CONSUMABLE, EQUIPMENT, RESOURCE
- **SUBCATEGORY**: 60+ values covering all item types
  - Resources: HERB, FLOWER, FISH, ORE, INGOT, GEMSTONE, WOOD, LOG, ROOT
  - Equipment: WEAPON, ARMOR, TOOL, HEADGEAR, SWORD, AXE, SHIELD, PICKAXE, ROD
  - Armor pieces: BODY_ARMOR, FOOTWEAR, HANDWEAR
  - Weapon traits: MELEE, ONE_HANDED, DEFENSIVE
  - Tool types: WOODCUTTING, MINING, FISHING, GATHERING
  - Materials: LEATHER, CLOTH, METAL, BRONZE, IRON
- **SUBCATEGORY_SETS**: Predefined arrays for common groupings
  - ALL_HERBS, ALL_FLOWERS, ALL_GEMSTONES, ALL_FISH, etc.
  - Easy assignment: `subcategories: SUBCATEGORY_SETS.HERBS`
- **RARITY**: COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
- **TIER**: T1 through T5
- **QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE**

**Usage in Item Definitions**:
```typescript
import { ResourceItem } from '@shared/types';
import { CATEGORY, SUBCATEGORY, RARITY, TIER } from '../../../constants/item-constants';

export const CopperOre: ResourceItem = {
  category: CATEGORY.RESOURCE,           // Type-safe constant
  subcategories: [SUBCATEGORY.ORE],      // Autocomplete available
  rarity: RARITY.COMMON,
  properties: { tier: TIER.T1 }
};
```

**Usage in Recipes**:
```typescript
import { SUBCATEGORY } from '../../../constants/item-constants';

ingredients: [
  { subcategory: SUBCATEGORY.HERB, quantity: 2 }  // Type-safe subcategory matching
]
```

### Architecture

**Typed Services** (all use @shared/types):
- [itemService.ts](be/services/itemService.ts) - Item management with full type annotations
- [combatService.ts](be/services/combatService.ts) - Combat calculations with typed monsters/abilities
- [locationService.ts](be/services/locationService.ts) - Location/activity system with type safety
- [recipeService.ts](be/services/recipeService.ts) - Recipe management with typed ingredients/outputs
- [vendorService.ts](be/services/vendorService.ts) - Vendor transactions with typed stock

**Frontend Models** (all use @shared/types):
- [inventory.model.ts](ui/src/app/models/inventory.model.ts) - Imports Item types from shared
- [location.model.ts](ui/src/app/models/location.model.ts) - Imports Activity/Location types from shared
- [recipe.model.ts](ui/src/app/models/recipe.model.ts) - Imports Recipe types from shared
- [vendor.model.ts](ui/src/app/models/vendor.model.ts) - Imports Vendor types from shared

### Features

✅ **Shared type system** - Single source of truth for frontend/backend types
✅ **Type-safe constants** - CATEGORY, SUBCATEGORY, RARITY for all 90+ item definitions
✅ **70+ TypeScript interfaces** covering all game systems
✅ **Type guards** for runtime type narrowing (`isWeaponItem`, `isEquipmentItem`)
✅ **Path aliases** - Clean imports with `@shared/types`
✅ **100% backward compatible** - works alongside existing JavaScript
✅ **Compile-time validation** - catches errors before runtime
✅ **IDE support** - IntelliSense, autocomplete, jump-to-definition
✅ **Declaration files** (.d.ts) generated for external use
✅ **Source maps** for debugging TypeScript code

### Build Commands

```bash
npm run build          # Compile TypeScript to JavaScript
npm run build:watch    # Watch mode for development
npm run type-check     # Type check without emitting files
```

### Usage Examples

**Using Shared Types**:
```typescript
// Backend
import { Item, isWeaponItem } from '@shared/types';
import itemService from '../services/itemService';

const item: Item | undefined = itemService.getItemDefinition('iron_sword');

// Frontend
import { Activity, Monster } from '@shared/types';
import { locationService } from '../services/location.service';

const activities: Activity[] = locationService.getActivities();
```

**Using Type-Safe Constants**:
```typescript
// Item definition
import { ResourceItem } from '@shared/types';
import { CATEGORY, SUBCATEGORY, RARITY } from '../../../constants/item-constants';

export const CopperOre: ResourceItem = {
  category: CATEGORY.RESOURCE,      // ✅ Autocomplete + validation
  subcategories: [SUBCATEGORY.ORE], // ✅ No typos possible
  rarity: RARITY.COMMON
};
```

**Type Guards**:
```typescript
import { isWeaponItem } from '@shared/types';

if (isWeaponItem(item)) {
  item.properties.damageRoll; // ✅ Autocomplete + type checking
  item.properties.armor;       // ❌ Compile error - weapons don't have armor
}
```

### Configuration

**Backend tsconfig.json**: TypeScript compiler settings
- Target: ES2020
- Module: CommonJS
- Path aliases: `@shared/*` → `../shared/*`
- Strict mode: Disabled (gradual migration)
- Declaration files: Enabled (.d.ts generation)
- Source maps: Enabled
- Allows JavaScript: Yes (hybrid codebase)
- Output: Compiled files in `be/dist/`

**Frontend tsconfig.app.json**: Angular TypeScript settings
- Extends base tsconfig.json
- Path aliases: `@shared/*` → `../shared/*`
- Enables clean imports across frontend components

**Shared Types Build**:
- Compiled to JavaScript with declaration files
- Source maps for debugging
- Used as dependency by both frontend and backend

## AWS Deployment Architecture

The game is deployed using a split architecture for optimal performance and scalability:

### Frontend (S3 Static Hosting)
- **S3 Bucket**: `clearskies-frontend-dev` (US East 1)
- **Hosting Type**: Static website hosting
- **Content**: Angular production build (`ui/dist/ui/browser/*`)
- **Public Access**: Enabled with bucket policy for public read
- **URL**: `http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com`

**Deployment Process**:
1. Update API endpoint in `ui/src/environments/environment.prod.ts`
2. Build locally: `cd ui && npm run build`
3. Upload to S3: Upload all files from `ui/dist/ui/browser/` to bucket root
4. Files are immediately available at S3 website endpoint

### Backend (EC2 Instance)
- **Instance Type**: Amazon Linux 2023 on EC2
- **Services**: Node.js 20.x, MongoDB, PM2 process manager
- **API Port**: 3000 (exposed via security group)
- **Public IP**: 3.226.72.134 (configured in frontend environment)

**CORS Configuration** ([be/index.ts](be/index.ts)):
```typescript
app.use(cors({
  origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
  credentials: true
}));

// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com'],
    credentials: true
  }
});
```

**Deployment Process**:
1. Commit and push backend changes to Git
2. SSH into EC2: `ssh -i "clearskies-dev-ec2.pem" ec2-user@3.226.72.134`
3. Pull updates: `cd ClearSkies && git pull`
4. Build backend: `cd be && npm run build`
5. Run migrations: `npm run migrate`
6. Start with PM2: `pm2 start npm --name "clearskies-backend" -- run dev`

### Security Groups
**Required Inbound Rules**:
- Port 22 (SSH) - For admin access
- Port 3000 (Custom TCP) - For backend API and Socket.io connections
- Port 80 (HTTP) - Optional, for future Nginx reverse proxy

### Environment Variables
Backend `.env` file on EC2:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/clearskies
JWT_SECRET=<production-secret>
JWT_EXPIRE=7d
NODE_ENV=production
```

### Future Enhancements
- **CloudFront CDN**: Add CloudFront distribution for S3 bucket (faster global delivery, HTTPS support)
- **SSL/HTTPS**: Configure SSL certificate via AWS Certificate Manager
- **Nginx Reverse Proxy**: Add Nginx on EC2 for better routing and SSL termination
- **Auto-scaling**: Configure EC2 auto-scaling groups for high traffic
- **Monitoring**: CloudWatch metrics for API performance and error tracking

