# Potency Quality Fix for Consumables

**Date**: 2025-01-15
**Status**: ✅ Completed

## Problem

The **Potency quality** on alchemy potions was **not being applied** when using consumables outside of combat via the `POST /api/inventory/use` endpoint. This meant that a Health Tincture with Potency Level 3 would restore only 20 HP instead of the expected 26 HP (20 × 1.30 multiplier).

## Root Cause

The `itemService.getConsumableEffects()` method ([itemService.ts:666-737](../be/services/itemService.ts#L666-L737)) was only processing:
- **Base properties** (healthRestore, manaRestore)
- **Trait effects** (buffs, HoTs)

But **completely ignored quality effects** like the `alchemy.potencyMultiplier` from [PotencyQuality.ts](../be/data/items/qualities/definitions/PotencyQuality.ts).

## Solution

Modified `getConsumableEffects()` to:

1. **Process qualities** (similar to trait processing) - lines 679-697
2. **Extract potency multiplier** from quality effects - line 693
3. **Apply multiplier** to base health/mana restore values - lines 700-701

### Code Changes

**File**: [be/services/itemService.ts](../be/services/itemService.ts)

```typescript
// Process qualities for potency multiplier
let potencyMultiplier = 1.0;
if (itemInstance.qualities) {
  const qualityMap = itemInstance.qualities instanceof Map
    ? itemInstance.qualities
    : new Map(Object.entries(itemInstance.qualities));

  for (const [qualityId, level] of qualityMap.entries()) {
    const qualityDef = this.qualityDefinitions.get(qualityId);
    if (!qualityDef || !qualityDef.levels[level]) continue;

    const qualityLevel = qualityDef.levels[level];
    const alchemyEffects = qualityLevel.effects.alchemy;

    if (alchemyEffects?.potencyMultiplier) {
      potencyMultiplier *= alchemyEffects.potencyMultiplier;
    }
  }
}

// Apply potency multiplier to base effects
effects.healthRestore = Math.floor(effects.healthRestore * potencyMultiplier);
effects.manaRestore = Math.floor(effects.manaRestore * potencyMultiplier);
```

### Item Definition Updates

Updated all alchemy potions to allow Potency quality:

**Changed**: `allowedQualities: QUALITY_SETS.NONE` → `allowedQualities: QUALITY_SETS.POTENCY`

**Files Updated**:
- [HealthTincture.ts](../be/data/items/definitions/consumables/HealthTincture.ts)
- [HealthDraught.ts](../be/data/items/definitions/consumables/HealthDraught.ts)
- [HealthElixir.ts](../be/data/items/definitions/consumables/HealthElixir.ts)
- [ManaTincture.ts](../be/data/items/definitions/consumables/ManaTincture.ts)
- [ManaDraught.ts](../be/data/items/definitions/consumables/ManaDraught.ts)
- [PowerElixir.ts](../be/data/items/definitions/consumables/PowerElixir.ts)
- [FuryBrew.ts](../be/data/items/definitions/consumables/FuryBrew.ts)
- [VigorDraught.ts](../be/data/items/definitions/consumables/VigorDraught.ts)
- [WardingTonic.ts](../be/data/items/definitions/consumables/WardingTonic.ts)

**Note**: Cooked food items (CookedCod, CookedSalmon, etc.) still use `QUALITY_SETS.NONE` as they don't use alchemy potency.

## Impact

### Where This Fix Applies

✅ **Out of Combat**: `POST /api/inventory/use` → `combatService.useConsumableOutOfCombat()` → `itemService.getConsumableEffects()`
✅ **In Combat**: Socket.io `combat:useItem` → `combatHandler` → `itemService.getConsumableEffects()`

Both systems use the same `getConsumableEffects()` method, so the fix applies **everywhere consumables are used**.

### Expected Results

**Health Tincture** (base: 20 HP):
- No Potency: 20 HP
- Potency 1 (Potent): 22 HP
- Potency 2 (Concentrated): 24 HP
- Potency 3 (Enriched): **26 HP** ✅
- Potency 4 (Sublime): 28 HP
- Potency 5 (Transcendent): 30 HP

**Mana Tincture** (base: 20 MP):
- Potency 3 (Enriched): **26 MP** ✅

### Potency Quality Multipliers

From [PotencyQuality.ts](../be/data/items/qualities/definitions/PotencyQuality.ts):

| Level | Name          | Multiplier |
|-------|---------------|------------|
| 1     | Potent        | 1.10x      |
| 2     | Concentrated  | 1.20x      |
| 3     | Enriched      | 1.30x      |
| 4     | Sublime       | 1.40x      |
| 5     | Transcendent  | 1.50x      |

## Testing

Created test script: [be/utils/test-potency-quality.js](../be/utils/test-potency-quality.js)

**Run**: `cd be && node utils/test-potency-quality.js`

**Results**: ✅ All tests pass (6 potency levels × health tincture + mana tincture)

## Quality Inheritance Flow

This fix ensures the complete quality flow works end-to-end:

1. **Herbs gathered** with random Potency levels (1-5)
2. **Alchemy recipe** uses `qualityModifier: 'inherit'`
3. **Crafted potions** inherit max herb Potency + skill bonus
4. **Consumable effects** now correctly apply Potency multiplier ✅
5. **Player healing/mana** receives amplified restoration values

## Related Documentation

- [Inventory System](./015-inventory-system.md) - Quality and trait system overview
- [Alchemy Subcategory Implementation](./020-alchemy-subcategory-implementation.md) - Recipe system
- [Herb Trait Mapping](./037-herb-trait-mapping.md) - Trait inheritance from herbs to potions

## Future Considerations

This same pattern could be extended to support:
- **Buff duration multipliers** (e.g., Potency extends buff duration)
- **HoT tick multipliers** (e.g., Potency increases healing per tick)
- **Other quality effects** on consumables (e.g., "Concentration" quality for focus potions)
