# SUBCATEGORY Constants Usage Guide

## Overview

The ClearSkies project now has two complementary subcategory constant systems:
- **`SUBCATEGORY`** (singular) - Individual string constants for type-safe matching
- **`SUBCATEGORIES`** (plural) - Preset arrays for convenient item definitions

Both are defined in [be/data/constants/item-constants.ts](../../be/data/constants/item-constants.ts).

## When to Use Each

### Use `SUBCATEGORY` (singular) for:
✅ Recipe ingredients with subcategory-based matching
✅ Frontend filtering/searching by subcategory
✅ Type guards and validation logic
✅ Any single subcategory value where type safety is critical

### Use `SUBCATEGORIES` (plural) for:
✅ Item definitions with common subcategory patterns
✅ Quick assignment of multiple related subcategories
✅ Consistency across similar item types

## Usage Examples

### Recipe Ingredients (Type-Safe)

**Best Practice:** Use `SUBCATEGORY` for recipe ingredients to prevent typos in critical matching logic.

```typescript
import { Recipe } from '../../../types';
import { SUBCATEGORY } from '../../constants/item-constants';

export const BasicHealthTincture: Recipe = {
  recipeId: 'basic_health_tincture',
  name: 'Basic Health Tincture',
  skill: 'alchemy',
  requiredLevel: 1,
  ingredients: [
    { subcategory: SUBCATEGORY.HERB, quantity: 2 }  // Type-safe!
  ],
  outputs: [
    { itemId: 'weak_health_potion', quantity: 1 }
  ]
};
```

**Why this matters:** Recipe ingredients use subcategory matching to find any item with that subcategory. A typo like `'hreb'` would silently fail at runtime, but using constants catches it at compile time.

### Item Definitions (Preset Arrays)

**Option 1:** Use preset `SUBCATEGORIES` for common patterns

```typescript
import { ResourceItem } from '../../../types';
import { SUBCATEGORIES, RARITY, TIER } from '../../constants/item-constants';

export const Sage: ResourceItem = {
  itemId: 'sage',
  name: 'Sage',
  category: 'resource',
  rarity: RARITY.COMMON,
  subcategories: SUBCATEGORIES.HERB,  // ['herb', 'plant', 'alchemy', 'medicine']
  properties: {
    tier: TIER.T1
  }
};
```

**Option 2:** Use individual `SUBCATEGORY` for custom combinations

```typescript
import { ResourceItem } from '../../../types';
import { SUBCATEGORY, RARITY, TIER } from '../../constants/item-constants';

export const Jasmine: ResourceItem = {
  itemId: 'jasmine',
  name: 'Jasmine',
  category: 'resource',
  rarity: RARITY.UNCOMMON,
  subcategories: [
    SUBCATEGORY.FLOWER,
    SUBCATEGORY.HERB,
    SUBCATEGORY.AROMATIC,
    SUBCATEGORY.DECORATIVE
  ],  // Custom combination
  properties: {
    tier: TIER.T1
  }
};
```

### Type Guards (Backend)

```typescript
import { Item } from './items';
import { SUBCATEGORY } from '../data/constants/item-constants';

export function isWeaponItem(item: Item): boolean {
  return (
    item.category === 'equipment' &&
    item.subcategories?.includes(SUBCATEGORY.WEAPON) === true
  );
}

export function isArmorItem(item: Item): boolean {
  return (
    item.category === 'equipment' &&
    item.subcategories?.includes(SUBCATEGORY.ARMOR) === true
  );
}
```

### Frontend Filtering

```typescript
import { SUBCATEGORY } from '../../constants/item-constants';

// Filter inventory by subcategory
getItemsBySubcategory(subcategory: string): ItemDetails[] {
  return this.inventory().filter(item =>
    item.definition.subcategories?.includes(subcategory)
  );
}

// Usage with constant
const herbs = this.inventoryService.getItemsBySubcategory(SUBCATEGORY.HERB);
```

### Recipe Service Validation

```typescript
import { SUBCATEGORY } from '../data/constants/item-constants';

// Count available items for subcategory ingredient
if (ingredient.subcategory) {
  totalQuantity = playerInventory
    .filter(item =>
      item.definition?.subcategories?.includes(ingredient.subcategory)
    )
    .reduce((sum, item) => sum + item.quantity, 0);
}
```

## Available Constants

See [item-constants.ts:148-219](../../be/data/constants/item-constants.ts#L148-L219) for the complete list.

### Primary Categories
`HERB`, `FLOWER`, `FISH`, `ORE`, `INGOT`, `GEMSTONE`, `WOOD`, `LOG`, `ROOT`

### Equipment Types
`WEAPON`, `ARMOR`, `TOOL`, `HEADGEAR`

### Item Properties
`ALCHEMICAL`, `MEDICINAL`, `AROMATIC`, `SEASONING`, `DECORATIVE`, `MAGICAL`, `RARE`

### Food Categories
`FOOD`, `COOKED`, `COOKING`, `COOKING_INGREDIENT`

### Crafting Skills
`CRAFTING`, `SMITHING`, `SMITHING_INGREDIENT`, `ALCHEMY`

### Consumable Types
`POTION`, `HEALING`, `MANA`, `TINCTURE`, `ELIXIR`, `CONSUMABLE`

### Monster Drops
`MONSTER_DROP`

### Water Types
`FRESHWATER`, `SALTWATER`, `SHELLFISH`

### Material Types
`METAL`, `MEDIUM_ARMOR`, `LIGHT_ARMOR`, `HEAVY_ARMOR`

### Other Categories
`PLANT`, `MEDICINE`, `FUEL`, `TIMBER`, `BUILDING_MATERIAL`, `CRYSTAL`, `JEWELRY`, `ENCHANTING`, `SALVAGE`, `CLOTH`

## Benefits

### Type Safety
✅ Compile-time validation of subcategory strings
✅ Prevents typos in recipe ingredients (critical for matching logic)
✅ IDE autocomplete when typing `SUBCATEGORY.`
✅ Refactoring support across entire codebase

### Consistency
✅ Single source of truth for subcategory values
✅ Matches existing pattern (CATEGORY, RARITY, TIER, etc.)
✅ Easy to see all available subcategories in one place

### Maintainability
✅ Adding new subcategories is centralized
✅ Can add JSDoc comments explaining each subcategory's purpose
✅ Future expansion is straightforward

## Migration Status

### ✅ Completed (High Priority)
- [x] Added `SUBCATEGORY` constants to item-constants.ts
- [x] Updated 6 alchemy recipe files to use constants
- [x] Updated type guards (isWeaponItem, isArmorItem, isToolItem)
- [x] Validation script passes with no errors

### 📋 Optional (Low Priority)
- [ ] Migrate 34 item definitions from raw strings to constants
- [ ] Export SUBCATEGORY to frontend Angular services
- [ ] Update frontend filtering logic to use constants consistently

Raw string arrays in item definitions still work fine and don't pose any risk. The critical type safety improvement was for recipe ingredients, which is now complete.

## Adding New Subcategories

When adding a new subcategory to the game:

1. **Add to `SUBCATEGORY` object** in [item-constants.ts](../../be/data/constants/item-constants.ts):
   ```typescript
   export const SUBCATEGORY = {
     // ... existing constants
     NEW_CATEGORY: 'new-category',
   } as const;
   ```

2. **Optionally add preset array** to `SUBCATEGORIES` if commonly used together:
   ```typescript
   export const SUBCATEGORIES = {
     // ... existing presets
     NEW_TYPE: ['new-category', 'related-category', 'another-category'],
   } as const;
   ```

3. **Use in recipes/items**:
   ```typescript
   ingredients: [
     { subcategory: SUBCATEGORY.NEW_CATEGORY, quantity: 1 }
   ]
   ```

## Validation

The validation script checks recipe ingredients against available items:

```bash
cd be && npm run validate
```

If a recipe uses `subcategory: SUBCATEGORY.HERB`, the validator ensures at least one item exists with `'herb'` in its subcategories array.

## Related Documentation

- [Item Constants System](../../be/data/constants/README.md) - Overview of all item constants
- [Alchemy Subcategory Implementation](./alchemy-subcategory-implementation.md) - Deep dive into subcategory-based recipes
- [Recipe System](../../be/data/recipes/README.md) - How recipes work
- [Inventory System](./inventory-system.md) - Item definitions and structure
