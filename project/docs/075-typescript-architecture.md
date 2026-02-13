# TypeScript Architecture

## Overview

ClearSkies uses a comprehensive TypeScript type system with shared types between frontend and backend, eliminating duplicate definitions and ensuring type consistency across the stack.

## Shared Type System (@shared/types)

**IMPORTANT**: Type definitions are centralized in the `shared/types/` directory and used by both frontend and backend via `@shared/types` path alias. This is the single source of truth for all game data types.

### Benefits

- ✅ Single source of truth - types defined once, used everywhere
- ✅ Zero type drift between frontend and backend
- ✅ Compile-time validation across entire stack
- ✅ Clean imports without complex relative paths
- ✅ Better refactoring - rename types across all code
- ✅ IDE autocomplete works consistently everywhere

### Shared Type Files

**Location**: [shared/types/](../../shared/types/)

- [common.ts](../../shared/types/common.ts) - Base types (Rarity, Stats, Skill, IconConfig, ItemInstance)
- [items.ts](../../shared/types/items.ts) - Item hierarchy (Item, EquipmentItem, WeaponItem, ArmorItem, ConsumableItem, ResourceItem)
- [combat.ts](../../shared/types/combat.ts) - Combat system (Monster, Ability, ActiveCombat, CombatStats)
- [locations.ts](../../shared/types/locations.ts) - Locations (Location, Facility, Activity, DropTable, Biome)
- [crafting.ts](../../shared/types/crafting.ts) - Crafting (Recipe, Vendor, ActiveCrafting)
- [guards.ts](../../shared/types/guards.ts) - Type guard functions (isWeaponItem, isEquipmentItem, etc.)
- [models.ts](../../shared/types/models.ts) - Frontend model types
- [index.ts](../../shared/types/index.ts) - Central export file

### Usage Pattern

```typescript
// Both frontend and backend use same import
import { Item, Monster, Activity, isWeaponItem } from '@shared/types';
```

### Type System Migration Status

- ✅ **Backend**: All imports use `@shared/types` directly (260+ files migrated)
- ✅ **Backend**: Legacy `be/types/` directory removed (1,040 lines eliminated)
- ✅ **Frontend**: Model re-exports cleaned up (components import directly from @shared/types)
- ✅ **Frontend**: Crafting components migrated to direct imports (4 components updated)
- ✅ Complete stack-wide type consistency with zero duplicate definitions

## TypeScript Data Layer Migration

**IMPORTANT**: All game data (items, locations, activities, drop tables, recipes, monsters, abilities, vendors) has been migrated from JSON to TypeScript modules with centralized registries.

### Benefits

- ✅ Compile-time validation of all game data
- ✅ IDE autocomplete for item properties, stats, abilities
- ✅ Type safety prevents invalid references (e.g., misspelled itemIds)
- ✅ Centralized registries for easy data management
- ✅ Better refactoring support (rename symbols across all files)
- ✅ Runtime TypeScript loading via ts-node/register

### Registry Pattern

Each game system has a central registry that exports all definitions:

- `ItemRegistry.ts` - 95+ items (resources, equipment, consumables)
- `LocationRegistry.ts` - All locations with biomes and facilities
- `ActivityRegistry.ts` - 20+ gathering/combat/crafting activities
- `DropTableRegistry.ts` - 20+ loot tables for activities
- `RecipeRegistry.ts` - Cooking, smithing, and alchemy recipes
- `MonsterRegistry.ts` - Combat monsters with stats
- `AbilityRegistry.ts` - Combat abilities with damage formulas
- `VendorRegistry.ts` - NPC merchants and their stock
- `QualityRegistry.ts` - 7 quality types with 5 levels each
- `TraitRegistry.ts` - 13 trait types with escalating effects
- `QuestRegistry.ts` - Tutorial and optional quests

### Creating New Content

1. Create TypeScript module in appropriate directory (e.g., `be/data/items/definitions/resources/NewItem.ts`)
2. Import types from `@shared/types` and constants from `shared/constants/item-constants`
3. Export const with strongly-typed object (e.g., `export const NewItem: ResourceItem = {...}`)
4. Use type-safe constants (CATEGORY, SUBCATEGORY, RARITY, etc.) instead of magic strings
5. Import and register in appropriate registry (e.g., add to `ItemRegistry.ts`)
6. TypeScript compiler validates structure at build time
7. Services automatically load from registries at runtime

## Type-Safe Constants System

### Shared Constants Architecture

Constants are centralized in `shared/constants/` for use by both frontend and backend. Backend files in `be/data/constants/` re-export from shared for backward compatibility.

### Item Constants

**Location**: [shared/constants/item-constants.ts](../../shared/constants/item-constants.ts)

All item definitions use type-safe constants to eliminate magic strings and enable autocomplete:

#### Available Constants

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

#### Usage in Item Definitions

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

#### Usage in Recipes

```typescript
import { SUBCATEGORY } from '../../../constants/item-constants';

ingredients: [
  { subcategory: SUBCATEGORY.HERB, quantity: 2 }  // Type-safe subcategory matching
]
```

### Combat Constants

**Location**: [be/data/constants/combat-constants.ts](../../be/data/constants/combat-constants.ts)

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

#### Combat Enums

**Location**: [shared/types/combat-enums.ts](../../shared/types/combat-enums.ts)

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

#### Benefits

- ✅ Single file to tune all combat formulas
- ✅ Self-documenting game mechanics
- ✅ Autocomplete for stat names (prevents typos)
- ✅ Easy balance changes without code hunting
- ✅ Type-safe modifier types and passive triggers

#### Usage in Combat Service

```typescript
import { COMBAT_FORMULAS } from '../data/constants/combat-constants';

// Before: return armor / (armor + 1000);
// After:
return armor / (armor + COMBAT_FORMULAS.ARMOR_SCALING_FACTOR);
```

### Attribute Constants

**Location**: [shared/constants/attribute-constants.ts](../../shared/constants/attribute-constants.ts)

HP/MP/capacity scaling formulas and XP curve definitions:

```typescript
export const ATTRIBUTE_FORMULAS = {
  HP: {
    BASE: 10,
    STRENGTH_MULTIPLIER: 3,
    ENDURANCE_MULTIPLIER: 2,
    WILL_MULTIPLIER: 1
  },
  MP: {
    BASE: 10,
    WISDOM_MULTIPLIER: 6,
    WILL_MULTIPLIER: 3
  },
  CARRY_CAPACITY: {
    BASE: 50,
    STRENGTH_MULTIPLIER: 2,
    ENDURANCE_MULTIPLIER: 1
  }
} as const;

export const XP_CURVE = {
  TIERS: [
    { minLevel: 1, maxLevel: 10, xpPerLevel: 100 },
    { minLevel: 11, maxLevel: 20, xpPerLevel: 500 },
    { minLevel: 21, maxLevel: 30, xpPerLevel: 1500 },
    { minLevel: 31, maxLevel: 40, xpPerLevel: 3000 },
    { minLevel: 41, maxLevel: 50, xpPerLevel: 5000 }
  ]
} as const;
```

## Architecture

### Typed Services

All use `@shared/types`:

- [itemService.ts](../../be/services/itemService.ts) - Item management with full type annotations
- [combatService.ts](../../be/services/combatService.ts) - Combat calculations with typed monsters/abilities
- [locationService.ts](../../be/services/locationService.ts) - Location/activity system with type safety
- [recipeService.ts](../../be/services/recipeService.ts) - Recipe management with typed ingredients/outputs
- [vendorService.ts](../../be/services/vendorService.ts) - Vendor transactions with typed stock

### Frontend Models

**Cleaned up, minimal re-exports**:

- [inventory.model.ts](../../ui/src/app/models/inventory.model.ts) - ItemIcon alias for semantic clarity
- [location.model.ts](../../ui/src/app/models/location.model.ts) - Frontend-specific Activity interface only
- [recipe.model.ts](../../ui/src/app/models/recipe.model.ts) - ActiveCrafting interface only (no re-exports)
- [vendor.model.ts](../../ui/src/app/models/vendor.model.ts) - Vendor-related frontend types

**Note**: Components import shared types directly from `@shared/types`, not through model files.

## Features

✅ **Shared type system** - Single source of truth for frontend/backend types
✅ **Type-safe constants** - CATEGORY, SUBCATEGORY, RARITY for all 95+ item definitions
✅ **70+ TypeScript interfaces** covering all game systems
✅ **Type guards** for runtime type narrowing (`isWeaponItem`, `isEquipmentItem`)
✅ **Path aliases** - Clean imports with `@shared/types`
✅ **100% backward compatible** - works alongside existing JavaScript
✅ **Compile-time validation** - catches errors before runtime
✅ **IDE support** - IntelliSense, autocomplete, jump-to-definition
✅ **Declaration files** (.d.ts) generated for external use
✅ **Source maps** for debugging TypeScript code

## Build Commands

```bash
npm run build          # Compile TypeScript to JavaScript
npm run build:watch    # Watch mode for development
npm run type-check     # Type check without emitting files
```

## Usage Examples

### Using Shared Types

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

### Using Type-Safe Constants

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

### Type Guards

```typescript
import { isWeaponItem } from '@shared/types';

if (isWeaponItem(item)) {
  item.properties.damageRoll; // ✅ Autocomplete + type checking
  item.properties.armor;       // ❌ Compile error - weapons don't have armor
}
```

## Configuration

### Backend tsconfig.json

TypeScript compiler settings:

- Target: ES2020
- Module: CommonJS
- Path aliases: `@shared/*` → `../shared/*`, `@shared/types` → `../shared/types/index`, `@shared/constants/*` → `../shared/constants/*`
- Runtime resolution: tsconfig-paths package (registered in be/index.ts)
- Strict mode: Disabled (gradual migration)
- Declaration files: Enabled (.d.ts generation)
- Source maps: Enabled
- Allows JavaScript: Yes (hybrid codebase)
- Output: Compiled files in `be/dist/`

### tsconfig-paths Setup

- Package: tsconfig-paths@4.2.0 (dev dependency)
- Registered in be/index.ts before other imports
- Enables clean imports: `import { COMBAT_FORMULAS } from '@shared/constants/combat-constants'`
- All npm scripts use `-r tsconfig-paths/register` flag for ts-node

### Frontend tsconfig.app.json

Angular TypeScript settings:

- Extends base tsconfig.json
- Path aliases: `@shared/*` → `../shared/*`
- Enables clean imports across frontend components

### Shared Types Build

- Compiled to JavaScript with declaration files
- Source maps for debugging
- Used as dependency by both frontend and backend

## See Also

- [shared/types/](../../shared/types/) - Shared type definitions
- [shared/constants/](../../shared/constants/) - Shared constants
- [be/data/constants/README.md](../../be/data/constants/README.md) - Constants documentation
