# Item Generation Probabilistic System

## Overview

This document describes the probabilistic item generation system implemented to reduce the number of qualities and traits on generated items, making plain items common and multi-quality/trait items feel special.

## Implementation Date

2025-01-11

## Problem Statement

Previously, ALL allowed qualities were assigned to every generated item (100% probability), and traits had relatively high appearance rates (common: 5%, uncommon: 15%, rare: 30%, epic: 50%). This resulted in:
- Every item having all possible qualities
- Relatively common trait occurrences
- No plain items
- High-quality items not feeling special
- Inflated vendor prices across the board

## Solution: Combined Approach

Implemented **Option 5 (Combined Approach)** with:
1. **Probabilistic quality count** - Items receive 0-N qualities based on configured distribution
2. **Reduced trait appearance rates** - Significantly lower probabilities for trait occurrence
3. **Configuration-based system** - JSON config file for easy balancing without code changes
4. **Tier-independent quality count** - Quality count not affected by item tier (as requested)
5. **Tier-based quality levels** - Level distribution still uses existing tier-based weights

## Changes Made

### 1. New Configuration File

**File**: `be/data/items/generation-config.json`

```json
{
  "qualityGeneration": {
    "countDistribution": {
      "0": 0.35,  // 35% plain items (no qualities)
      "1": 0.45,  // 45% items with 1 quality
      "2": 0.15,  // 15% items with 2 qualities
      "3": 0.05   // 5% items with 3+ qualities
    },
    "tierBasedLevels": true,
    "levelDamping": 0.6  // 0-1, shifts probability toward lower levels
  },
  "traitGeneration": {
    "appearanceRates": {
      "common": 0.02,    // 2% (down from 5%)
      "uncommon": 0.08,  // 8% (down from 15%)
      "rare": 0.15,      // 15% (down from 30%)
      "epic": 0.30       // 30% (down from 50%)
    }
  }
}
```

### 2. ItemService Updates

**File**: `be/services/itemService.js`

**Changes**:
- Added `generationConfig` property to store configuration
- Updated `loadDefinitions()` to load generation-config.json with fallback defaults
- Completely rewrote `generateRandomQualities()` to use count-based selection
- Updated `generateRandomTraits()` to use config appearance rates
- Added helper methods:
  - `_rollQualityCount(maxAllowed)` - Rolls how many qualities based on distribution
  - `_selectRandomQualities(allowedQualities, count)` - Fisher-Yates shuffle selection

**Key Algorithm Changes**:

```javascript
// OLD: Assign ALL allowed qualities
generateRandomQualities(itemId) {
  for (const qualityId of itemDef.allowedQualities) {
    qualities[qualityId] = level; // Always added
  }
}

// NEW: Select N qualities probabilistically
generateRandomQualities(itemId) {
  const qualityCount = this._rollQualityCount(allowedCount); // Roll count
  if (qualityCount === 0) return {}; // Plain item

  const selectedQualities = this._selectRandomQualities(allowedQualities, qualityCount);

  for (const qualityId of selectedQualities) {
    qualities[qualityId] = level; // Only selected qualities
  }
}
```

### 3. Removed maxStack System

As part of this session, also removed the `maxStack` limitation system to allow unlimited stacking for stackable items.

**Files Modified**:
- `be/models/Player.js` - Removed maxStack check in addItem()
- `ui/src/app/models/inventory.model.ts` - Removed maxStack field
- `ui/src/app/models/vendor.model.ts` - Replaced with stackable boolean
- `be/controllers/manualController.js` - Removed from item data export
- `ui/src/app/services/manual.service.ts` - Removed from interface
- `ui/src/app/components/manual/sections/mechanics-section.component.ts` - Updated help text
- All item definition JSON files - Removed maxStack field

### 4. Added Fish Qualities

Added two new quality types for fish items:

**File**: `be/data/items/qualities/qualities.json`

- **size** (SZ): Physical size of fish, affects cooking yield multiplier (1.1x → 1.5x)
  - Levels: Large, Jumbo, Trophy, Colossal, Leviathan

- **juicy** (JC): Moisture content and tenderness, affects cooking quality bonus (1.08x → 1.4x)
  - Levels: Moist, Succulent, Luscious, Exquisite, Divine

**Files Modified**:
- `be/data/items/definitions/resources/fish.json` - Added subcategories and allowed qualities

### 5. Documentation Updates

**Updated Files**:
- `CLAUDE.md` - Added probabilistic generation details to Inventory System section
- `project/docs/inventory-system.md` - Completely rewrote Random Generation section with detailed probability distributions

## Expected Results

With the new system, items will have the following distribution:

- **~35%** plain items (0 qualities, 0 traits)
- **~40%** basic items (1 quality, 0 traits)
- **~15%** good items (1-2 qualities, 0 traits)
- **~8%** valuable items (qualities + 1 trait)
- **~2%** jackpot items (multiple qualities + traits)

## Quality Generation Details

### Count Determination

1. Roll random number (0-1)
2. Check against cumulative distribution:
   - 0-0.35: 0 qualities (plain item)
   - 0.35-0.80: 1 quality
   - 0.80-0.95: 2 qualities
   - 0.95-1.00: 3 qualities

3. Cap at `allowedQualities.length` for the item

### Quality Selection

Uses Fisher-Yates shuffle to randomly select N qualities from allowed list:

```javascript
_selectRandomQualities(allowedQualities, count) {
  const shuffled = [...allowedQualities];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
```

### Quality Level Generation

Once qualities are selected, levels are determined using existing tier-based distribution:

**Tier 1 items** (common):
- Level 1: 25%, Level 2: 40%, Level 3: 25%, Level 4: 8%, Level 5: 2%
- Average: 2-3

**Tier 2 items** (uncommon):
- Level 1: 10%, Level 2: 25%, Level 3: 35%, Level 4: 25%, Level 5: 5%
- Average: 3-4

**Tier 3+ items** (rare+):
- Level 1: 5%, Level 2: 10%, Level 3: 25%, Level 4: 35%, Level 5: 25%
- Average: 4-5

## Trait Generation Details

### Two-Stage Process

1. **Appearance Roll**: Does the trait appear at all?
   - Common: 2% chance
   - Uncommon: 8% chance
   - Rare: 15% chance
   - Epic: 30% chance

2. **Level Roll** (if trait appears): What level?
   - Common: 70% L1, 25% L2, 5% L3
   - Uncommon: 50% L1, 40% L2, 10% L3
   - Rare: 30% L1, 50% L2, 20% L3
   - Epic: 15% L1, 40% L2, 45% L3

### Inverted Rarity System

Note: Trait rarity is "inverted" - epic traits are MORE common than common traits:
- This is intentional design
- Epic traits have stronger effects, so appearing more often balances gameplay
- Common traits are weak but very rare, making them collectible

## Level Damping System

### Overview

Level damping applies an exponential curve to shift quality level probabilities toward lower levels (L1-L2), making high-level qualities rarer.

### How It Works

**Configuration**: `levelDamping: 0.6` in generation-config.json (0-1 range)

**Algorithm**:
1. Start with tier-based weights (e.g., T1: [0.25, 0.40, 0.25, 0.08, 0.02])
2. Apply exponential boost to lower levels based on position
3. Normalize weights to sum to 1

**Formula**:
```javascript
dampingFactor = (1 - levelPosition) ^ (damping * 2)
dampedWeight = originalWeight * (1 + dampingFactor)
```

### Effect with 0.6 Damping

**Tier 1 (Common)**:
- L1: 25% → 30.2% (+5.2%)
- L2: 40% → 41.2% (+1.2%)
- L3: 25% → 21.7% (-3.3%)
- L4: 8% → 5.7% (-2.3%)
- L5: 2% → 1.2% (-0.8%)
- **Average: 2.22 → 2.07** (-0.15 levels)

**Tier 2 (Uncommon)**:
- L1: 10% → 13.5% (+3.5%)
- L2: 25% → 28.9% (+3.9%)
- L3: 35% → 34.0% (-1.0%)
- L4: 25% → 20.1% (-4.9%)
- L5: 5% → 3.4% (-1.6%)
- **Average: 2.90 → 2.71** (-0.19 levels)

**Tier 3+ (Rare)**:
- L1: 5% → 7.7% (+2.7%)
- L2: 10% → 13.2% (+3.2%)
- L3: 25% → 27.7% (+2.7%)
- L4: 35% → 32.1% (-2.9%)
- L5: 25% → 19.3% (-5.7%)
- **Average: 3.65 → 3.42** (-0.23 levels)

### Testing Damping

Run the test script to see damping effects:
```bash
cd be
node utils/test-level-damping.js
```

### Adjusting Damping

**Increase damping** (e.g., 0.8):
- Even more bias toward L1-L2
- L5 becomes extremely rare
- Average level drops by ~0.4-0.6

**Decrease damping** (e.g., 0.4):
- Less bias toward low levels
- L4-L5 more common
- Average level drops by ~0.1-0.2

**Disable damping** (set to 0 or remove):
- Uses original tier-based distributions
- No level shift

## Crafting System (Unchanged)

The crafting system continues to use **quality inheritance** rather than random generation:
- Takes max quality level per quality type from ingredients
- Adds skill bonus (+1 quality level per 10 skill levels, max +2)
- Copies traits from best ingredient
- This ensures crafting remains a reliable path to high-quality items

## Configuration and Balancing

### Adjusting Probabilities

Edit `be/data/items/generation-config.json` to change probabilities. No code changes required.

**Example: Make items more common with qualities**:
```json
{
  "qualityGeneration": {
    "countDistribution": {
      "0": 0.20,  // Reduce plain items
      "1": 0.50,  // Increase single quality
      "2": 0.20,  // Increase double quality
      "3": 0.10   // Increase triple quality
    }
  }
}
```

### Hot Reload

Changes to `generation-config.json` are loaded on server restart. Item definitions support hot-reload via `/api/inventory/reload` endpoint.

## Testing

To test the new probabilities:

1. Generate 100 items of the same type:
```bash
cd be
node utils/add-item.js  # Modify itemId in file
```

2. Check distribution in inventory (frontend)

3. Verify probabilities match configuration (~35% plain, ~45% one quality, etc.)

## Backward Compatibility

### Breaking Changes

- Items generated before this change will have ALL qualities (old system)
- Items generated after will have 0-N qualities (new system)
- Both types can coexist in player inventories
- Stacking still works correctly (items must have identical quality/trait levels to stack)

### Migration

No database migration required. Existing items remain unchanged.

## Performance Impact

Minimal performance impact:
- Added two helper methods (`_rollQualityCount`, `_selectRandomQualities`)
- Fisher-Yates shuffle is O(n) where n = allowed qualities (typically 2-3)
- Config loading happens once at server startup
- Overall generation time unchanged

## Future Enhancements

Potential future improvements:
- Player luck/attribute modifiers affecting generation
- Location-based quality/trait modifiers
- Activity-specific generation rules
- Item rarity affecting quality count distribution
- Special events with increased quality/trait rates

## Files Modified Summary

**New Files**:
- `be/data/items/generation-config.json`
- `project/docs/item-generation-probabilistic-system.md` (this file)

**Modified Files**:
- `be/services/itemService.js`
- `be/models/Player.js`
- `be/controllers/manualController.js`
- `be/data/items/qualities/qualities.json`
- `be/data/items/definitions/resources/fish.json`
- All item definition JSON files (removed maxStack)
- `ui/src/app/models/inventory.model.ts`
- `ui/src/app/models/vendor.model.ts`
- `ui/src/app/services/manual.service.ts`
- `ui/src/app/components/manual/sections/mechanics-section.component.ts`
- `CLAUDE.md`
- `project/docs/inventory-system.md`

## Related Documentation

- [Inventory System](./inventory-system.md) - Full inventory system documentation
- [Level-Based Quality/Trait System](./level-based-quality-trait-system.md) - Quality and trait level details
- [Quality System 5-Level Expansion](./quality-system-5-level-expansion.md) - Quality level expansion documentation

## Conclusion

This probabilistic generation system creates a more engaging loot economy where:
- Plain items are common and serve as a baseline
- Single-quality items are the standard
- Multi-quality items feel valuable
- Items with traits are rare and exciting
- Crafting remains the reliable path to guaranteed high-quality items

The configuration-based approach allows easy balancing without code changes, and the tier-independent quality count ensures consistent item quality across all tiers while maintaining tier-based quality level progression.
