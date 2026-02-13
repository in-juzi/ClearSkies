# ClearSkies - Medieval Fantasy Browser Game

## Current Development Focus

**Active Features**:
- ✅ Gathering system (completed - 14 herbs, 4 gathering locations, renamed from Herbalism)
- ✅ Alchemy skill system (completed - 10 potion recipes with progressive unlocks)
- ✅ Trait-based potion effects (completed - herbs transfer combat buff/HoT traits to crafted potions)
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
- ✅ Signal-based reactivity (completed - location/crafting/inventory/chat/item-details-panel decomposed, shared components migrated to signals)
- ✅ Socket.io migration (completed - activities, crafting, and combat migrated from HTTP polling to real-time events)
- ✅ Shared type system (completed - @shared/types package eliminates duplicate type definitions)
- ✅ CATEGORY/SUBCATEGORY constants (completed - type-safe constants for all 90+ item definitions)
- ✅ AWS deployment configuration (completed - S3 static hosting for frontend, EC2 for backend API)
- ✅ Cloudflare custom domain setup (completed - clearskies.juzi.dev with SSL/TLS via Cloudflare proxy)
- ✅ Combat buff/debuff system (completed - stat modifiers, DoT/HoT, 4 new abilities, UI display)
- ✅ Combat constants system (completed - centralized combat formulas, type-safe enums)
- ✅ Shared constants architecture (completed - item/combat constants accessible to frontend/backend)
- ✅ TypeScript path aliases (completed - tsconfig-paths for clean @shared/* imports)
- ✅ Game loading screen (completed - immersive loading with animations and data preloading)
- ✅ Global loading overlay (completed - app-wide loading during auth initialization)
- ✅ Skill progression calculator (completed - development utility for game balance analysis)
- ✅ Potion naming standardization (completed - medieval alchemy naming: tincture/draught/elixir)
- ✅ Quality/trait system redesign (completed - removed confusing modifiers, added category-specific traits)
- ✅ Inventory right-click actions (completed - quick equip/unequip and item usage)
- ✅ Documentation reorganization (completed - numbered naming convention for 39 docs)
- ✅ Angular component naming standardization (completed - all components use .component.* convention)
- ✅ Location component decomposition (completed - split into 5 specialized sub-components)
- ✅ Crafting component decomposition (completed - split into 3 specialized sub-components)
- ✅ Inventory component decomposition (completed - split into 4 specialized sub-components)
- ✅ Chat component decomposition (completed - split into 3 specialized sub-components)
- ✅ Item-details-panel decomposition (completed - split into 5 specialized sub-components)
- ✅ Equipment subtype display system (completed - human-readable labels for all equipment types)
- ✅ Legacy potion cleanup (completed - removed old item definitions, added migration script)
- ✅ Context-aware trait system (completed - dual validation/display for crafting vs random generation)
- ✅ Attribute-based progression (completed - HP/MP/capacity scale with attributes)
- ✅ Magic→Wisdom rename (completed - better medieval fantasy terminology)
- ✅ Potency quality fix (completed - quality multipliers now apply to consumables)
- ✅ Weight-based inventory (completed - carrying capacity based on strength/endurance)
- ✅ Equipment stat application (completed - armor/damage/evasion bonuses applied to combat calculations)
- ✅ Activity log component (completed - reusable component for crafting/gathering/combat completions)
- ✅ Trait combination system (completed - multi-ingredient crafting combines all traits at max levels)
- ✅ HP/MP schema cleanup (completed - removed legacy max fields, use virtual properties exclusively)
- ✅ Resource weight/yield rebalancing (completed - 20-60% weight reduction, yield normalization across all skills)
- ✅ Inventory grouped view mode (completed - toggle between list and grouped item display)
- ✅ Storage system with WebSocket (completed - 200-slot bank, bulk operations, real-time updates for future guild storage)
- ✅ Data-driven effect system (completed - flexible modifier system for traits/qualities/affixes)
- ✅ Effect system combat integration (completed - trait bonuses for damage/armor/evasion/crit/attack speed)
- ✅ Effect system activity integration (completed - trait bonuses for activity duration/XP/yield)
- ✅ Effect system crafting integration (completed - quality bonuses, success rates, yield multipliers)
- ✅ Effect system vendor integration (completed - sell/buy price modifiers)
- ✅ World map with SVG visualization (completed - interactive map with location discovery and travel)
- ✅ Tiered XP curve system (completed - 5-tier progression replacing flat 1000 XP/level)
- ✅ Enriched skill/attribute data (completed - totalXP tracking, variable XP requirements, improved UI)
- ✅ Item inspection system (completed - detailed effect preview, item comparison endpoints)
- ✅ Quest system (completed - tutorial chain, objective tracking, auto-accept, WebSocket real-time updates)
- ✅ Woodcutting expansion (completed - birch/pine trees, rare drops, 3 wood types total)
- ✅ Farming seed items (completed - 9 seed types for future gardening skill)
- ✅ Two-handed weapons (completed - Iron Battleaxe, Iron Greatsword with Defensive Stance ability)
- ✅ Drop table preview UI (completed - expandable reward viewer in activity details)
- ✅ Notification system (completed - toast-style notifications for quest events)
- ✅ Skill system refactor (completed - removed gun skill, added protection skill for tanks)
- ✅ Centralized rarity utilities (completed - 3 standalone pipes for rarity styling)
- ✅ Centralized item utilities (completed - item-filter service and item-sort utils)
- ✅ Component utility migration (completed - all components use shared rarity/filter/sort utilities)
- ✅ Frontend logging cleanup (completed - removed debug console.log statements, kept console.error for production)
- ✅ Angular inject() migration (completed - migrated components from constructor DI to inject() function)
- ✅ Enhanced quest tracker (completed - collapsible sections for active/available/completed quests in left sidebar)
- ✅ Construction skill (completed - new skill for building and housing mechanics)
- ✅ Construction materials (completed - 5 new materials: sand, stone, planks, glass, nails)
- ✅ Construction activities (completed - sand gathering, stone quarrying, sawmill processing)
- ✅ Player housing system (completed - property ownership, building slots, construction projects)
- ✅ Backend type system consolidation (completed - removed redundant be/types/, all imports use @shared/types)
- ✅ Frontend type system consolidation (completed - cleaned up model re-exports, components import directly from @shared/types)
- ✅ Backend service refactoring (completed - extracted player services, centralized reward processing, improved code organization)
- ✅ Quantity dialog component (completed - reusable modal for bulk item operations)
- ✅ Bank bulk operations (completed - integrated quantity dialog for improved UX)
- ✅ Error handling standardization (completed - custom error classes and middleware)
- ✅ Player model cleanup (completed - removed deprecated methods, migrated to services)
- ✅ Two-handed weapon equip logic (completed - auto-unequip conflicting items, slot validation)
- ✅ Bank UI enhancements (completed - Store All button, sorting controls for bank/inventory)
- ✅ Design System v2.0 (completed - medieval fantasy theme with bronze/gold/brown palette, 400+ tokens, 53 components migrated)
- ✅ Container max-width tokens (completed - semantic tokens for width constraints, replaces invalid spacing tokens)
- ✅ Night Sky Theme Migration (completed - dark blue/moon yellow palette replacing medieval bronze/gold, 600+ tokens updated)
- ✅ Button design token classes (completed - .button-primary/secondary/tertiary/danger for all 53 components)
- ✅ Construction transaction safety (completed - rollback logic prevents gold loss on project creation failures)
- ✅ Secondary accent token system (completed - starlight color tokens for borders/text, eliminates legacy purple references)
- ✅ Combat state management improvements (completed - fixed isInCombat() validation, proper state cleanup after victory)
- ✅ SCSS mixin library (completed - 14 reusable mixins for modals/scrollbars/inputs/cards/buttons, eliminates 330+ lines of duplicate code)
- ✅ Design system utility classes (completed - 30+ utilities for flex/spacing/borders/state/overflow patterns)
- ✅ Component SCSS migration to mixins (completed - all 53 components use centralized mixin patterns, 15-35% file size reduction)
- ✅ Admin panel (completed - development tool with design system preview and game data browser)

**Recent Changes** (Last 10 commits):
- docs: update design system documentation
- refactor: migrate all components to use SCSS mixins and utility classes
- feat: add admin panel with design system preview
- build: configure Angular to use SCSS mixin library
- refactor: migrate bank component to use SCSS mixins
- feat: add utility classes to design system
- feat: add SCSS mixin library for reusable UI patterns
- chore: add combat state debugging utilities
- style: migrate auth and remaining game components to secondary accent tokens
- style: migrate shared components to secondary accent tokens

**Known Issues**:
- None currently identified

**Next Priorities**:
- Housing construction UI integration (connect frontend to backend APIs)
- Building blueprints and construction projects (define house types, materials)
- Farming/gardening skill implementation (plant seeds in property gardens, grow crops, harvest produce)
- More quest content (main story quests, optional side quests, quest chains)
- Affix system implementation (enchanting/runecarving skill)
- More trait variety (conditional effects, passive triggers)
- Quality system effects (crafting quality bonuses)
- Steel tier equipment (requires steel ingots from iron + coal)
- More alchemy recipes (debuff potions, stat potions, transmutation)
- Combat system enhancements (more monsters, abilities, boss fights)
- Guild/party system (with shared storage integration)
- Achievement system (linked to quest system)

> **Maintenance Note**: Update this section regularly so AI has context without needing to explore

## Project Overview

ClearSkies is a medieval fantasy browser-based game built with a modern tech stack:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Angular 20 (standalone components)
- **Authentication**: JWT-based with bcrypt password hashing
- **Deployment**: AWS S3 (frontend) + EC2 (backend) with Cloudflare proxy (SSL/TLS + CDN)
- **Production URL**: https://clearskies.juzi.dev

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
**Deploy to production:** `cd ui && npm run deploy` - builds and uploads to S3 with CloudFront invalidation

> **IMPORTANT**: **NEVER start backend/frontend servers** - they are always running during development. Only rebuild with `npm run build` if code changes require it. If you need to restart servers, ask the user first.

> **Content Creation Reference**: When creating new game content (monsters, locations, activities, drop tables), refer to [project/docs/019-content-creation-pitfalls.md](project/docs/019-content-creation-pitfalls.md) for common pitfalls and solutions.

## Quick File Reference

### Frequently Modified Files

**Backend Core:**
- Controllers: [inventoryController.ts](be/controllers/inventoryController.ts), [locationController.ts](be/controllers/locationController.ts), [skillsController.js](be/controllers/skillsController.js), [authController.js](be/controllers/authController.js), [vendorController.ts](be/controllers/vendorController.ts), [craftingController.ts](be/controllers/craftingController.ts), [combatController.js](be/controllers/combatController.js), [storageController.ts](be/controllers/storageController.ts), [questController.ts](be/controllers/questController.ts), [housingController.ts](be/controllers/housingController.ts)
- Models: [Player.ts](be/models/Player.ts), [User.js](be/models/User.js), [Property.ts](be/models/Property.ts), [ConstructionProject.ts](be/models/ConstructionProject.ts)
- Services: [itemService.ts](be/services/itemService.ts), [locationService.ts](be/services/locationService.ts), [combatService.ts](be/services/combatService.ts), [recipeService.ts](be/services/recipeService.ts), [effectEvaluator.ts](be/services/effectEvaluator.ts), [questService.ts](be/services/questService.ts), [rewardProcessor.ts](be/services/rewardProcessor.ts)
- Routes: [inventory.js](be/routes/inventory.js), [locations.js](be/routes/locations.js), [vendors.js](be/routes/vendors.js), [crafting.js](be/routes/crafting.js), [combat.js](be/routes/combat.js), [storage.ts](be/routes/storage.ts), [quests.ts](be/routes/quests.ts), [housing.ts](be/routes/housing.ts)
- Sockets: [chatHandler.js](be/sockets/chatHandler.js), [activityHandler.ts](be/sockets/activityHandler.ts), [craftingHandler.ts](be/sockets/craftingHandler.ts), [combatHandler.ts](be/sockets/combatHandler.ts), [storageHandler.ts](be/sockets/storageHandler.ts), [questHandler.ts](be/sockets/questHandler.ts)

**Frontend Core:**
- Game: [game.component.ts](ui/src/app/components/game/game.component.ts), [inventory/](ui/src/app/components/game/inventory/), [location/](ui/src/app/components/game/location/), [skills/](ui/src/app/components/game/skills/), [equipment/](ui/src/app/components/game/equipment/), [vendor/](ui/src/app/components/game/vendor/), [crafting/](ui/src/app/components/game/crafting/), [combat/](ui/src/app/components/game/combat/), [bank/](ui/src/app/components/game/bank/), [world-map/](ui/src/app/components/game/world-map/), [quest-tracker/](ui/src/app/components/game/quest-tracker/), [housing/](ui/src/app/components/game/housing/)
- Shared Components: [item-mini/](ui/src/app/components/shared/item-mini/), [item-details-panel/](ui/src/app/components/shared/item-details-panel/), [icon/](ui/src/app/components/shared/icon/), [ability-button/](ui/src/app/components/shared/ability-button/), [activity-log/](ui/src/app/components/shared/activity-log/), [notification-display/](ui/src/app/components/shared/notification-display/), [quantity-dialog/](ui/src/app/components/shared/quantity-dialog/)
- Services: [inventory.service.ts](ui/src/app/services/inventory.service.ts), [location.service.ts](ui/src/app/services/location.service.ts), [auth.service.ts](ui/src/app/services/auth.service.ts), [chat.service.ts](ui/src/app/services/chat.service.ts), [vendor.service.ts](ui/src/app/services/vendor.service.ts), [crafting.service.ts](ui/src/app/services/crafting.service.ts), [combat.service.ts](ui/src/app/services/combat.service.ts), [storage.service.ts](ui/src/app/services/storage.service.ts), [quest.service.ts](ui/src/app/services/quest.service.ts), [item-filter.service.ts](ui/src/app/services/item-filter.service.ts), [housing.service.ts](ui/src/app/services/housing.service.ts)
- Utilities: [item-sort.utils.ts](ui/src/app/utils/item-sort.utils.ts)
- Pipes: [rarity-class.pipe.ts](ui/src/app/pipes/rarity-class.pipe.ts), [rarity-color.pipe.ts](ui/src/app/pipes/rarity-color.pipe.ts), [rarity-name.pipe.ts](ui/src/app/pipes/rarity-name.pipe.ts)

**Game Data (TypeScript):**
- Shared Types: [shared/types/](shared/types/) - All type definitions
- Shared Constants: [shared/constants/item-constants.ts](shared/constants/item-constants.ts), [shared/constants/attribute-constants.ts](shared/constants/attribute-constants.ts)
- Item Registry: [be/data/items/ItemRegistry.ts](be/data/items/ItemRegistry.ts) - All items in [definitions/](be/data/items/definitions/)
- Location Registry: [be/data/locations/LocationRegistry.ts](be/data/locations/LocationRegistry.ts)
- Recipe Registry: [be/data/recipes/RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts)
- Monster Registry: [be/data/monsters/MonsterRegistry.ts](be/data/monsters/MonsterRegistry.ts)
- Quest Registry: [be/data/quests/QuestRegistry.ts](be/data/quests/QuestRegistry.ts)

**Utilities:**
- [be/utils/add-item.js](be/utils/add-item.js) - Add items to player inventory
- [be/scripts/validate-game-data.ts](be/scripts/validate-game-data.ts) - Validate cross-references

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

**Item Constants**: See [shared/constants/item-constants.ts](shared/constants/item-constants.ts) for all available constants

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

### ⚠️ CRITICAL: Accessing Mongoose Maps (Backend Pattern)

**IMPORTANT**: Mongoose Map fields **DO NOT** support bracket notation access. You **MUST** use `.get()` method.

**Problem**: Fields defined as `{ type: Map, of: ... }` in schemas return `undefined` with bracket notation.

**❌ WRONG - Returns undefined**:
```javascript
const instanceIds = selectedIngredients[ingredient.itemId]; // undefined!
```

**✅ CORRECT - Use .get() method**:
```javascript
const instanceIds = selectedIngredients.get(ingredient.itemId); // works!

// Safe fallback pattern for optional Maps:
const instanceIds = selectedIngredients.get
  ? selectedIngredients.get(ingredient.itemId)
  : selectedIngredients[ingredient.itemId];
```

## Critical Code Locations

### Player Model (be/models/Player.ts)

**Schema:**
- Skills: ~L15-40
- Attributes: ~L42-55
- Inventory: ~L57-75
- Equipment slots: ~L77-85
- Storage containers: ~L242-263
- Stats: ~L196-203 (health.current, mana.current)
- Virtual properties: `maxHP` ~L460, `maxMP` ~L469, `carryingCapacity` ~L481

**Core Methods:**
- `addSkillExperience()`: ~L145-165
- `addAttributeExperience()`: ~L167-185
- Quest methods: `acceptQuest()`, `updateQuestObjective()`, etc.

### Item Service (be/services/itemService.ts)

- `getItemDefinition()`: Returns typed Item objects
- `createItemInstance()`: Creates typed item instances
- `generateRandomQualities()`: Probabilistic quality generation
- `generateRandomTraits()`: Probabilistic trait generation

### Location Service (be/services/locationService.ts)

- `getLocation()`: Returns typed Location objects
- `validateActivityRequirements()`: Validates skills, equipment, inventory
- `calculateScaledXP()`: XP scaling formula
- `processActivityCompletion()`: Awards XP and loot

## How to Ask Questions Efficiently

### ✅ Low Token Usage:
- "Add copper_helmet item to items/definitions/equipment/" → Direct creation using template
- "In inventoryController.js:145, fix the stacking check" → Targeted edit
- "Check equipItem method in Player.js around line 280" → Direct Read with offset
- "Use Content Generator to add salmon fishing activity" → Agent handles it

### ❌ High Token Usage:
- "Explore the inventory system" → I read 10+ files
- "Find where items are created" → I search entire codebase
- "How does equipment work?" → I explore models, controllers, services, UI
- "Show me all activities" → I read all activity files

### 🎯 Optimal Request Pattern:
1. **Provide file path + line number when known**
2. **Use Content Generator for game content**
3. **Batch multiple related requests**
4. **Reference previous reads**
5. **Specify exact change location**

## Important Context

### Database Models

**User** ([be/models/User.js](be/models/User.js)): Auth (username, email, password hash)
**Player** ([be/models/Player.ts](be/models/Player.ts)): Game data (skills, attributes, inventory, equipment, quests, housing)
**Property** ([be/models/Property.ts](be/models/Property.ts)): Player-owned land with building slots
**ConstructionProject** ([be/models/ConstructionProject.ts](be/models/ConstructionProject.ts)): Ongoing building projects

See [Player model](be/models/Player.ts) for full schema details.

### API Routes Reference

All endpoints require JWT authentication except `/api/auth/register` and `/api/auth/login`.

**Route Files:**
- Auth: `/api/auth` → [be/routes/auth.js](be/routes/auth.js)
- Inventory: `/api/inventory` → [be/routes/inventory.js](be/routes/inventory.js)
- Locations: `/api/locations` → [be/routes/locations.js](be/routes/locations.js)
- Vendors: `/api/vendors` → [be/routes/vendors.js](be/routes/vendors.js)
- Crafting: `/api/crafting` → [be/routes/crafting.js](be/routes/crafting.js)
- Combat: `/api/combat` → [be/routes/combat.js](be/routes/combat.js)
- Bank: `/api/bank` → [be/routes/bank.ts](be/routes/bank.ts)
- Quests: `/api/quests` → [be/routes/quests.ts](be/routes/quests.ts)
- Housing: `/api/housing` → [be/routes/housing.ts](be/routes/housing.ts)

## Development Quick Rules

### Code Changes:
- ✅ Backend model change → Create migration in `be/migrations/`
- ✅ New dependency → Restart backend/frontend servers
- ✅ Use Angular signals for state management
- ✅ Game components go under `ui/src/app/components/game/`

### Authentication:
- ✅ All protected endpoints use JWT middleware
- ✅ Token in localStorage: `clearskies_token`
- ✅ `req.user._id` for user ID (NOT `req.user.userId`)

### File Operations:
- ✅ Use Edit tool first (faster than bash)
- ✅ Retry Edit once if "unexpectedly modified" error
- ✅ Fall back to bash only if Edit fails twice
- ✅ Batch related changes in one message

### Item System:
- ✅ Definitions in `be/data/items/definitions/`
- ✅ Use ItemService for all operations
- ✅ Quality levels: 1-5 (discrete integers)
- ✅ Trait levels: 1-3 (stored as Map<traitId, level>)
- ✅ Items stack if same itemId + quality + traits

### Mongoose Maps (CRITICAL):
- ❌ `Object.entries(map)` returns EMPTY on Mongoose Maps
- ✅ Always convert: `Object.fromEntries(map)` after `.toObject()`
- ✅ Use `.get()` method to access Map values

### Content Creation:
- ✅ New items/activities → Use Content Generator agent
- ✅ Validation → Use Content Validator agent

## Database Migrations

Schema changes require migrations to update existing records.

**Commands:** `npm run migrate` | `npm run migrate:status` | `npm run migrate:down`
**Location:** `be/migrations/NNN-description.js`
**Full Documentation:** [project/docs/034-database-migrations.md](project/docs/034-database-migrations.md)

## Custom Commands

- `/todo` - Save AI response as a new todo task
- `/todo-done <filename>` - Move todo to completed
- `/context-update` - Update CLAUDE.md with latest project context
- `/logical-commits` - Create logical, atomic commits from unstaged changes
- `/checkpoint` - Run logical-commits + context-update in one workflow
- `/be-build-check` - Check backend TypeScript build for errors

## Environment Variables

Backend requires `.env` file with:
- `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`

## Fast Paths (Zero Exploration Needed)

### I Can Do Instantly (No Search Required):
1. **Add item definition** - Use template from Common Code Patterns
2. **Add drop table** - Create JSON file
3. **Add activity** - Create JSON with requirements/rewards
4. **Create migration** - Write up/down functions
5. **Fix known bug** - You provide file:line reference
6. **Run utility scripts** - Execute scripts in `be/utils/`

### I Need Brief Search (<2K tokens):
1. **Find specific function** - Grep by function name
2. **Locate item/activity** - Glob by pattern
3. **Verify API endpoint** - Grep in routes files

### I Need Deep Exploration (>10K tokens):
1. **"How does X work?"** - Multi-file architectural analysis
2. **"Design new system"** - Architecture planning

### Example Optimal Requests:
```
✅ "Add copper_helmet to be/data/items/definitions/equipment/ with slot: head, tier: 2"
✅ "In Player.js line 280, change equipItem to validate slot compatibility"
✅ "Create 3 herb items: sage, thyme, rosemary as tier-1 resources"

❌ "Explore how the inventory system works"
❌ "Show me all the items in the game"
```

## System Documentation

For detailed information about specific systems, see:

### Architecture & Systems
- **[075-typescript-architecture.md](project/docs/075-typescript-architecture.md)** - Shared types, constants, registries
- **[076-deployment-guide.md](project/docs/076-deployment-guide.md)** - AWS, Cloudflare, production setup
- **[033-socketio-architecture.md](project/docs/033-socketio-architecture.md)** - Real-time communication

### Game Systems
- **[015-inventory-system.md](project/docs/015-inventory-system.md)** - Items, quality, traits, stacking
- **[031-location-system.md](project/docs/031-location-system.md)** - Locations, facilities, activities, drop tables
- **[032-xp-system.md](project/docs/032-xp-system.md)** - Skills, attributes, XP scaling
- **[041-attribute-progression-system.md](project/docs/041-attribute-progression-system.md)** - HP/MP/capacity formulas
- **[017-combat-system.md](project/docs/017-combat-system.md)** - Turn-based combat, monsters, abilities
- **[053-quest-system-testing-guide.md](project/docs/053-quest-system-testing-guide.md)** - Quest system overview

### UI & Design
- **[073-design-system-reference.md](project/docs/073-design-system-reference.md)** - Night sky theme, 600+ tokens
- **[074-scss-mixin-library-reference.md](project/docs/074-scss-mixin-library-reference.md)** - Reusable SCSS mixins
- **[077-ui-utilities-reference.md](project/docs/077-ui-utilities-reference.md)** - Rarity pipes, filters, sort utils

### Effect System
- **[046-modifier-audit-and-consolidation.md](project/docs/046-modifier-audit-and-consolidation.md)** - Effect system audit
- **[047-data-driven-effect-system-implementation.md](project/docs/047-data-driven-effect-system-implementation.md)** - Implementation guide
- **[048-creating-traits-and-affixes-guide.md](project/docs/048-creating-traits-and-affixes-guide.md)** - Creating new effects

### Content Creation
- **[005-content-generator-agent.md](project/docs/005-content-generator-agent.md)** - AI-powered content creation
- **[019-content-creation-pitfalls.md](project/docs/019-content-creation-pitfalls.md)** - Common issues and solutions

### Project Management
- **[012-completed-features.md](project/docs/012-completed-features.md)** - Full list of completed features
- **[034-database-migrations.md](project/docs/034-database-migrations.md)** - Migration guide
