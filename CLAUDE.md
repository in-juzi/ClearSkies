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

**Recent Changes** (Last 10 commits):
- chore: update Claude Code local settings
- chore: code formatting and minor registry updates
- docs: add player housing and construction system documentation
- feat: add database migrations for construction and housing
- feat: add housing system frontend components
- feat: add housing system API and WebSocket handlers
- feat: add player housing and construction system backend
- refactor: enhance location type system with crafting activities
- feat: add construction crafting recipes
- feat: add construction resource gathering activities
- refactor: standardize component class names with Component suffix
- refactor: migrate components to use inject() instead of constructor DI
- docs: update CLAUDE.md with frontend logging cleanup
- refactor: remove debug console.log statements from frontend
- feat: add centralized item sorting utilities
- feat: add rarity transformation pipes for consistent styling

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
- Controllers: [be/controllers/inventoryController.js](be/controllers/inventoryController.js), [be/controllers/locationController.js](be/controllers/locationController.js), [be/controllers/skillsController.js](be/controllers/skillsController.js), [be/controllers/attributesController.js](be/controllers/attributesController.js), [be/controllers/authController.js](be/controllers/authController.js), [be/controllers/manualController.js](be/controllers/manualController.js), [be/controllers/vendorController.js](be/controllers/vendorController.js), [be/controllers/craftingController.js](be/controllers/craftingController.js), [be/controllers/combatController.js](be/controllers/combatController.js), [be/controllers/storageController.ts](be/controllers/storageController.ts), [be/controllers/questController.ts](be/controllers/questController.ts), [be/controllers/housingController.ts](be/controllers/housingController.ts)
- Models: [be/models/Player.ts](be/models/Player.ts), [be/models/User.js](be/models/User.js), [be/models/ChatMessage.js](be/models/ChatMessage.js), [be/models/Property.ts](be/models/Property.ts), [be/models/ConstructionProject.ts](be/models/ConstructionProject.ts)
- Services (TypeScript): [be/services/itemService.ts](be/services/itemService.ts), [be/services/locationService.ts](be/services/locationService.ts), [be/services/dropTableService.ts](be/services/dropTableService.ts), [be/services/vendorService.ts](be/services/vendorService.ts), [be/services/recipeService.ts](be/services/recipeService.ts), [be/services/combatService.ts](be/services/combatService.ts), [be/services/storageService.ts](be/services/storageService.ts), [be/services/effectEvaluator.ts](be/services/effectEvaluator.ts), [be/services/questService.ts](be/services/questService.ts), [be/services/propertyService.ts](be/services/propertyService.ts), [be/services/constructionService.ts](be/services/constructionService.ts)
- Routes: [be/routes/inventory.js](be/routes/inventory.js), [be/routes/locations.js](be/routes/locations.js), [be/routes/skills.js](be/routes/skills.js), [be/routes/attributes.js](be/routes/attributes.js), [be/routes/auth.js](be/routes/auth.js), [be/routes/manual.js](be/routes/manual.js), [be/routes/vendors.js](be/routes/vendors.js), [be/routes/crafting.js](be/routes/crafting.js), [be/routes/combat.js](be/routes/combat.js), [be/routes/storage.ts](be/routes/storage.ts), [be/routes/quests.ts](be/routes/quests.ts), [be/routes/housing.ts](be/routes/housing.ts)
- Sockets: [be/sockets/chatHandler.js](be/sockets/chatHandler.js), [be/sockets/activityHandler.ts](be/sockets/activityHandler.ts), [be/sockets/craftingHandler.ts](be/sockets/craftingHandler.ts), [be/sockets/combatHandler.ts](be/sockets/combatHandler.ts), [be/sockets/storageHandler.ts](be/sockets/storageHandler.ts), [be/sockets/questHandler.ts](be/sockets/questHandler.ts), [be/sockets/constructionHandler.ts](be/sockets/constructionHandler.ts)

**Frontend Core:**
- Game Component: [ui/src/app/components/game/game.component.ts](ui/src/app/components/game/game.component.ts), [ui/src/app/components/game/game.component.html](ui/src/app/components/game/game.component.html)
- Inventory: [ui/src/app/components/game/inventory/inventory.component.ts](ui/src/app/components/game/inventory/inventory.component.ts), [ui/src/app/components/game/inventory/inventory.component.html](ui/src/app/components/game/inventory/inventory.component.html)
  - Inventory Sub-components: [inventory-header/](ui/src/app/components/game/inventory/inventory-header/), [inventory-stats/](ui/src/app/components/game/inventory/inventory-stats/), [inventory-list-view/](ui/src/app/components/game/inventory/inventory-list-view/), [inventory-grouped-view/](ui/src/app/components/game/inventory/inventory-grouped-view/)
- Location: [ui/src/app/components/game/location/location.component.ts](ui/src/app/components/game/location/location.component.ts), [ui/src/app/components/game/location/location.component.html](ui/src/app/components/game/location/location.component.html)
  - Location Sub-components: [location-activity-detail/](ui/src/app/components/game/location/location-activity-detail/), [location-activity-progress/](ui/src/app/components/game/location/location-activity-progress/), [location-facility-detail/](ui/src/app/components/game/location/location-facility-detail/), [location-facility-list/](ui/src/app/components/game/location/location-facility-list/), [location-travel/](ui/src/app/components/game/location/location-travel/), [activity-drop-table/](ui/src/app/components/game/location/activity-drop-table/)
- Skills: [ui/src/app/components/game/skills/skills.component.ts](ui/src/app/components/game/skills/skills.component.ts)
- Attributes: [ui/src/app/components/game/attributes/attributes.component.ts](ui/src/app/components/game/attributes/attributes.component.ts)
- Character Status: [ui/src/app/components/game/character-status/character-status.component.ts](ui/src/app/components/game/character-status/character-status.component.ts)
- Equipment: [ui/src/app/components/game/equipment/equipment.component.ts](ui/src/app/components/game/equipment/equipment.component.ts)
- Chat: [ui/src/app/components/game/chat/chat.component.ts](ui/src/app/components/game/chat/chat.component.ts)
  - Chat Sub-components: [chat-header/](ui/src/app/components/game/chat/chat-header/), [chat-messages/](ui/src/app/components/game/chat/chat-messages/), [chat-input/](ui/src/app/components/game/chat/chat-input/)
- Vendor: [ui/src/app/components/game/vendor/vendor.component.ts](ui/src/app/components/game/vendor/vendor.component.ts), [ui/src/app/components/game/vendor/vendor.component.html](ui/src/app/components/game/vendor/vendor.component.html)
- Crafting: [ui/src/app/components/game/crafting/crafting.component.ts](ui/src/app/components/game/crafting/crafting.component.ts), [ui/src/app/components/game/crafting/crafting.component.html](ui/src/app/components/game/crafting/crafting.component.html)
  - Crafting Sub-components: [recipe-list/](ui/src/app/components/game/crafting/recipe-list/), [ingredient-selector/](ui/src/app/components/game/crafting/ingredient-selector/), [crafting-progress/](ui/src/app/components/game/crafting/crafting-progress/)
- Combat: [ui/src/app/components/game/combat/combat.component.ts](ui/src/app/components/game/combat/combat.component.ts), [ui/src/app/components/game/combat/combat.component.html](ui/src/app/components/game/combat/combat.component.html)
- Bank: [ui/src/app/components/game/bank/bank.component.ts](ui/src/app/components/game/bank/bank.component.ts), [ui/src/app/components/game/bank/bank.component.html](ui/src/app/components/game/bank/bank.component.html)
- World Map: [ui/src/app/components/game/world-map/world-map.component.ts](ui/src/app/components/game/world-map/world-map.component.ts), [ui/src/app/components/game/world-map/world-map.component.html](ui/src/app/components/game/world-map/world-map.component.html)
- Quest Components: [quest-tracker/](ui/src/app/components/game/quest-tracker/), [quest-journal/](ui/src/app/components/game/quest-journal/)
- Housing Components: [housing/](ui/src/app/components/game/housing/), [construction-browser/](ui/src/app/components/game/construction-browser/)
- Manual: [ui/src/app/components/manual/manual.component.ts](ui/src/app/components/manual/manual.component.ts), [ui/src/app/components/manual/sections/](ui/src/app/components/manual/sections/)
- Shared Components: [ui/src/app/components/shared/item-mini/item-mini.component.ts](ui/src/app/components/shared/item-mini/item-mini.component.ts), [ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts](ui/src/app/components/shared/item-modifiers/item-modifiers.component.ts), [ui/src/app/components/shared/item-details-panel/item-details-panel.component.ts](ui/src/app/components/shared/item-details-panel/item-details-panel.component.ts), [ui/src/app/components/shared/icon/icon.component.ts](ui/src/app/components/shared/icon/icon.component.ts), [ui/src/app/components/shared/xp-mini/xp-mini.component.ts](ui/src/app/components/shared/xp-mini/xp-mini.component.ts), [ui/src/app/components/shared/ability-button/ability-button.component.ts](ui/src/app/components/shared/ability-button/ability-button.component.ts), [ui/src/app/components/shared/item-button/item-button.component.ts](ui/src/app/components/shared/item-button/item-button.component.ts), [ui/src/app/components/shared/buff-icon/buff-icon.component.ts](ui/src/app/components/shared/buff-icon/buff-icon.component.ts), [ui/src/app/components/shared/activity-log/activity-log.component.ts](ui/src/app/components/shared/activity-log/activity-log.component.ts), [notification-display/](ui/src/app/components/shared/notification-display/)
  - Item-details-panel Sub-components: [item-detail-header/](ui/src/app/components/shared/item-details-panel/item-detail-header/), [item-basic-info/](ui/src/app/components/shared/item-details-panel/item-basic-info/), [item-stats-display/](ui/src/app/components/shared/item-details-panel/item-stats-display/), [item-modifiers-display/](ui/src/app/components/shared/item-details-panel/item-modifiers-display/), [item-actions/](ui/src/app/components/shared/item-details-panel/item-actions/)
- Services: [ui/src/app/services/inventory.service.ts](ui/src/app/services/inventory.service.ts), [ui/src/app/services/location.service.ts](ui/src/app/services/location.service.ts), [ui/src/app/services/skills.service.ts](ui/src/app/services/skills.service.ts), [ui/src/app/services/auth.service.ts](ui/src/app/services/auth.service.ts), [ui/src/app/services/manual.service.ts](ui/src/app/services/manual.service.ts), [ui/src/app/services/chat.service.ts](ui/src/app/services/chat.service.ts), [ui/src/app/services/vendor.service.ts](ui/src/app/services/vendor.service.ts), [ui/src/app/services/recipe.service.ts](ui/src/app/services/recipe.service.ts), [ui/src/app/services/crafting.service.ts](ui/src/app/services/crafting.service.ts), [ui/src/app/services/combat.service.ts](ui/src/app/services/combat.service.ts), [ui/src/app/services/icon.service.ts](ui/src/app/services/icon.service.ts), [ui/src/app/services/storage.service.ts](ui/src/app/services/storage.service.ts), [ui/src/app/services/quest.service.ts](ui/src/app/services/quest.service.ts), [ui/src/app/services/notification.service.ts](ui/src/app/services/notification.service.ts), [ui/src/app/services/item-filter.service.ts](ui/src/app/services/item-filter.service.ts), [ui/src/app/services/housing.service.ts](ui/src/app/services/housing.service.ts)
- Utilities: [ui/src/app/utils/item-sort.utils.ts](ui/src/app/utils/item-sort.utils.ts)
- Pipes: [ui/src/app/pipes/rarity-class.pipe.ts](ui/src/app/pipes/rarity-class.pipe.ts), [ui/src/app/pipes/rarity-color.pipe.ts](ui/src/app/pipes/rarity-color.pipe.ts), [ui/src/app/pipes/rarity-name.pipe.ts](ui/src/app/pipes/rarity-name.pipe.ts)
- Constants: [ui/src/app/constants/material-colors.constants.ts](ui/src/app/constants/material-colors.constants.ts), [ui/src/app/constants/game-data.constants.ts](ui/src/app/constants/game-data.constants.ts)

**Game Data (TypeScript):**
- Shared Types: [shared/types/](shared/types/) - Shared type definitions used by both frontend and backend
- Shared Constants: [shared/constants/item-constants.ts](shared/constants/item-constants.ts), [shared/constants/attribute-constants.ts](shared/constants/attribute-constants.ts) - Type-safe game constants (source of truth)
- Effect System Types: [shared/types/effect-system.ts](shared/types/effect-system.ts) - Data-driven effect system for modifiers
- Housing Types: [shared/types/housing.ts](shared/types/housing.ts) - Property and construction project types
- Item Registry: [be/data/items/ItemRegistry.ts](be/data/items/ItemRegistry.ts) - All items in [definitions/](be/data/items/definitions/)
- Item Constants (BE): [be/data/constants/item-constants.ts](be/data/constants/item-constants.ts) - Re-exports from shared/constants
- Combat Constants: [be/data/constants/combat-constants.ts](be/data/constants/combat-constants.ts) - Combat formulas and balance tuning
- Attribute Constants: [shared/constants/attribute-constants.ts](shared/constants/attribute-constants.ts) - HP/MP/capacity scaling formulas
- Combat Enums: [shared/types/combat-enums.ts](shared/types/combat-enums.ts) - Type-safe BuffableStat, ModifierType, PassiveTrigger
- Location Registry: [be/data/locations/LocationRegistry.ts](be/data/locations/LocationRegistry.ts) - All locations in [definitions/](be/data/locations/definitions/)
- Activity Registry: [be/data/locations/ActivityRegistry.ts](be/data/locations/ActivityRegistry.ts) - All activities in [activities/](be/data/locations/activities/)
- Drop Table Registry: [be/data/locations/DropTableRegistry.ts](be/data/locations/DropTableRegistry.ts) - All drop tables in [drop-tables/](be/data/locations/drop-tables/)
- Facility Registry: [be/data/locations/FacilityRegistry.ts](be/data/locations/FacilityRegistry.ts) - All facilities in [facilities/](be/data/locations/facilities/)
- Vendor Registry: [be/data/vendors/VendorRegistry.ts](be/data/vendors/VendorRegistry.ts) - All vendors as TypeScript modules
- Recipe Registry: [be/data/recipes/RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts) - All recipes by skill
- Monster Registry: [be/data/monsters/MonsterRegistry.ts](be/data/monsters/MonsterRegistry.ts) - All monsters in [definitions/](be/data/monsters/definitions/)
- Ability Registry: [be/data/abilities/AbilityRegistry.ts](be/data/abilities/AbilityRegistry.ts) - All abilities in [definitions/](be/data/abilities/definitions/)
- Quest Registry: [be/data/quests/QuestRegistry.ts](be/data/quests/QuestRegistry.ts) - All quests in [definitions/](be/data/quests/definitions/) (tutorial + optional)
- Quality Registry: [be/data/items/qualities/QualityRegistry.ts](be/data/items/qualities/QualityRegistry.ts)
- Trait Registry: [be/data/items/traits/TraitRegistry.ts](be/data/items/traits/TraitRegistry.ts)

**Utilities:**
- [be/utils/add-item.js](be/utils/add-item.js) - Add items to player inventory
- [be/utils/calculate-skill-progression.ts](be/utils/calculate-skill-progression.ts) - Skill progression calculator (npm run progression)
- [be/utils/check-player-location.js](be/utils/check-player-location.js) - Debug player location and stats
- [be/utils/content-generator.js](be/utils/content-generator.js) - Interactive content creation
- [be/utils/test-xp-scaling.js](be/utils/test-xp-scaling.js) - XP formula testing
- [be/scripts/validate-game-data.ts](be/scripts/validate-game-data.ts) - Validate cross-references (npm run validate)
- [project/utils/split-svg-paths.js](project/utils/split-svg-paths.js) - Split SVG paths (basic, no normalization)
- [project/utils/split-svg-paths-normalized.js](project/utils/split-svg-paths-normalized.js) - Split SVG paths with coordinate normalization (recommended)
- [update-category-constants.py](update-category-constants.py) - Python script to migrate item definitions to use constants

## Project Structure (Key Files Only)

```
shared/
├── types/           # Shared TypeScript type definitions (Item, Monster, Location, etc.)
└── constants/       # Shared constants (item-constants.ts - source of truth)

be/
├── controllers/     # inventoryController, locationController, skillsController, attributesController, authController
├── models/          # Player.js (inventory, skills, equipment), User.js
├── services/        # itemService, locationService, dropTableService, combatService (all use @shared/types)
│   └── combat/      # CombatEntity.ts (base class for future refactoring)
├── data/
│   ├── constants/   # combat-constants.ts (formulas), item-constants.ts (re-exports from shared)
│   ├── items/definitions/    # Item TypeScript modules (90+ items use constants)
│   └── locations/   # Location, activity, drop table TypeScript modules
├── migrations/      # Database migration scripts
├── types/           # Compatibility layer (re-exports from @shared/types)
└── utils/          # Dev tools (add-item.js, content-generator.js, test-xp-scaling.js)

project/docs/        # Combat refactoring roadmap, shared types guidelines

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

**Item Constants**: See [shared/constants/item-constants.ts](shared/constants/item-constants.ts) and [README](be/data/constants/README.md) for all available constants:
- **CATEGORY**: CONSUMABLE, EQUIPMENT, RESOURCE
- **SUBCATEGORY**: 60+ values (HERB, FLOWER, FISH, ORE, INGOT, GEMSTONE, WOOD, WEAPON, ARMOR, TOOL, etc.)
- **SUBCATEGORY_SETS**: Predefined arrays (ALL_HERBS, ALL_FLOWERS, ALL_GEMSTONES, etc.)
- **RARITY, TIER, QUALITY_SETS, TRAIT_SETS, TRAIT_IDS, MATERIAL, SLOT, WEAPON_SUBTYPE**
- **TRAIT_SETS** includes: EQUIPMENT_PRISTINE, POTION, HERB_RESTORATIVE, HERB_EMPOWERING, HERB_INVIGORATING, HERB_WARDING
- **TRAIT_IDS** includes: PRISTINE, RESTORATIVE, EMPOWERING, INVIGORATING, WARDING, BLESSED, CURSED, MASTERWORK

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

See [project/docs/005-content-generator-agent.md](project/docs/005-content-generator-agent.md) for full documentation.

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

### Player Model (be/models/Player.ts)
- Skills schema: ~L15-40
- Attributes schema: ~L42-55
- Inventory schema: ~L57-75
- Equipment slots: ~L77-85
- Storage containers schema: ~L242-263 (bank and future housing containers)
- Stats schema: ~L196-203 (health.current, mana.current - max values are virtual properties)
- Virtual properties: `maxHP` ~L460, `maxMP` ~L469, `carryingCapacity` ~L481, `currentWeight` ~L490
- Pre-save hook: ~L498-510 (initializes HP/MP for new players)
- `addSkillExperience()`: ~L145-165
- `addAttributeExperience()`: ~L167-185
- `addItem()`: ~L200-240 (includes stacking logic)
- `removeItem()`: ~L242-265
- `equipItem()`: ~L280-310
- `unequipItem()`: ~L312-330
- `hasEquippedSubtype()`: ~L350-365
- `hasInventoryItem()`: ~L367-380
- `getContainer()`: ~L965-975 (get storage container by ID)
- `depositToContainer()`: ~L1005-1075 (deposit items with stacking)
- `withdrawFromContainer()`: ~L1077-1133 (withdraw items to inventory)

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
**Game Mechanics**: Skills (13), Attributes (7), XP scaling with 50% skill→attribute passthrough, Tiered XP curve (5 tiers, 50 levels)
**Inventory**: Items (95), Quality/Trait (5-tier/3-tier), Stacking, Equipment slots (10), Consumables (potions), Storage system (WebSocket, 200 slots, bulk operations)
**Storage**: WebSocket real-time system, Container abstraction (bank/guild/housing), Bulk deposit operations, Room-based multi-user updates, 200-slot bank, Drag-and-drop UI
**World**: Locations (4), Activities (22), Drop tables (20+), Travel, World map (SVG visualization), Server-authoritative timing
**Combat**: Turn-based combat (Socket.io), Monsters (5), Abilities (11), Combat stats tracking, Restart encounters, Real-time events, Buff/debuff system
**Crafting**: Cooking (4 recipes) + Smithing (16 recipes) + Alchemy (10 recipes, Socket.io), Quality inheritance, Instance selection, Recipe filtering, Subcategory ingredients, Recipe unlocks, Auto-restart
**Quests**: Tutorial chain (5 quests), Optional side quests (7 quests), Auto-accept mechanics, Objective tracking, Real-time progress updates, Toast notifications
**UI**: IconComponent (multi-channel colorization), ItemMiniComponent, AbilityButtonComponent, ItemButtonComponent, Manual/help system, Quest tracker, Quest journal, Notification system, Drop table preview, Centralized utilities (rarity pipes, item-filter service, item-sort utils)
**Social**: Real-time chat (Socket.io), Vendor trading, Gold system
**Architecture**: Full Socket.io migration (activities, crafting, combat, quests) - eliminated HTTP polling, server-authoritative timing, client-driven auto-restart, Shared TypeScript types, Effect system, Centralized UI utilities

See [project/docs/012-completed-features.md](project/docs/012-completed-features.md) for full list.

### Database Models

**User** ([be/models/User.js](be/models/User.js) ~L10-25): Auth (username, email, password hash, isActive)

**ChatMessage** ([be/models/ChatMessage.js](be/models/ChatMessage.js) ~L10-20): Chat history (userId, username, message, channel)

**Property** ([be/models/Property.ts](be/models/Property.ts)): Player-owned land with building slots
- Fields: propertyId, ownerId, locationId, name, description, buildingSlots, permissions, customizations
- Building slots: house, workshop, garden, storage, etc. with construction projects
- Permission system for visitor access

**ConstructionProject** ([be/models/ConstructionProject.ts](be/models/ConstructionProject.ts)): Ongoing building projects
- Fields: projectId, propertyId, buildingSlot, buildingType, requiredMaterials, contributedMaterials, participants, status
- Multi-player contribution tracking
- Material requirements with progress tracking

**Player** ([be/models/Player.ts](be/models/Player.ts) ~L15-500): Game data
- Skills (14): woodcutting, mining, fishing, gathering (renamed from herbalism), smithing, cooking, alchemy, construction (new), oneHanded, dualWield, twoHanded, ranged, casting, protection (new - replaced gun)
- Attributes (7): strength, endurance, wisdom (renamed from magic), perception, dexterity, will, charisma
- Skill-Attribute links: woodcutting/mining→strength, fishing/smithing→endurance, gathering/cooking/alchemy→will, construction→strength, oneHanded/twoHanded→strength, dualWield/ranged→dexterity, casting→wisdom, protection→endurance
- Inventory: items with qualities (Map), traits (Map), quantities, equipped flag
- Equipment slots (Map): 10 default slots (head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft)
- Storage containers: Array of containers (bank + future housing), each with containerId, type, name, capacity, items
- Housing: properties (Array of propertyIds), maxProperties (scales with construction level), activeConstructionProjects (Array of projectIds)
- Location state: currentLocation, discoveredLocations, activeActivity, travelState
- Combat state: activeCombat (monster instance, turn tracking, cooldowns, combat log, activityId), combatStats (defeats, damage, deaths, crits, dodges), lastCombatActivityId
- Quest state: activeQuests (Array of quest progress), completedQuests (Array of questIds)
- Character: characterName (optional display name), gold, achievements (Array)
- Virtual properties: maxHP (STR×3 + END×2 + WILL×1 + 10), maxMP (WIS×6 + WILL×3 + 10), carryingCapacity (STR×2kg + END×1kg + 50kg), currentWeight

**Key Methods:** See [be/models/Player.ts](be/models/Player.ts) for full list
- Skills/Inventory: `addSkillExperience()` ~L145, `addItem()` ~L200, `equipItem()` ~L280
- Storage: `getContainer()` ~L965, `depositToContainer()` ~L1005, `withdrawFromContainer()` ~L1077
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
- Bank: `/api/bank` → [be/routes/bank.ts](be/routes/bank.ts)
- Quests: `/api/quests` → [be/routes/quests.ts](be/routes/quests.ts)
- Housing: `/api/housing` → [be/routes/housing.ts](be/routes/housing.ts)
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

Schema changes require migrations to update existing records

**Commands:** `npm run migrate` | `npm run migrate:status` | `npm run migrate:down`

**Location:** `be/migrations/NNN-description.js` (16 existing migrations)

**Full Documentation:** [project/docs/034-database-migrations.md](project/docs/034-database-migrations.md)

## Custom Commands

- `/todo` - Save AI response as a new todo task
- `/todo-done <filename>` - Move todo to completed
- `/context-update` - Update CLAUDE.md with latest project context and changes
- `/logical-commits` - Analyze unstaged changes and create logical, atomic commits
- `/checkpoint` - Run logical-commits + context-update in one automated workflow
- `/be-build-check` - Check backend TypeScript build for errors and fix them automatically

## Environment Variables

Backend requires `.env` file with:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration (default: 7d)

## Inventory System

Three-tier architecture: Item Definitions → Quality/Trait Definitions → Item Instances

**Quick Facts:**
- 75+ items (resources, equipment, consumables) in TypeScript registries
- 5-level quality system (1-5 integer levels) with escalating bonuses
- 3-level trait system (Map<traitId, level>) for special modifiers and alchemy effects
- 13 trait types (4 alchemy-specific: restorative, empowering, invigorating, warding)
- Category-specific traits: Hardened (weapons), Reinforced (armor), Balanced (tools/wood)
- Intuitive quality names: Grain (wood), Potency (herbs), Purity (ores), Sheen (gems)
- Context-aware validation: 'random' (strict allowedTraits) vs 'crafted' (permissive applicableCategories)
- Context-aware display: Traits show different names per category ("Restorative" on herbs → "Regeneration" on potions)
- Herbs transfer effect traits to crafted potions (buff/HoT effects in combat)
- Potency quality applies to consumables (multiplies health/mana restore by 1.10-1.50)
- Weight-based carrying capacity (scales with STR/END attributes)
- Probabilistic generation: 35% plain, 45% one quality, 15% two qualities
- Items stack if same itemId + quality levels + trait levels
- Multi-channel SVG icon colorization (40+ materials)
- Right-click inventory items for quick actions (equip/unequip/use)
- View modes: List (individual instances) or Grouped (organized by item definition)
- Resource balancing: 20-60% lighter weights, normalized gathering yields (1-2 base, 2-3 quality)

**Key Files:**
- Item Registry: [ItemRegistry.ts](be/data/items/ItemRegistry.ts)
- Quality Registry: [QualityRegistry.ts](be/data/items/qualities/QualityRegistry.ts)
- Trait Registry: [TraitRegistry.ts](be/data/items/traits/TraitRegistry.ts)
- Item Service: [itemService.ts](be/services/itemService.ts)

**Full Documentation:** [project/docs/015-inventory-system.md](project/docs/015-inventory-system.md), [project/docs/011-level-based-quality-trait-system.md](project/docs/011-level-based-quality-trait-system.md), [project/docs/040-context-aware-trait-system.md](project/docs/040-context-aware-trait-system.md), [project/docs/042-potency-quality-consumable-fix.md](project/docs/042-potency-quality-consumable-fix.md), [project/docs/043-resource-weight-yield-rebalancing.md](project/docs/043-resource-weight-yield-rebalancing.md)

## Location System

Four-tier hierarchy: Locations → Facilities → Activities → Drop Tables

**Quick Facts:**
- Real-time Socket.io (no HTTP polling, server-authoritative timing)
- Activities award XP (with scaling) and loot from weighted drop tables
- Client-driven auto-restart (requires active player, prevents AFK grinding)
- Item requirements: skills, equipped items (by subtype), inventory items
- TypeScript registries with compile-time validation

**Key Files:**
- Location Registry: [LocationRegistry.ts](be/data/locations/LocationRegistry.ts)
- Activity Registry: [ActivityRegistry.ts](be/data/locations/ActivityRegistry.ts)
- Drop Table Registry: [DropTableRegistry.ts](be/data/locations/DropTableRegistry.ts)
- Location Service: [locationService.ts](be/services/locationService.ts)
- Activity Handler: [activityHandler.ts](be/sockets/activityHandler.ts)

**Socket Events:** `activity:start`, `activity:started`, `activity:completed`, `activity:cancelled`, `activity:getStatus`

**Full Documentation:** [project/docs/031-location-system.md](project/docs/031-location-system.md), [project/docs/002-drop-table-system.md](project/docs/002-drop-table-system.md)

## Equipment System

10-slot equipment system with drag-and-drop UI

**Quick Facts:**
- Slots: head, body, mainHand, offHand, belt, gloves, boots, necklace, ringRight, ringLeft
- Slot-based validation (items can only go in designated slots)
- Auto-unequip when equipping to occupied slot
- Items marked with `equipped: true` flag in inventory

**Key Methods** (Player model):
- `equipItem(instanceId, slotName)`, `unequipItem(slotName)`, `getEquippedItems()`

**Full Documentation:** [project/docs/001-equipment-system.md](project/docs/001-equipment-system.md)

## XP System

Skills → Attributes with 50% XP passthrough and tiered leveling curve

**Key Facts:**
- **Tiered XP curve** (5 tiers, 50 levels total):
  - Levels 1-10: 100 XP/level (early game tutorial)
  - Levels 11-20: 500 XP/level (mid-early progression)
  - Levels 21-30: 1500 XP/level (mid-game grind)
  - Levels 31-40: 3000 XP/level (late-mid game)
  - Levels 41-50: 5000 XP/level (endgame)
- XP curve defined in `shared/constants/attribute-constants.ts`
- Helper functions: `getXPForLevel()`, `getTotalXPForLevel()`, `getPercentToNextLevel()`
- 50% of skill XP awarded to linked attribute (woodcutting → strength)
- Activity XP scaling formula: `1 / (1 + 0.3 * (levelDiff - 1))` with 0-1 level grace range
- Minimum 1 XP floor (no hard blocks)
- Migration: `017-convert-to-new-xp-curve.js` converts existing players to new system

**Enriched Skill/Attribute Data:**
- Controllers now return: `level`, `experience`, `xpToNextLevel`, `percentToNextLevel`, `totalXP`
- UI displays variable XP requirements (e.g., "45/500 XP" instead of static "45/1000")
- Total cumulative XP tracking for lifetime progression stats

**Activity XP Balancing:**
- All activities rebalanced for tiered curve
- Early activities: 15-40 XP (6-8 completions per level)
- Mid activities: 75-150 XP
- Late activities: proportionally scaled
- Utility scripts: `generate-xp-curve.ts`, `survey-activity-xp.ts`, `update-activity-xp.ts`

**Full Documentation:** [project/docs/032-xp-system.md](project/docs/032-xp-system.md), [project/docs/051-tiered-xp-system-implementation.md](project/docs/051-tiered-xp-system-implementation.md)

## Attribute Progression System

Attributes dynamically scale HP, MP, and carrying capacity

**Key Facts:**
- HP formula: 10 + (STR×3) + (END×2) + (WILL×1)
- MP formula: 10 + (WIS×6) + (WILL×3)
- Carrying capacity: 50kg + (STR×2kg) + (END×1kg)
- Attributes renamed: magic → wisdom (better medieval fantasy terminology)
- Virtual properties on Player model (computed on-demand, no database storage)
- Combat system uses dynamic maxHP/maxMP instead of static values
- Migration: 013-rename-magic-to-wisdom.js updates existing player documents

**Scaling Examples:**
- Level 1 attributes (all 1): 17 HP, 20 MP, 53kg capacity
- Level 25 attributes (all 25): 160 HP, 235 MP, 125kg capacity
- Level 50 attributes (all 50): 310 HP, 460 MP, 200kg capacity

**Full Documentation:** [project/docs/041-attribute-progression-system.md](project/docs/041-attribute-progression-system.md)

## Content Generator Agent

AI-powered autonomous agent for creating game content (locations, facilities, activities, drop tables)

**Usage:** Describe content in natural language
- "Add salmon fishing at deep water dock, level 12 fishing"
- "Create mountain mine with copper ore, level 8 mining"

**What It Does:** Reads existing data, validates references, creates TypeScript modules, balances rewards

**Full Documentation:** [project/docs/005-content-generator-agent.md](project/docs/005-content-generator-agent.md)

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

## Centralized UI Utilities

The frontend now uses centralized utilities for common operations, eliminating duplicate code across components.

**Rarity Pipes** ([ui/src/app/pipes/](ui/src/app/pipes/)):
- **RarityClassPipe**: Maps rarity → CSS border class (`border-gray-500`, `border-orange-500`, etc.)
- **RarityColorPipe**: Maps rarity → CSS text color class (`text-gray-400`, `text-purple-400`, etc.)
- **RarityNamePipe**: Capitalizes rarity names for display (`common` → `Common`)

**Usage**: Import pipes in component and use in templates:
```typescript
import { RarityClassPipe } from '../pipes/rarity-class.pipe';

// Template:
<div [class]="item.rarity | rarityClass">...</div>
```

**Item Filter Service** ([item-filter.service.ts](ui/src/app/services/item-filter.service.ts)):
Provides 10 filtering methods for item collections:
- `filterByCategory()`, `filterBySubcategory()`, `filterByRarity()` - Basic filters
- `filterBySearch()` - Searches name/itemId
- `filterByQuality()`, `filterByTrait()` - Quality/trait level filtering
- `filterEquipped()`, `filterUnequipped()` - Equipment state
- `applyFilters()` - Combined multi-criteria filtering

**Usage**: Inject service and call methods:
```typescript
constructor(private itemFilter: ItemFilterService) {}

const filtered = this.itemFilter.filterByCategory(items, 'equipment');
```

**Item Sort Utilities** ([item-sort.utils.ts](ui/src/app/utils/item-sort.utils.ts)):
Provides 8 sorting algorithms for item collections:
- `sortByScore()` - Quality + trait score (customizable trait weight)
- `sortByName()`, `sortByRarity()`, `sortByCategory()` - Basic sorts
- `sortByQuantity()`, `sortByWeight()`, `sortByValue()` - Numeric sorts
- `sortByCategoryRarityScore()` - Multi-criteria sort

**Usage**: Import functions and call directly:
```typescript
import { sortByRarity, calculateItemScore } from '../utils/item-sort.utils';

const sorted = sortByRarity(items);
const score = calculateItemScore(item, traitWeight);
```

**Benefits**:
- ✅ Eliminates 100+ lines of duplicate code across components
- ✅ Consistent behavior across inventory, bank, vendor, crafting, equipment
- ✅ Easier to test and maintain
- ✅ Single source of truth for rarity styling and item operations

**Migration Status**: All game components (inventory, bank, vendor, equipment, crafting) and shared components (item-details-panel) now use these utilities.

## Chat System

Real-time Socket.io player communication with commands and autocomplete

**Quick Facts:**
- Global chat room with message persistence (ChatMessage model)
- Commands: `/help`, `/online`, `/clear` with autocomplete dropdown
- Rate limiting: 5 messages per 10 seconds
- JWT authentication, XSS protection

**Key Files:** [chatHandler.js](be/sockets/chatHandler.js), [chat.service.ts](ui/src/app/services/chat.service.ts)
**Socket Events:** `chat:sendMessage`, `chat:message`, `chat:getHistory`, `chat:getOnlineCount`

## Socket.io Real-Time Architecture

Bidirectional real-time communication replacing HTTP polling for activities, crafting, and combat

**Key Features:**
- Server-authoritative timing (prevents client manipulation)
- Client-driven auto-restart (requires active player, prevents AFK grinding)
- Reconnection handling (restores state after disconnect)
- Performance: 99% reduction in network operations (eliminated 1000+ requests/min)

**Systems:** Activities, Crafting, Combat, Chat (all use Socket.io)

**Full Documentation:** [project/docs/033-socketio-architecture.md](project/docs/033-socketio-architecture.md)

## Data-Driven Effect System

Flexible, declarative system for defining how modifiers (traits, qualities, affixes) affect different game systems without hardcoding logic in services.

**Quick Facts:**
- **22 effect contexts** across combat, activities, crafting, and vendor systems
- **16 condition types** for conditional effects (HP thresholds, combat state, equipment requirements, skill levels)
- **3 modifier types**: FLAT (+5 damage), PERCENTAGE (+20% damage), MULTIPLIER (2x damage)
- **Generic evaluator** applies all relevant effects from equipped items and active buffs
- **Legacy compatibility** layer enables gradual migration of existing traits/qualities

**Design Principles:**
1. Modifiers declare their effects, not services (data-driven)
2. Services use generic evaluators to apply all relevant effects
3. New modifiers = just data, no code changes required
4. Supports future complexity (abilities, stacking rules, conditional effects)

**Integration Status:**
- ✅ Combat: Damage, armor, evasion, crit chance, attack speed (Phase 1)
- ✅ Activities: Duration, XP gain, yield bonuses (Phase 2)
- ✅ Crafting: Quality bonuses, success rates, yield multipliers (Phase 3)
- ✅ Vendor: Sell/buy price modifiers (Phase 4)

**New Condition Types:**
- ITEM_REQUIRED_FOR_ACTIVITY: Tools only apply bonuses when actually being used

**Migrated Traits:**
- Balanced (tool/weapon): -1/-2/-4 seconds activity time (conditional on item being required)
- Hardened (weapon): +2/+4/+7 flat damage
- Reinforced (armor): +armor bonuses

**Item Inspection System:**
- GET `/api/inventory/inspect/:instanceId` - Detailed item stats with all effect bonuses
- GET `/api/inventory/compare/:instanceId1/:instanceId2` - Side-by-side item comparison
- `evaluateSingleItemEffects()` - Preview item effects without equipping
- Enhanced item details panel shows all applicable effects

**Key Files:**
- Effect Evaluator: [be/services/effectEvaluator.ts](be/services/effectEvaluator.ts)
- Type Definitions: [shared/types/effect-system.ts](shared/types/effect-system.ts)
- Combat Integration: [be/services/combatService.ts](be/services/combatService.ts) ~L259, ~L493
- Activity Integration: [be/sockets/activityHandler.ts](be/sockets/activityHandler.ts) ~L275
- Crafting Integration: [be/services/recipeService.ts](be/services/recipeService.ts) ~L180
- Vendor Integration: [be/services/vendorService.ts](be/services/vendorService.ts) ~L95
- Item Inspection: [be/controllers/inventoryController.ts](be/controllers/inventoryController.ts) ~L370

**Full Documentation:**
- [046-modifier-audit-and-consolidation.md](project/docs/046-modifier-audit-and-consolidation.md)
- [047-data-driven-effect-system-implementation.md](project/docs/047-data-driven-effect-system-implementation.md)
- [048-creating-traits-and-affixes-guide.md](project/docs/048-creating-traits-and-affixes-guide.md)
- [049-phase-1-combat-integration-complete.md](project/docs/049-phase-1-combat-integration-complete.md)
- [050-phase-2-activity-integration-complete.md](project/docs/050-phase-2-activity-integration-complete.md)
- [051-effect-system-complete.md](project/docs/051-effect-system-complete.md)

## Vendor/NPC Trading System

Buy tools and sell resources at gathering locations

**Quick Facts:**
- Buy prices: Fixed per vendor | Sell prices: 50% of base (+ quality/trait bonuses)
- Infinite vendor stock (architecture supports limited)
- Drag-and-drop selling from inventory

**Key Files:** [vendorService.ts](be/services/vendorService.ts), [VendorRegistry.ts](be/data/vendors/VendorRegistry.ts)

## Cooking/Crafting System

Create items from ingredients with quality inheritance and Socket.io real-time updates

**Quick Facts:**
- Skills: Cooking (4 recipes), Smithing (16 recipes), Alchemy (10 recipes)
- Potion naming: Medieval alchemy categories (Tincture/Draught/Elixir instead of Weak/Minor/Strong)
- Trait combination: multi-ingredient recipes combine all traits at maximum levels from any ingredient
- Instance selection (choose specific items by quality/traits)
- Quality inheritance: max ingredient quality + skill bonus (every 10 levels = +1, max +2)
- Subcategory ingredients ("any herb" instead of specific itemIds)
- Recipe unlock system (progressive discovery)
- Auto-restart after completion
- Activity log component: reusable component displays recent crafting completions with items and XP

**Key Files:** [recipeService.ts](be/services/recipeService.ts), [RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts), [craftingHandler.ts](be/sockets/craftingHandler.ts)
**Socket Events:** `crafting:start`, `crafting:started`, `crafting:completed`, `crafting:cancelled`

**Alchemy Trait System:**
Herbs carry special effect traits that transfer to crafted potions:
- **Restorative** (Chamomile): +5/10/15 HP per tick HoT effect (3 levels)
- **Empowering** (Dragon's Breath, Mandrake Root, Moonpetal): +20%/30%/40% damage buff for 30s
- **Invigorating** (Nettle): +15%/25%/35% attack speed buff for 45s
- **Warding** (Sage): +50/100/150 flat armor buff for 60s

**Trait Combination Logic:**
When crafting with multiple ingredients, all traits from all ingredients are combined, taking the maximum level for each trait type:
- Ingredient A (Restorative 2) + Ingredient B (Empowering 3) → Output (Restorative 2 + Empowering 3)
- Ingredient A (Restorative 2) + Ingredient B (Restorative 1) → Output (Restorative 2)

This allows complex potion effects when combining different herbs. Higher trait levels (determined by herb quality during gathering) result in stronger effects when consumed in combat.

**Full Documentation:** [project/docs/020-alchemy-subcategory-implementation.md](project/docs/020-alchemy-subcategory-implementation.md), [project/docs/037-herb-trait-mapping.md](project/docs/037-herb-trait-mapping.md)

## Storage System (Bank, Guild Storage, Housing)

Container-based item storage system using WebSocket real-time communication. Supports multiple storage types: bank, future guild storage, and player housing.

**Quick Facts:**
- **Real-time WebSocket communication** (replaces HTTP polling)
- **Bulk deposit operations** - single WebSocket event instead of N HTTP requests
- 200-slot capacity per bank container (expandable per container type)
- Container abstraction for multiple storage types (bank, guild, housing)
- Automatic stacking with matching items (same itemId + qualities + traits)
- Cannot deposit equipped items
- Weight capacity validation on withdrawal
- Drag-and-drop UI with category filters and search
- Dual-pane modal (storage on left, inventory on right)
- **Real-time multi-user updates** - see items appear/disappear as others interact (guild storage)
- Room-based WebSocket subscriptions per container
- Migration: 016-add-storage-containers.js initializes bank for all players

**Key Files:**
- Storage Service: [storageService.ts](be/services/storageService.ts)
- Storage Controller: [storageController.ts](be/controllers/storageController.ts) - HTTP endpoints for backward compatibility
- Storage Routes: [storage.ts](be/routes/storage.ts)
- Storage Handler: [storageHandler.ts](be/sockets/storageHandler.ts) - WebSocket events
- Storage Service (Frontend): [storage.service.ts](ui/src/app/services/storage.service.ts)
- Bank Component: [bank.component.ts](ui/src/app/components/game/bank/bank.component.ts), [bank.component.html](ui/src/app/components/game/bank/bank.component.html)
- Bank Facility: [BankFacility.ts](be/data/locations/facilities/BankFacility.ts)

**WebSocket Events:**
- `storage:getItems` - Get container items
- `storage:deposit` - Deposit single item
- `storage:withdraw` - Withdraw single item
- `storage:bulkDeposit` - Deposit multiple items (batch operation)
- `storage:join` / `storage:leave` - Subscribe/unsubscribe to container updates
- `storage:items` / `storage:deposited` / `storage:withdrawn` - Success responses
- `storage:itemAdded` / `storage:itemRemoved` - Real-time updates from other users
- `storage:bulkUpdate` - Notification of bulk operations
- `storage:error` - Error responses

**Legacy HTTP Endpoints** (backward compatibility):
- GET `/api/storage/items/:containerId` - Get container items
- POST `/api/storage/deposit` - Deposit item (requires containerId in body)
- POST `/api/storage/withdraw` - Withdraw item (requires containerId in body)
- GET `/api/storage/capacity/:containerId` - Get container capacity
- GET `/api/storage/bank/items` - Legacy bank-specific endpoint

**Player Model Methods** ([Player.ts](be/models/Player.ts)):
- `getContainer(containerId)` ~L965 - Get storage container by ID
- `getContainerItems(containerId)` ~L977 - Get all items in container
- `depositToContainer(containerId, instanceId, quantity)` ~L1005 - Deposit with stacking
- `withdrawFromContainer(containerId, instanceId, quantity)` ~L1077 - Withdraw to inventory

**Container Schema** (Player model ~L242-263):
```typescript
storageContainers: [{
  containerId: string,      // 'bank', future: 'house-bedroom-001'
  containerType: string,    // 'bank', future: 'house-storage'
  name: string,             // 'Bank', 'Bedroom Chest'
  capacity: number,         // 200 for bank
  items: InventoryItem[]    // Same structure as inventory
}]
```

**Future Expansion:**
- Player housing with construction skill
- Multiple container types (chests, wardrobes, vaults)
- Per-location container instances
- Upgradeable capacity via construction levels

## Combat System

Turn-based combat with abilities, buffs/debuffs, and real-time Socket.io events

**Quick Facts:**
- 5 monsters, 10 abilities (6 damage + 4 buff/debuff)
- Turn-based with weapon speed intervals
- Timestamp-based cooldowns, consumable items with trait-based effects, combat restart
- Potions apply buffs/HoTs based on inherited traits (damage, attack speed, armor, healing over time)
- Damage formula: base + skill + equipment + buffs (with crit/dodge)
- Loot drops via drop tables

**Key Files:** [combatService.ts](be/services/combatService.ts), [combatHandler.ts](be/sockets/combatHandler.ts), [MonsterRegistry.ts](be/data/monsters/MonsterRegistry.ts), [AbilityRegistry.ts](be/data/abilities/AbilityRegistry.ts)
**Socket Events:** `combat:attack`, `combat:useAbility`, `combat:victory`, `combat:defeat`

**Full Documentation:** [project/docs/017-combat-system.md](project/docs/017-combat-system.md)

## World Map System

Interactive SVG-based world map with location discovery and travel functionality.

**Quick Facts:**
- SVG rendering with custom paths and viewBox
- Interactive location markers with hover states
- Discovered/undiscovered location visualization
- Current location highlighting
- Click-to-travel functionality
- Responsive design with smooth animations
- Biome-based location grouping

**Technical Implementation:**
- Standalone Angular component: [world-map.ts](ui/src/app/components/game/world-map/world-map.ts)
- Location coordinates stored in location definitions
- Backend API endpoint: `/api/locations/coordinates`
- Material Symbols icons for location markers
- Modal overlay with CSS Grid layout

**Location Coordinates:**
- Kennik: (30, 50) - Starting village
- Forest Clearing: (20, 35) - Gathering location
- Goblin Village: (55, 25) - Combat area
- Mountain Pass: (70, 60) - Mining location

**UI Integration:**
- "World Map" button in location facility list
- Modal overlay for full-screen map display
- Seamless integration with existing travel system

**Key Files:**
- Frontend Component: [world-map.ts](ui/src/app/components/game/world-map/world-map.ts), [world-map.html](ui/src/app/components/game/world-map/world-map.html), [world-map.scss](ui/src/app/components/game/world-map/world-map.scss)
- Backend Route: [be/routes/locations.ts](be/routes/locations.ts) `/coordinates` endpoint
- Location Types: [shared/types/locations.ts](shared/types/locations.ts) - Added `coordinates` field

## Quest System

Comprehensive quest system with objective tracking, auto-accept mechanics, and WebSocket real-time updates for seamless player progression.

**Quick Facts:**
- Tutorial quest chain (5 quests) + optional side quests (7 quests)
- Auto-accept mechanics for tutorial quests (seamless onboarding)
- Real-time progress updates via Socket.io
- Objective types: GATHER, CRAFT, EQUIP, DEFEAT, VISIT, LEVEL_UP
- Quest prerequisites and unlocking system
- Gold and XP rewards on completion
- Toast-style notifications for quest events

**Quest Structure:**
- Quest Registry: [QuestRegistry.ts](be/data/quests/QuestRegistry.ts)
- Tutorial quests: [definitions/tutorial/](be/data/quests/definitions/tutorial/)
- Optional quests: [definitions/optional/](be/data/quests/definitions/optional/)

**Tutorial Chain:**
1. Welcome to Kennik (auto-accept on first login)
2. Into the Woods (gather oak logs)
3. Herb Gathering 101 (gather chamomile)
4. First Catch (catch cod)
5. Healing Hands (craft healing potion)

**Optional Quests:**
- First Blood (defeat 5 monsters)
- Tool Time (equip a tool)
- Ore You Ready (mine 10 ore)
- Fully Equipped (equip 5 items)
- Sharpening Your Skills (reach level 5 in any skill)
- Culinary Basics (cook 5 meals)
- Alchemist's Apprentice (craft 3 potions)

**Technical Implementation:**
- Quest service: [questService.ts](be/services/questService.ts) - Quest logic and objective tracking
- Quest controller: [questController.ts](be/controllers/questController.ts) - Quest state management
- Quest handler: [questHandler.ts](be/sockets/questHandler.ts) - WebSocket real-time events
- Quest types: [shared/types/quests.ts](shared/types/quests.ts)
- Player quest schema: activeQuests (Array), completedQuests (Array of questIds)

**Quest Objective Tracking:**
- Automatic progress updates when players perform actions
- Location service integration for activity/crafting/combat completions
- Inventory service integration for equipment changes
- Real-time notifications via notification service

**UI Components:**
- Quest Tracker: [quest-tracker/](ui/src/app/components/game/quest-tracker/) - Compact quest display in game view
- Quest Journal: [quest-journal/](ui/src/app/components/game/quest-journal/) - Full quest list with filters
- Notification Display: [notification-display/](ui/src/app/components/shared/notification-display/) - Toast notifications

**Socket Events:**
- `quest:getActive` - Fetch active quests
- `quest:getAvailable` - Fetch available quests
- `quest:getCompleted` - Fetch completed quests
- `quest:accept` - Accept a quest
- `quest:abandon` - Abandon a quest
- `quest:turnIn` - Turn in completed quest for rewards
- `quest:progressUpdated` - Real-time progress update
- `quest:completed` - Quest completion notification
- `quest:newAvailable` - New quest became available

**Migration:**
- 020-add-quest-system.js: Initializes quest state for existing players, auto-accepts tutorial quests

**Full Documentation:**
- [055-quest-system-design.md](project/docs/055-quest-system-design.md) - Architecture and design
- [053-quest-system-testing-guide.md](project/docs/053-quest-system-testing-guide.md) - Testing guide

## Next Steps / Ideas

See `project/journal.md` for detailed development possibilities including:
- Quest system with narrative progression
- Item enchantments with affix system
- Trading and auction house
- Real-time multiplayer features (party system, PvP)
- Advanced world map features (fog of war, region unlocks)
- Player housing with construction skill
- Guild system with shared storage and activities

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

**Shared Constants Architecture**:
Constants are now centralized in `shared/constants/` for use by both frontend and backend. Backend files in `be/data/constants/` re-export from shared for backward compatibility.

**Item Constants** ([shared/constants/item-constants.ts](shared/constants/item-constants.ts)):
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

**Combat Constants** ([be/data/constants/combat-constants.ts](be/data/constants/combat-constants.ts)):
Centralized combat formulas and balance tuning constants:

```typescript
export const COMBAT_FORMULAS = {
  // Armor System
  ARMOR_SCALING_FACTOR: 1000,        // armor / (armor + X)

  // Evasion System
  EVASION_SCALING_FACTOR: 1000,
  EVASION_CAP: 0.75,                 // 75% max dodge

  // Damage System
  CRIT_MULTIPLIER: 2.0,              // 2x damage on crit
  MIN_DAMAGE: 1,

  // Level Scaling
  SKILL_BONUS_PER_LEVELS: 10,        // +1 damage per 10 levels
  SKILL_BONUS_MAX: 2,
  ATTR_BONUS_PER_LEVELS: 10,
  ATTR_BONUS_MAX: 2,

  // Attack Speed
  ATTACK_SPEED_TO_MS: 1000,          // seconds to milliseconds

  // Passive Triggers
  BATTLE_FRENZY_HP_THRESHOLD: 0.5    // 50% HP
} as const;
```

**Combat Enums** ([shared/types/combat-enums.ts](shared/types/combat-enums.ts)):
Type-safe enums for combat properties:

```typescript
export enum BuffableStat {
  ARMOR = 'armor',
  EVASION = 'evasion',
  DAMAGE = 'damage',
  CRIT_CHANCE = 'critChance',
  ATTACK_SPEED = 'attackSpeed',
  HEALTH_REGEN = 'healthRegen',
  MANA_REGEN = 'manaRegen'
}

export enum ModifierType {
  FLAT = 'flat',           // +10 armor
  PERCENTAGE = 'percentage', // +20% damage
  MULTIPLIER = 'multiplier'  // 2x damage
}
```

**Benefits**:
- ✅ Single file to tune all combat formulas
- ✅ Self-documenting game mechanics
- ✅ Autocomplete for stat names (prevents typos)
- ✅ Easy balance changes without code hunting
- ✅ Type-safe modifier types and passive triggers

**Usage in Combat Service**:
```typescript
import { COMBAT_FORMULAS } from '../data/constants/combat-constants';

// Before: return armor / (armor + 1000);
// After:
return armor / (armor + COMBAT_FORMULAS.ARMOR_SCALING_FACTOR);
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
- Path aliases: `@shared/*` → `../shared/*`, `@shared/types` → `../shared/types/index`, `@shared/constants/*` → `../shared/constants/*`
- Runtime resolution: tsconfig-paths package (registered in be/index.ts)
- Strict mode: Disabled (gradual migration)
- Declaration files: Enabled (.d.ts generation)
- Source maps: Enabled
- Allows JavaScript: Yes (hybrid codebase)
- Output: Compiled files in `be/dist/`

**tsconfig-paths Setup**:
- Package: tsconfig-paths@4.2.0 (dev dependency)
- Registered in be/index.ts before other imports
- Enables clean imports: `import { COMBAT_FORMULAS } from '@shared/constants/combat-constants'`
- All npm scripts use `-r tsconfig-paths/register` flag for ts-node

**Frontend tsconfig.app.json**: Angular TypeScript settings
- Extends base tsconfig.json
- Path aliases: `@shared/*` → `../shared/*`
- Enables clean imports across frontend components

**Shared Types Build**:
- Compiled to JavaScript with declaration files
- Source maps for debugging
- Used as dependency by both frontend and backend

## Deployment Architecture

The game is deployed using AWS infrastructure with Cloudflare proxy for SSL/TLS and CDN:

**Production URL**: https://clearskies.juzi.dev
**API Endpoint**: https://api.juzi.dev

### Frontend
- **S3 Bucket**: `clearskies-frontend-dev` (US East 1) - Static website hosting
- **Cloudflare Proxy**: `clearskies.juzi.dev` → S3 endpoint (enables SSL/TLS + CDN)
- **Content**: Angular production build (`ui/dist/ui/browser/*`)
- **Environments**:
  - Development: `environment.ts` → `http://localhost:3000/api`
  - EC2 Production: `environment.prod.ts` → `http://3.226.72.134:3000/api`
  - Cloudflare Production: `environment.cloudflare.ts` → `https://api.juzi.dev/api`

**Deployment Process**:
1. Build for Cloudflare: `cd ui && npm run build:cloudflare`
2. Upload to S3: Upload all files from `ui/dist/ui/browser/` to bucket root
3. Access at: https://clearskies.juzi.dev

### Backend
- **EC2 Instance**: Amazon Linux 2023 on t2.micro (3.226.72.134)
- **Cloudflare Proxy**: `api.juzi.dev` → EC2:3000 (enables SSL/TLS + DDoS protection)
- **Services**: Node.js 20.x, MongoDB, PM2 process manager
- **API Port**: 3000 (exposed via security group)

**CORS Configuration** ([be/index.ts](be/index.ts)):
```typescript
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://clearskies-frontend-dev.s3-website-us-east-1.amazonaws.com',
    'http://clearskies.juzi.dev',
    'https://clearskies.juzi.dev'
  ],
  credentials: true
}));
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

### Cloudflare Configuration
- **DNS Records**:
  - `clearskies.juzi.dev` (CNAME) → S3 website endpoint (proxied, SSL enabled)
  - `api.juzi.dev` (A) → 3.226.72.134 (proxied, SSL enabled)
- **Features**: Free SSL/TLS certificates, DDoS protection, CDN caching, analytics
- **Detailed Setup**: See [project/docs/024-cloudflare-custom-domain-setup.md](project/docs/024-cloudflare-custom-domain-setup.md)

### Deployment Guides
- **Architecture Diagram**: [project/docs/025-architecture-diagram.md](project/docs/025-architecture-diagram.md) - Visual infrastructure overview
- **AWS Setup**: [project/docs/026-aws-deployment-guide.md](project/docs/026-aws-deployment-guide.md) - Complete EC2 and S3 deployment
- **Cloudflare Setup**: [project/docs/024-cloudflare-custom-domain-setup.md](project/docs/024-cloudflare-custom-domain-setup.md) - Custom domain with SSL/TLS
- **Quick Deploy**: `cd ui && npm run deploy` - Automated build and S3 upload with cache invalidation

### Future Enhancements
- **Auto-scaling**: Configure EC2 auto-scaling groups for high traffic
- **Monitoring**: CloudWatch metrics for API performance and error tracking
- **CDN Optimization**: Cloudflare cache rules for static assets

