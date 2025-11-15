# Level-Based Quality & Trait System

## Overview

The quality and trait system has been redesigned to use **discrete levels** instead of decimal values (0-1). This makes the system more intuitive for players, enables better item stacking, and provides clear progression paths.

## Design Philosophy: Qualities are Always Positive

**IMPORTANT**: All qualities provide **strictly positive modifiers** (≥1.0). This design decision ensures that:

1. **Clarity**: If an item has quality modifiers, players know it's better than an item without them
2. **No Confusion**: Players never see qualities that make items worse
3. **Positive Experience**: Finding qualities always feels rewarding
4. **Negative Traits**: Any negative modifiers (if implemented in future) will be conveyed through **single-tier traits**, not qualities

## Key Changes

### Old System (Decimal-Based)
- **Qualities**: 0-1 decimal values (e.g., 0.65)
- **Traits**: Array of trait IDs (e.g., `["fragrant", "pristine"]`)
- **Stacking**: Items with slightly different decimal values couldn't stack
- **Display**: Showed percentages (e.g., "65%") which were unclear

### New System (Level-Based)
- **Qualities**: Integer levels 1-3 (e.g., Level 2 = "Superior Grain")
- **All quality modifiers are positive** (≥1.0) - no penalties
- **Traits**: Map of traitId → level (1-3) (e.g., `{ fragrant: 2 }`)
- **Stacking**: Items with identical levels stack together
- **Display**: Shows descriptive names (e.g., "Fine Grain - Level 1")

## Quality Levels

Each quality has 3 levels with explicit names, descriptions, and effects. **All modifiers are positive** (≥1.0).

### Example: Wood Grain Quality

| Level | Name | Description | Alchemy | Vendor Price |
|-------|------|-------------|---------|--------------|
| 1 | Fine Grain | Smooth, uniform grain | 1.15x | 1.15x |
| 2 | Superior Grain | Exceptional grain pattern | 1.25x | 1.25x |
| 3 | Perfect Grain | Flawless grain pattern | 1.35x | 1.35x |

### All Qualities

1. **Wood Grain** (3 levels) - For wood resources
   - L1: Fine Grain (1.15x), L2: Superior Grain (1.25x), L3: Perfect Grain (1.35x)

2. **Dryness** (3 levels) - For wood resources (replaces "Moisture")
   - L1: Well-Seasoned (1.1x), L2: Kiln-Dried (1.2x), L3: Perfectly Dried (1.3x)

3. **Age** (3 levels) - For wood resources (older = better for alchemy)
   - L1: Aged (1.1x), L2: Mature (1.25x), L3: Ancient (1.4x)

4. **Purity** (3 levels) - For ores and metals
   - L1: High Purity (1.2x), L2: Refined (1.35x/1.4x), L3: Flawless (1.5x/1.6x)

5. **Sheen** (3 levels) - For metals and gemstones
   - L1: Polished (1.1x), L2: Brilliant (1.2x), L3: Radiant (1.3x)

**Removed Quality:**
- **Freshness** - Removed to avoid implying time-decay mechanics

## Trait Levels

Each trait has 3 levels with escalating effects:

### Example: Fragrant Trait

| Level | Name | Description | Vendor Price | Alchemy Properties |
|-------|------|-------------|--------------|-------------------|
| 1 | Lightly Fragrant | Subtle aroma | 1.1x | [calming] |
| 2 | Fragrant | Noticeable scent | 1.25x | [calming, soothing] |
| 3 | Highly Fragrant | Intense aroma | 1.5x | [calming, soothing, rejuvenating] |

### All Traits

1. **Fragrant** (3 levels) - Pleasant scent, uncommon drop
2. **Weathered** (3 levels) - Elemental exposure, uncommon drop
3. **Pristine** (3 levels) - Perfect condition, rare drop
4. **Cursed** (1 level) - Mysterious curse with combat bonus but health drain, rare drop
5. **Blessed** (3 levels) - Divine blessing, epic drop
6. **Masterwork** (3 levels) - Master craftsmanship, epic drop

**Removed Trait:**
- **Knotted** - Removed as it was purely negative (conflicted with "qualities are positive" philosophy)

## Random Generation

### Quality Level Distribution

Quality levels are generated based on item tier (now 1-3 instead of 1-5):

- **Tier 1**: Favors lower levels (50% L1, 35% L2, 15% L3)
- **Tier 2**: Balanced distribution (30% L1, 45% L2, 25% L3)
- **Tier 3+**: Favors higher levels (15% L1, 35% L2, 50% L3)

### Trait Level Distribution

Trait levels are based on trait rarity:

- **Common**: Mostly L1 (70% L1, 25% L2, 5% L3)
- **Uncommon**: Balanced L1-L2 (50% L1, 40% L2, 10% L3)
- **Rare**: Balanced (30% L1, 50% L2, 20% L3)
- **Epic**: Favors higher levels (15% L1, 40% L2, 45% L3)

## Stacking Behavior

Items can now stack if they have:
1. Same itemId
2. Identical quality levels
3. Identical trait levels

### Examples

✅ **Can Stack:**
- Oak Log: woodGrain:3, moisture:4, fragrant:2 (x5)
- Oak Log: woodGrain:3, moisture:4, fragrant:2 (x3)
- Result: Single stack of x8

❌ **Cannot Stack:**
- Oak Log: woodGrain:3, moisture:4, fragrant:2 (x5)
- Oak Log: woodGrain:3, moisture:5, fragrant:2 (x3)
- Result: Two separate stacks (different moisture level)

## UI Display

### Inventory Grid
- Shows trait badges with levels (e.g., "F2" for Fragrant Level 2)
- Hover tooltip shows full trait name and level

### Item Details Panel

**Qualities Section:**
```
Qualities
  Wood Grain                    Level 4
  Fine Grain
  "Smooth, uniform grain with excellent structure"

  Moisture                      Level 5
  Perfectly Dried
  "Ideally dried for maximum efficiency"
```

**Traits Section:**
```
Traits
  Fragrant                      Level 2
  Fragrant
  "A noticeable, pleasing scent"
```

## API Changes

### Item Instance Format (MongoDB)

**Before:**
```javascript
{
  qualities: {
    woodGrain: 0.65,  // Decimal value
    moisture: 0.82
  },
  traits: ["fragrant", "pristine"]  // Array
}
```

**After:**
```javascript
{
  qualities: {
    woodGrain: 3,     // Integer level
    moisture: 4
  },
  traits: {
    fragrant: 2,      // Map with levels
    pristine: 1
  }
}
```

### Item Details Response

```javascript
{
  qualityDetails: {
    woodGrain: {
      qualityId: "woodGrain",
      name: "Wood Grain",
      level: 4,
      maxLevel: 5,
      levelData: {
        name: "Fine Grain",
        description: "Smooth, uniform grain with excellent structure",
        effects: {
          alchemy: { potencyMultiplier: 1.15 },
          vendorPrice: { modifier: 1.15 }
        }
      }
    }
  },
  traitDetails: {
    fragrant: {
      traitId: "fragrant",
      name: "Fragrant",
      rarity: "uncommon",
      level: 2,
      maxLevel: 3,
      levelData: {
        name: "Fragrant",
        description: "A noticeable, pleasing scent",
        effects: {
          vendorPrice: { modifier: 1.25 },
          alchemy: { bonusProperties: ["calming", "soothing"] }
        }
      }
    }
  }
}
```

## Database Migration

A migration (`005-convert-quality-trait-to-levels.js`) handles conversion of existing items:

- **Qualities**: Decimal values → Mapped to levels based on ranges
- **Traits**: Array → Map with random levels (1-2)

Run with: `npm run migrate`

## Testing

A test script is available at `be/test-levels.js`:

```bash
node be/test-levels.js
```

Tests:
1. Random quality generation (levels 1-5)
2. Random trait generation (map with levels 1-3)
3. Item instance creation
4. Vendor price calculation with level modifiers
5. Full item details with level data
6. Stacking logic validation

## Benefits

1. **Player Clarity**: "Fine Grain - Level 1" is clearer than "65%"
2. **Better Stacking**: Items with same levels stack together
3. **Progression**: Clear upgrade path from Level 1 → Level 3
4. **Balancing**: Easy to adjust bonuses per level in JSON files
5. **Memorization**: Players can learn what each level means
6. **Reduced Inventory Clutter**: More items stack together
7. **Positive Psychology**: Qualities always feel like rewards, never penalties
8. **No Confusion**: Players don't wonder if qualities can hurt them

## Future Enhancements

Possible additions to the level system:

1. **Level Up Items**: Consumables that upgrade quality/trait levels
2. **Crafting Bonuses**: Higher skill levels produce higher quality levels
3. **Gathering Bonuses**: Better tools or skills increase drop quality levels
4. **Set Bonuses**: Multiple items at max level grant special effects
5. **Visual Indicators**: Color-coded levels in UI (green L1 → purple L5)
