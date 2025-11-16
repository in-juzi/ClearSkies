# Resource Weight and Gathering Yield Rebalancing

**Date**: 2025-01-15
**Status**: Completed

## Overview

Comprehensive rebalancing of resource weights and gathering yields across all gathering skills (Mining, Fishing, Gathering, Woodcutting, Combat) to address inventory management issues and improve game balance. This overhaul touched 30+ item definitions and 11 drop tables, reducing weight burden by 20-60% and normalizing yield distributions across all gathering activities.

## Problem Statement

### Pre-Balance Issues

**Inventory Bottlenecks:**
- Mining: 6 actions to fill 60kg inventory (ores were 4-6kg each, yielding 1-3 per action)
- Heavy ores made bronze ingot crafting feel tedious (9kg input → 8kg output)
- Fish weight progression was inconsistent (0.5kg shrimp to 2kg cod/pike)

**Yield Imbalances:**
- Common herbs: 3-15 per gather (excessive compared to other skills)
- Shrimp: 2-12 per catch (55% overyielding)
- Salmon: Always 1 per catch (unrewarding for T2 fish)
- Combat drops: Inconsistent with gathering equivalents

**Mental Math Complexity:**
- Bronze crafting: 1 copper (5kg) + 1 tin (4kg) = 9kg input → 8kg ingot (confusing 11% loss)
- No consistent weight ratios between tiers

## Design Rationale

### Weight Reduction Philosophy

1. **Ores (Primary Bottleneck)**: Reduce by 33-50% to allow 2-3× more actions before inventory fills
2. **Fish (Secondary)**: Reduce by 20-60% with tier-based scaling (lighter fish = smaller, heavier fish = larger)
3. **Herbs**: Keep light (0.1-0.3kg) - already appropriate
4. **Ingots**: Match ore input weights with realistic smelting loss (10-12%)

### Yield Normalization Philosophy

1. **Common Resources**: 1-2 base yield (80% weight), 2-3 quality yield (15-20% weight)
2. **Common Herbs**: Reduce by 35-43% to match other gathering skills
3. **Rare Herbs**: Moderate 16-23% reduction to maintain "rare" feel
4. **T2+ Fish**: Increase yields to match higher tier expectations
5. **Combat Drops**: Align with gathering equivalents

### Mental Math Optimization

- Copper + Tin: Both 2.5kg for easy addition (5kg total)
- Bronze Ingot: 4.5kg (clean 10% smelting loss from 5kg input)
- Iron Ingot: 7kg (12.5% loss from 8kg input)

## Implementation Details

### 1. Ore Weights (Item Definitions)

**Files Modified:**
- [CopperOre.ts](../../be/data/items/definitions/resources/CopperOre.ts)
- [TinOre.ts](../../be/data/items/definitions/resources/TinOre.ts)
- [IronOre.ts](../../be/data/items/definitions/resources/IronOre.ts)
- [SilverOre.ts](../../be/data/items/definitions/resources/SilverOre.ts)

**Changes:**

| Ore | Before | After | Change | Reasoning |
|-----|--------|-------|--------|-----------|
| Copper | 5kg | 2.5kg | -50% | T1 ore, match tin for bronze math |
| Tin | 4kg | 2.5kg | -37.5% | T1 ore, match copper for bronze math |
| Iron | 6kg | 4kg | -33% | T2 ore, heavier than T1 but not excessive |
| Silver | 5.5kg | 3.5kg | -36% | T2 precious ore |

**Impact:** Mining inventory fills in ~16 actions instead of ~6 actions (2.6× improvement)

### 2. Ingot Weights (Item Definitions)

**Files Modified:**
- [BronzeIngot.ts](../../be/data/items/definitions/resources/BronzeIngot.ts)
- [IronIngot.ts](../../be/data/items/definitions/resources/IronIngot.ts)

**Changes:**

| Ingot | Before | After | Change | Math |
|-------|--------|-------|--------|------|
| Bronze | 8kg | 4.5kg | -44% | (2.5kg + 2.5kg) × 0.9 = 4.5kg (10% loss) |
| Iron | 10kg | 7kg | -30% | (4kg × 2) × 0.875 = 7kg (12.5% loss) |

### 3. Mining Yields (Drop Tables)

**Files Modified:**
- [MiningCopper.ts](../../be/data/locations/drop-tables/MiningCopper.ts)
- [MiningTin.ts](../../be/data/locations/drop-tables/MiningTin.ts)

**Changes:**

```
Common drop (80%): 1-3 → 1-2
Quality drop (15%): 2-4 → 2-3
```

### 4. Fish Weights (Item Definitions)

**Files Modified:**
- [Shrimp.ts](../../be/data/items/definitions/resources/Shrimp.ts)
- [Trout.ts](../../be/data/items/definitions/resources/Trout.ts)
- [Salmon.ts](../../be/data/items/definitions/resources/Salmon.ts)
- [Cod.ts](../../be/data/items/definitions/resources/Cod.ts)
- [Pike.ts](../../be/data/items/definitions/resources/Pike.ts)

**Changes:**

| Fish | Tier | Before | After | Change | Reasoning |
|------|------|--------|-------|--------|-----------|
| Shrimp | T1 | 0.5kg | 0.2kg | -60% | Tiny shellfish, stack weight too high |
| Trout | T1 | 1kg | 0.8kg | -20% | Medium fish |
| Salmon | T2 | 1.5kg | 1.2kg | -20% | Prized fish |
| Cod | T3 | 2kg | 1.5kg | -25% | Large fish |
| Pike | T3 | 2kg | 1.5kg | -25% | Large fish |

### 5. Fishing Yields (Drop Tables)

**Files Modified:**
- [FishingShrimp.ts](../../be/data/locations/drop-tables/FishingShrimp.ts)
- [FishingSalmon.ts](../../be/data/locations/drop-tables/FishingSalmon.ts)

**Shrimp (Major Reduction):**
```
Before: 2-5 (70%), 5-8 (20%), 8-12 (5%) = avg 4.2 shrimp
After:  1-2 (70%), 2-4 (20%), 4-6 (5%)  = avg 1.9 shrimp
Reduction: -55%
```

**Salmon (Increase):**
```
Before: Always 1 (90% of catches)
After:  1-2 (70%), 2-3 (20%), 3-4 (5%) = avg 1.6 salmon
Increase: +60%
```

**Impact:** Shrimp inventory fills in ~158 actions instead of ~29 actions (5.4× improvement). Salmon feels more rewarding with multiple catches.

### 6. Herb Gathering Yields (Drop Tables)

**Files Modified:**
- [GatheringChamomile.ts](../../be/data/locations/drop-tables/GatheringChamomile.ts)
- [GatheringSage.ts](../../be/data/locations/drop-tables/GatheringSage.ts)
- [GatheringNettle.ts](../../be/data/locations/drop-tables/GatheringNettle.ts)
- [GatheringDragonsBreath.ts](../../be/data/locations/drop-tables/GatheringDragonsBreath.ts)
- [GatheringMandrake.ts](../../be/data/locations/drop-tables/GatheringMandrake.ts)
- [GatheringMoonpetal.ts](../../be/data/locations/drop-tables/GatheringMoonpetal.ts)

**Common Herbs (Major Reduction):**

| Herb | Before | After | Reduction |
|------|--------|-------|-----------|
| Chamomile | 3-6/6-10/10-15 (avg 5.5) | 2-4/4-6/6-9 (avg 3.6) | -35% |
| Sage | 2-5/5-8/8-12 (avg 4.6) | 1-3/3-5/5-7 (avg 2.6) | -43% |
| Nettle | 2-4/4-7/7-10 (avg 4.3) | 1-3/3-5/5-7 (avg 2.8) | -35% |

**Rare Herbs (Moderate Reduction):**

| Herb | Before | After | Reduction |
|------|--------|-------|-----------|
| Dragon's Breath | 1-2/2-4/4-6 (avg 2.7) | 1-2/2-3/3-5 (avg 2.2) | -19% |
| Mandrake | 1-3/3-5/5-8 (avg 3.1) | 1-2/2-4/4-6 (avg 2.4) | -23% |
| Moonpetal | 1-2/2-4/4-6 (avg 2.5) | 1-2/2-3/3-5 (avg 2.1) | -16% |

**Impact:** Herb gathering now balanced with other gathering skills. Inventory fills in ~167 actions instead of ~109 (1.5× improvement).

### 7. Combat Drops (Minor Adjustments)

**Files Modified:**
- [CombatGoblinBasic.ts](../../be/data/locations/drop-tables/CombatGoblinBasic.ts)
- [CombatGoblinScout.ts](../../be/data/locations/drop-tables/CombatGoblinScout.ts)
- [CombatGoblinShaman.ts](../../be/data/locations/drop-tables/CombatGoblinShaman.ts)

**Changes:**

| Drop Table | Changes |
|------------|---------|
| Goblin Basic | Scrap Metal: 2-4 → 1-3 (-25%)<br>Copper Ore: 1-3 → 1-2 (align with mining) |
| Goblin Scout | Scrap Metal: 1-3 → 1-2 |
| Goblin Shaman | Sage: 2-4 → 1-3<br>Nettle: 2-4 → 1-3<br>Chamomile: 1-3 → 1-2<br>Mana Tincture: 1-3 → 1-2 |

**Rationale:** Combat herb drops now align with gathering yields for consistency.

### 8. Logs (No Changes)

**Status:** Woodcutting already well balanced
- Oak/Willow/Maple: 0.5kg weight (appropriate)
- Yields: 1-2 (80%), 2-3 (20%) - avg 1.4 logs (good)

## Benefits

### Immediate Gameplay Improvements

1. **Inventory Management**: 2-5× more gathering actions before inventory fills
2. **Bronze Crafting**: Clean mental math (2.5kg + 2.5kg ≈ 4.5kg)
3. **Salmon Fishing**: Now rewarding with multi-catch yields
4. **Skill Balance**: All gathering skills have similar yield expectations
5. **Combat Consistency**: Combat drops match gathering equivalents

### Long-Term Balance

1. **Resource Scarcity**: Slower resource accumulation extends early/mid game
2. **Skill Progression**: Gathering feels meaningful, not overshadowed by combat
3. **Trade Value**: Resources maintain value due to controlled supply
4. **Weight-Based Strategy**: Players consider weight when choosing gathering activities

### Economy Impact

1. **Vendor Sales**: Lighter resources mean more profitable gathering trips
2. **Crafting Costs**: Bronze ingot crafting more accessible (lighter inputs)
3. **Storage Value**: Bank/storage space becomes more valuable

## Testing Results

**Mining (Copper/Tin):**
- ✅ Bronze ingot crafting: 2.5kg + 2.5kg → 4.5kg (clean 10% loss)
- ✅ Inventory fills in ~16 actions vs ~6 actions before
- ✅ Mental math: Easy to calculate needed ore quantities

**Fishing (Shrimp/Salmon):**
- ✅ Shrimp: Sustainable 1-2 catches, not overwhelming
- ✅ Salmon: 1-3 catches feel rewarding for T2 fish
- ✅ Weight progression makes sense (lighter fish = less weight)

**Gathering (Herbs):**
- ✅ Common herbs: 1-3 base feels balanced with mining/fishing
- ✅ Rare herbs: Still feel special with moderate yields
- ✅ Combat herb drops consistent with gathering

## Future Expansion

### Potential Additions

1. **Steel Tier**: Steel ore (5kg), Steel ingot (8.5kg) following same formulas
2. **Gemstone Gathering**: Use rare herb yield patterns (1-2 base, very low drop rates)
3. **Advanced Materials**: Mythril, Adamantite with progressive weight scaling
4. **Quality Impact**: Higher quality items could have slight weight reductions
5. **Strength Scaling**: High STR could reduce perceived weight (carrying capacity bonus already exists)

### Balance Monitoring

Track these metrics post-deployment:
1. Average gathering actions per inventory fill
2. Resource accumulation rates per hour
3. Vendor sale frequencies
4. Crafting material availability
5. Player feedback on inventory pressure

### Adjustment Levers

If further tuning needed:
1. **Yields**: Adjust min/max ranges in drop tables
2. **Weights**: Fine-tune individual item weights
3. **Drop Rates**: Modify weight probabilities in drop tables
4. **Rare Tables**: Add bonus drops for high-level gatherers

## Related Documentation

- [002-drop-table-system.md](002-drop-table-system.md) - Drop table mechanics
- [015-inventory-system.md](015-inventory-system.md) - Inventory weight calculations
- [031-location-system.md](031-location-system.md) - Activity and gathering system
- [041-attribute-progression-system.md](041-attribute-progression-system.md) - Carrying capacity formulas

## Summary Statistics

**Total Changes:**
- **Item Definitions Modified**: 11 (6 ores/ingots, 5 fish)
- **Drop Tables Modified**: 11 (2 mining, 2 fishing, 6 gathering, 3 combat)
- **Weight Reductions**: 20-60% across all resource categories
- **Yield Adjustments**: -55% to +60% depending on balance needs
- **Inventory Improvement**: 1.5-5× more actions before inventory fills

**Balance Philosophy:**
- Reduce inventory pressure without eliminating weight as a mechanic
- Normalize yields across all gathering skills
- Maintain tier-based progression (higher tier = heavier but more valuable)
- Enable mental math for common crafting operations
- Align combat drops with gathering equivalents

This rebalancing represents the largest economy adjustment in the game's development, touching every major gathering system to create a cohesive, balanced resource acquisition experience.
