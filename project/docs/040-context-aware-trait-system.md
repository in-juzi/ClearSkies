# Context-Aware Trait System

**Date**: 2025-01-14
**Status**: Completed
**Related Docs**: [039-quality-trait-system-redesign.md](039-quality-trait-system-redesign.md), [037-herb-trait-mapping.md](037-herb-trait-mapping.md), [020-alchemy-subcategory-implementation.md](020-alchemy-subcategory-implementation.md)

## Overview

The context-aware trait system solves two critical problems in the crafting and item generation pipeline:

1. **Validation Problem**: How to allow trait inheritance during crafting (herbs → potions) while preventing invalid traits from appearing on dropped items
2. **Display Problem**: How to show semantically appropriate trait names based on item context (e.g., "Restorative" on herbs vs "Regeneration" on potions)

This system implements a dual-context approach: items created through different means (random drops, crafting, admin tools) use different validation rules, and traits display different names/descriptions based on the item category they appear on.

## Design Rationale

### The Core Challenge

Before this system, we faced a conflict:
- **Crafting needs**: "Use any herb → inherit its traits to potions" (flexible, player-driven)
- **Item validation needs**: "Potions should only have specific allowed traits" (prevents nonsense like 'Hardened Potion')
- **UI semantics needs**: "Don't show herb-specific trait names on potions" (confusing to see 'Restorative Potion')

### Why Two Systems?

**Option Considered**: Simply expand `allowedTraits` on potions to include all alchemy traits
- ❌ Problem: Boss-dropped potions would randomly get powerful effect traits (unbalanced)
- ❌ Problem: No way to control loot tables (everything gets same trait pool)

**Chosen Approach**: Context-aware validation + context-aware display
- ✅ Crafted potions: Validate against trait `applicableCategories` (permissive)
- ✅ Dropped potions: Validate against item `allowedTraits` (strict)
- ✅ Display: Show category-appropriate names regardless of source

### Design Philosophy

**Semantic Model**:
- `allowedTraits` = "What traits can this item **randomly receive**?" (for drops, gathering)
- `applicableCategories` = "What item categories can this trait **exist on**?" (for crafting, transfers)
- `context` parameter = "How was this item created?" (determines which rule applies)

**Example**:
- Health Elixir from boss drop → Gets 'blessed' trait (random generation respects `allowedTraits`)
- Player crafts Health Elixir with Chamomile L2 → Gets 'restorative L2' (crafting respects `applicableCategories`)
- Both are valid potions, created through different means!

## Implementation Details

### 1. Context-Aware Validation

**File**: [itemService.ts](../../be/services/itemService.ts)

Added `context` parameter to `createItemInstance()`:

```typescript
createItemInstance(
  itemId: string,
  quantity: number = 1,
  qualities: QualityMap = {},
  traits: TraitMap = {},
  context: 'random' | 'crafted' | 'admin' = 'random'
): ItemInstance
```

**Validation Logic**:

```typescript
if (context === 'random') {
  // Strict: Only allow traits in item's allowedTraits
  this._validateTraitsAgainstAllowed(itemDef, traits);
} else if (context === 'crafted') {
  // Permissive: Allow any trait applicable to item category
  this._validateTraitsAgainstCategory(itemDef, traits);
}
// 'admin' context skips validation entirely
```

**Usage Examples**:

| Context | Usage Location | Validation Rule | Example |
|---------|---------------|-----------------|---------|
| `random` | Activity drops, combat loot, gathering | Strict (`allowedTraits`) | Gathering herbs, boss drops potions |
| `crafted` | Recipe outputs | Permissive (`applicableCategories`) | Crafting potions from herbs |
| `admin` | Dev utilities | None | `add-item.js` script |

### 2. Context-Aware Display

**Type Definition**: [shared/types/items.ts](../../shared/types/items.ts), [be/types/items.ts](../../be/types/items.ts)

Extended `TraitDefinition` interface:

```typescript
export interface TraitDefinition {
  traitId: string;
  name: string;
  nameByCategory?: Record<string, string>;      // Category-specific names
  shorthand: string;
  shorthandByCategory?: Record<string, string>; // Category-specific shorthand
  description: string;
  descriptionByCategory?: Record<string, string>; // Category-specific descriptions
  rarity: Rarity;
  applicableCategories: string[];
  maxLevel: number;
  levels: Record<string, TraitLevel>;
}
```

**Display Logic**: [itemService.ts:365-368](../../be/services/itemService.ts)

```typescript
// In getItemDetails()
const displayName = traitDef.nameByCategory?.[itemDef.category] || traitDef.name;
const displayShorthand = traitDef.shorthandByCategory?.[itemDef.category] || traitDef.shorthand;
const displayDescription = traitDef.descriptionByCategory?.[itemDef.category] || traitDef.description;
```

### 3. Alchemy Trait Updates

All four alchemy traits now support both resource and consumable categories:

| Trait | Herb Name | Potion Name | Effect When Consumed |
|-------|-----------|-------------|---------------------|
| [RestorativeTrait.ts](../../be/data/items/traits/definitions/RestorativeTrait.ts) | Restorative (RST) | Regeneration (RGN) | Health over Time (2/4/7 HP per tick) |
| [EmpoweringTrait.ts](../../be/data/items/traits/definitions/EmpoweringTrait.ts) | Empowering (EMP) | Strength (STR) | +10/20/35% damage for 30s |
| [InvigoratingTrait.ts](../../be/data/items/traits/definitions/InvigoratingTrait.ts) | Invigorating (INV) | Haste (HST) | +10/20/30% attack speed for 20s |
| [WardingTrait.ts](../../be/data/items/traits/definitions/WardingTrait.ts) | Warding (WRD) | Fortification (FRT) | +5/10/15 flat armor for 30s |

**Example - RestorativeTrait**:

```typescript
export const RestorativeTrait: Trait = {
  traitId: 'restorative',
  name: 'Restorative',
  nameByCategory: {
    resource: 'Restorative',
    consumable: 'Regeneration'
  },
  descriptionByCategory: {
    resource: 'Calming and healing properties that can be extracted through alchemy',
    consumable: 'Gradually restores health over time when consumed'
  },
  applicableCategories: [
    'resource',    // Can appear on herbs (gathering)
    'consumable'   // Can appear on potions (crafting)
  ],
  // ... rest of trait definition
}
```

### 4. Crafting Integration

**File**: [recipeService.ts:300-309](../../be/services/recipeService.ts)

Updated to use `'crafted'` context:

```typescript
const itemInstance = itemService.createItemInstance(
  output.itemId,
  output.quantity,
  output.qualities,
  output.traits,
  'crafted'  // Uses applicableCategories validation
);
```

This enables trait inheritance while maintaining type safety.

## Changes Made

### Type Definitions
- ✅ [shared/types/items.ts](../../shared/types/items.ts) - Added `nameByCategory`, `shorthandByCategory`, `descriptionByCategory`
- ✅ [be/types/items.ts](../../be/types/items.ts) - Backend compatibility layer

### Services
- ✅ [itemService.ts](../../be/services/itemService.ts):
  - Added `context` parameter to `createItemInstance()` (L200-245)
  - Added `_validateTraitsAgainstAllowed()` method (L248-266)
  - Added `_validateTraitsAgainstCategory()` method (L268-292)
  - Updated `getItemDetails()` to use context-aware display (L359-382)
- ✅ [recipeService.ts](../../be/services/recipeService.ts):
  - Updated crafting to use `'crafted'` context (L300-309)

### Trait Definitions
- ✅ [RestorativeTrait.ts](../../be/data/items/traits/definitions/RestorativeTrait.ts) - Added display variants, expanded `applicableCategories`
- ✅ [EmpoweringTrait.ts](../../be/data/items/traits/definitions/EmpoweringTrait.ts) - Added display variants, expanded `applicableCategories`
- ✅ [InvigoratingTrait.ts](../../be/data/items/traits/definitions/InvigoratingTrait.ts) - Added display variants, expanded `applicableCategories`
- ✅ [WardingTrait.ts](../../be/data/items/traits/definitions/WardingTrait.ts) - Added display variants, expanded `applicableCategories`

## Benefits

### 1. **Gameplay Flexibility**
- Players can experiment with any herb in alchemy recipes
- Traits naturally transfer from ingredients to products
- Emergent gameplay: discover which herbs provide which effects

### 2. **Balance Control**
- Loot tables remain tightly controlled (strict `allowedTraits`)
- Boss-dropped potions can't randomly get overpowered effect traits
- Prevents unintended trait combinations from appearing in world

### 3. **Semantic Clarity**
- Herbs show botanical quality names ("Restorative")
- Potions show mechanical effect names ("Regeneration")
- Same trait ID, different player-facing presentation

### 4. **Type Safety**
- Compile-time validation prevents invalid trait assignments
- Traits explicitly declare which categories they apply to
- Context parameter makes intent clear at call site

### 5. **Extensibility**
- Easy to add new contexts (quest rewards, vendor stock, etc.)
- Simple to add more category-specific display variants
- Trait definitions remain single source of truth for effects

## How It Works (Example Flow)

### Crafting a Health Elixir with Chamomile L2

1. **Player gathers Chamomile** (herb with Restorative L2 trait)
   - Context: `'random'` (gathering activity)
   - Validation: Checks `allowedTraits` on Chamomile definition
   - Display: Shows "Restorative" in inventory

2. **Player crafts Health Elixir** using Chamomile
   - Trait inheritance: Copies `restorative: 2` from Chamomile
   - Context: `'crafted'` (recipe output)
   - Validation: Checks RestorativeTrait's `applicableCategories` includes 'consumable' ✅
   - Creates potion with `{ traits: { restorative: 2 } }`

3. **Player views Health Elixir** in inventory
   - Backend: `getItemDetails()` looks up RestorativeTrait
   - Display logic: `nameByCategory['consumable']` → "Regeneration"
   - UI shows: "Regeneration L2" (not "Restorative L2")

4. **Player uses Health Elixir** in combat
   - Combat system: `getConsumableEffects()` reads trait
   - Effect lookup: RestorativeTrait L2 → `{ healPerTick: 4, ticks: 5, tickInterval: 3 }`
   - Result: +4 HP per turn for 5 turns (20 HP total over 15 seconds)

### Dropped Potion from Boss

1. **Boss defeated**, loot rolls on drop table
   - Drop result: `{ itemId: 'health_elixir' }`
   - Context: `'random'` (activity/combat loot)

2. **Item generation**: `generateRandomTraits('health_elixir')`
   - Checks: `allowedTraits: ['blessed']` on Health Elixir definition
   - Rolls: 2% chance for 'blessed' trait (rare trait)
   - Result: Potion has `{ traits: { blessed: 1 } }` or no traits

3. **Validation**: `createItemInstance()` with context `'random'`
   - ✅ 'blessed' is in `allowedTraits` → Valid
   - ❌ 'restorative' would fail (not in `allowedTraits`)

## Future Expansion

### Potential Enhancements

1. **More Display Variants**
   - Add equipment-specific names for crafting traits
   - Example: "Hardened" (weapon) → "Tempered" (armor)

2. **Additional Contexts**
   - `'quest_reward'`: Guaranteed traits for quest completion
   - `'vendor_stock'`: Curated trait pools for NPC merchants
   - `'enchanted'`: Post-creation trait application

3. **Category Hierarchies**
   - Support nested categories in `nameByCategory`
   - Example: `{ 'consumable.potion': 'Regeneration', 'consumable.food': 'Nourishing' }`

4. **Dynamic Trait Names**
   - Formula-based names (e.g., level affects name)
   - Example: L1 "Minor Regeneration", L3 "Greater Regeneration"

5. **Frontend Integration**
   - Item tooltip component uses context-aware display
   - Crafting preview shows how trait names transform
   - Recipe book shows "Herb (Restorative) → Potion (Regeneration)"

## Testing Checklist

- [ ] Gather herb with alchemy trait → Shows herb-appropriate name
- [ ] Craft potion with traited herb → Potion inherits trait
- [ ] View crafted potion → Shows potion-appropriate name
- [ ] Use crafted potion in combat → Applies correct effect
- [ ] Kill boss, loot potion → Only gets 'blessed' trait
- [ ] Attempt to craft with invalid trait → Validation error
- [ ] Check item details endpoint → Returns context-aware trait display
- [ ] Verify backend TypeScript compiles → No type errors
- [ ] Test with all 4 alchemy traits → All display correctly

## Related Documentation

- [039-quality-trait-system-redesign.md](039-quality-trait-system-redesign.md) - Quality/trait system overhaul
- [037-herb-trait-mapping.md](037-herb-trait-mapping.md) - Alchemy trait effects and herb assignments
- [020-alchemy-subcategory-implementation.md](020-alchemy-subcategory-implementation.md) - Alchemy crafting system
- [015-inventory-system.md](015-inventory-system.md) - Item architecture and trait mechanics
- [017-combat-system.md](017-combat-system.md) - Combat buffs and consumable effects

## Implementation Files

**Backend Core:**
- [be/services/itemService.ts](../../be/services/itemService.ts) - Context validation and display logic
- [be/services/recipeService.ts](../../be/services/recipeService.ts) - Crafting integration

**Type System:**
- [shared/types/items.ts](../../shared/types/items.ts) - Shared TraitDefinition interface
- [be/types/items.ts](../../be/types/items.ts) - Backend type compatibility

**Trait Definitions:**
- [be/data/items/traits/definitions/RestorativeTrait.ts](../../be/data/items/traits/definitions/RestorativeTrait.ts)
- [be/data/items/traits/definitions/EmpoweringTrait.ts](../../be/data/items/traits/definitions/EmpoweringTrait.ts)
- [be/data/items/traits/definitions/InvigoratingTrait.ts](../../be/data/items/traits/definitions/InvigoratingTrait.ts)
- [be/data/items/traits/definitions/WardingTrait.ts](../../be/data/items/traits/definitions/WardingTrait.ts)

**Loot Systems (use 'random' context):**
- [be/sockets/activityHandler.ts](../../be/sockets/activityHandler.ts) - Activity completion rewards
- [be/services/combatService.ts](../../be/services/combatService.ts) - Combat loot generation
