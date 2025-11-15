# Potion Naming Standardization

**Date**: 2025-11-14
**Status**: Completed

## Overview

Standardized all health and mana restoration potion names to follow an alchemical progression system that:
- Avoids negative adjectives (e.g., "weak", "minor")
- Uses medieval fantasy alchemical terminology
- Scales cleanly for future tier expansion
- Clearly distinguishes recipe files from item definitions

## Design Rationale

### Problem
Previous naming used adjectives that made items sound inferior:
- "Weak Health Potion" - sounds bad
- "Minor Mana Potion" - doesn't feel powerful
- Recipe files named identically to item exports (confusing)

### Solution
Adopted **alchemical progression** naming:
1. **Tincture** - Basic herb extraction (Tier 1)
2. **Draught** - Simple alchemical brew (Tier 1-2)
3. **Potion** - Refined alchemical work (Tier 2)
4. **Elixir** - Potent mixture (Tier 3)
5. **Philter** - Advanced alchemy (Tier 4, future)
6. **Panacea** - Masterwork healing (Tier 5, future)

Each tier name:
- ✅ Sounds progressively more powerful
- ✅ Fits medieval fantasy theme
- ✅ Has distinct alchemical flavor
- ✅ Educates players about alchemy terminology
- ✅ Avoids sounding "bad" or "inferior"

## Changes Made

### Item Definitions

**Health Potions**:
| Old ID | New ID | Old Name | New Name | HP | Tier |
|--------|--------|----------|----------|-----|------|
| `weak_health_potion` | `health_tincture` | Weak Health Tincture | Health Tincture | 20 | T1 |
| `health_potion_minor` | `health_draught` | Minor Health Potion | Health Draught | 35 | T1 |
| `health_potion` | `health_potion` | Health Potion | Health Potion | 50 | T2 |
| `strong_health_potion` | `health_elixir` | Strong Health Elixir | Health Elixir | 75 | T3 |

**Mana Potions**:
| Old ID | New ID | Old Name | New Name | MP | Tier |
|--------|--------|----------|----------|-----|------|
| `weak_mana_potion` | `mana_tincture` | Weak Mana Tincture | Mana Tincture | 20 | T1 |
| `mana_potion_minor` | `mana_draught` | Minor Mana Potion | Mana Draught | 35 | T1 |
| `mana_potion` | `mana_potion` | Mana Potion | Mana Potion | 50 | T2 |

### File Structure

**Item Definition Files** (`be/data/items/definitions/consumables/`):
```
HealthPotionWeak.ts    → HealthTincture.ts
HealthPotionMinor.ts   → HealthDraught.ts
HealthPotion.ts        → (unchanged)
HealthPotionStrong.ts  → HealthElixir.ts
ManaPotionWeak.ts      → ManaTincture.ts
ManaPotionMinor.ts     → ManaDraught.ts
ManaPotion.ts          → (unchanged)
```

**Recipe Files** (`be/data/recipes/alchemy/`) - Added "Recipe" suffix for clarity:
```
BasicHealthTincture.ts            → HealthTinctureRecipe.ts
EnhancedHealthPotion.ts           → HealthPotionRecipe.ts
ConcentratedVitalityElixir.ts     → HealthElixirRecipe.ts
BasicManaTincture.ts              → ManaTinctureRecipe.ts
EnhancedManaPotion.ts             → ManaPotionRecipe.ts
SageWardingTonic.ts               → WardingTonicRecipe.ts
NettleVigorDraught.ts             → VigorDraughtRecipe.ts
MandrakePowerElixir.ts            → PowerElixirRecipe.ts
DragonsFuryBrew.ts                → FuryBrewRecipe.ts
FloralRejuvenationDraught.ts      → FloralRejuvenationDraughtRecipe.ts
```

### Recipe Changes

**Updated Recipe IDs and References**:
- `basic_health_tincture` → `health_tincture`
- `enhanced_health_potion` → `health_potion`
- `concentrated_vitality_elixir` → `health_elixir`
- `basic_mana_tincture` → `mana_tincture`
- `enhanced_mana_potion` → `mana_potion`

**Updated Unlock Dependencies**:
- Health Potion recipe now requires `health_tincture` (was `basic_health_tincture`)
- Mana Potion recipe now requires `mana_tincture` (was `basic_mana_tincture`)

### Registry Updates

**ItemRegistry.ts** ([be/data/items/ItemRegistry.ts](../../be/data/items/ItemRegistry.ts)):
```typescript
// Old imports
import { HealthPotionWeak } from './definitions/consumables/HealthPotionWeak';
import { HealthPotionMinor } from './definitions/consumables/HealthPotionMinor';
import { HealthPotionStrong } from './definitions/consumables/HealthPotionStrong';

// New imports
import { HealthTincture } from './definitions/consumables/HealthTincture';
import { HealthDraught } from './definitions/consumables/HealthDraught';
import { HealthElixir } from './definitions/consumables/HealthElixir';

// Registry map updated accordingly
[HealthTincture.itemId, HealthTincture],
[HealthDraught.itemId, HealthDraught],
[HealthElixir.itemId, HealthElixir],
```

**RecipeRegistry.ts** ([be/data/recipes/RecipeRegistry.ts](../../be/data/recipes/RecipeRegistry.ts)):
```typescript
// Old imports
import { BasicHealthTincture } from './alchemy/BasicHealthTincture';
import { EnhancedHealthPotion } from './alchemy/EnhancedHealthPotion';

// New imports
import { HealthTinctureRecipe } from './alchemy/HealthTinctureRecipe';
import { HealthPotionRecipe } from './alchemy/HealthPotionRecipe';

// Registry map updated accordingly
[HealthTinctureRecipe.recipeId, HealthTinctureRecipe],
[HealthPotionRecipe.recipeId, HealthPotionRecipe],
```

## Future Expansion

The system is now ready for tier 4-5 potions:

**Tier 4 - Philter** (Advanced Alchemy):
```typescript
// Health Philter - 100 HP restoration
export const HealthPhilter: ConsumableItem = {
  itemId: 'health_philter',
  name: 'Health Philter',
  properties: { tier: TIER.T4, healthRestore: 100 }
  // ...
};
```

**Tier 5 - Panacea** (Masterwork Healing):
```typescript
// Health Panacea - 150+ HP restoration
export const HealthPanacea: ConsumableItem = {
  itemId: 'health_panacea',
  name: 'Health Panacea',
  properties: { tier: TIER.T5, healthRestore: 150 }
  // ...
};
```

## Benefits

1. **Positive Naming**: No items feel "weak" or "inferior"
2. **Scalability**: Clear path for 6+ tiers without awkward naming
3. **Thematic Consistency**: Medieval fantasy alchemical terminology
4. **Clear File Organization**: Recipe files explicitly labeled with "Recipe" suffix
5. **Educational**: Players learn real alchemical terms (tincture, draught, philter, panacea)
6. **Type Safety**: All changes maintain TypeScript compile-time validation

## Migration Notes

### Breaking Changes
- All old item IDs are invalid (e.g., `weak_health_potion` no longer exists)
- All old recipe IDs are invalid (e.g., `basic_health_tincture` no longer exists)
- Players with old items in inventory will need migration script (if applicable)

### Non-Breaking
- Export names changed but TypeScript will catch at compile time
- Recipe unlock chains updated to use new IDs
- All references in ItemRegistry and RecipeRegistry updated

## Testing Checklist

- [ ] Backend compiles without TypeScript errors
- [ ] ItemRegistry loads all new item definitions
- [ ] RecipeRegistry loads all new recipe definitions
- [ ] Recipe unlock chains work correctly (health_tincture → health_potion → health_elixir)
- [ ] Crafting outputs correct item IDs
- [ ] Item tooltips display correct names
- [ ] Alchemy skill recipes show in correct tier order

## Related Documentation

- [Alchemy Subcategory Implementation](./alchemy-subcategory-implementation.md) - Recipe system with subcategory ingredients
- [Herb Trait Mapping](./herb-trait-mapping.md) - How herb traits transfer to crafted potions
- [Inventory System](./inventory-system.md) - Item definitions and quality/trait system
- [Level-Based Quality/Trait System](./level-based-quality-trait-system.md) - 5-level quality, 3-level trait mechanics

## Implementation Files

**Item Definitions**:
- [HealthTincture.ts](../../be/data/items/definitions/consumables/HealthTincture.ts)
- [HealthDraught.ts](../../be/data/items/definitions/consumables/HealthDraught.ts)
- [HealthPotion.ts](../../be/data/items/definitions/consumables/HealthPotion.ts)
- [HealthElixir.ts](../../be/data/items/definitions/consumables/HealthElixir.ts)
- [ManaTincture.ts](../../be/data/items/definitions/consumables/ManaTincture.ts)
- [ManaDraught.ts](../../be/data/items/definitions/consumables/ManaDraught.ts)
- [ManaPotion.ts](../../be/data/items/definitions/consumables/ManaPotion.ts)

**Recipe Definitions**:
- [HealthTinctureRecipe.ts](../../be/data/recipes/alchemy/HealthTinctureRecipe.ts)
- [HealthPotionRecipe.ts](../../be/data/recipes/alchemy/HealthPotionRecipe.ts)
- [HealthElixirRecipe.ts](../../be/data/recipes/alchemy/HealthElixirRecipe.ts)
- [ManaTinctureRecipe.ts](../../be/data/recipes/alchemy/ManaTinctureRecipe.ts)
- [ManaPotionRecipe.ts](../../be/data/recipes/alchemy/ManaPotionRecipe.ts)

**Registries**:
- [ItemRegistry.ts](../../be/data/items/ItemRegistry.ts)
- [RecipeRegistry.ts](../../be/data/recipes/RecipeRegistry.ts)
