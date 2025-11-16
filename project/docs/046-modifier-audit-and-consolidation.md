# Modifier System Audit and Consolidation

**Date**: 2025-11-15
**Purpose**: Analyze existing traits and qualities before migrating to data-driven effect system

---

## Current Modifier Inventory

### Traits (11 total)

| Trait ID | Categories | Max Level | Effect Types | Currently Used? |
|----------|-----------|-----------|--------------|-----------------|
| **balanced** | equipment | 3 | activity.timeReduction (1-4s) | ❌ No |
| **blessed** | equipment | 3 | vendorPrice only | ✅ Yes (vendor) |
| **empowering** | resource, consumable | 3 | alchemy.buffEffect (damage +20-40%) | ✅ Yes (potions) |
| **fragrant** | resource | 3 | vendorPrice only | ✅ Yes (vendor) |
| **hardened** | equipment | 3 | combat.damageBonus (+2/+4/+7) | ❌ No |
| **invigorating** | resource, consumable | 3 | alchemy.buffEffect (attackSpeed +10-30%) | ✅ Yes (potions) |
| **masterwork** | equipment | 3 | vendorPrice only | ✅ Yes (vendor) |
| **pristine** | equipment | 3 | vendorPrice only | ✅ Yes (vendor) |
| **reinforced** | equipment | 3 | combat.armorBonus (+3/+6/+10) - IN DESCRIPTION ONLY | ❌ No |
| **restorative** | resource, consumable | 3 | alchemy.hotEffect (heal 5-15/tick) | ✅ Yes (potions) |
| **warding** | resource, consumable | 3 | alchemy.buffEffect (armor +5-15 flat) | ✅ Yes (potions) |

### Qualities (7 total - sampled)

| Quality ID | Categories | Max Level | Effect Types | Currently Used? |
|-----------|-----------|-----------|--------------|-----------------|
| **grain** | resource (wood) | 5 | activityTime.reductionPercent (5-25%) | ❌ No |
| **age** | resource (wood) | 5 | vendorPrice only | ✅ Yes (vendor) |
| **juicy** | resource (fruit) | 5 | vendorPrice only | ✅ Yes (vendor) |

*Note: All 7 qualities likely follow same pattern - vendor pricing with some having unused gameplay effects*

---

## Effect Type Classification

### Currently Implemented Effects

1. **Vendor Pricing** (All traits/qualities)
   - Format: `vendorPrice.modifier` (multiplier)
   - Used by: `itemService.calculateVendorPrice()`
   - Status: ✅ Working

2. **Alchemy Buff Effects** (4 traits)
   - Format: `alchemy.buffEffect { stat, value, duration, isPercentage }`
   - Used by: Potion consumption in combat
   - Traits: empowering, invigorating, warding
   - Status: ✅ Working

3. **Alchemy HoT Effects** (1 trait)
   - Format: `alchemy.hotEffect { healPerTick, ticks, tickInterval }`
   - Used by: Potion consumption in combat
   - Traits: restorative
   - Status: ✅ Working

### Unimplemented Effects (Defined but Ignored)

4. **Combat Damage Bonus** (1 trait)
   - Format: `combat.damageBonus` (flat number)
   - Defined in: hardened (+2/+4/+7)
   - Should apply to: Weapon damage calculations
   - Status: ❌ Ignored by combatService

5. **Combat Armor Bonus** (1 trait)
   - Format: NOT IN DATA - only in description
   - Defined in: reinforced (+3/+6/+10)
   - Should apply to: Player armor calculations
   - Status: ❌ Not even in trait data

6. **Activity Time Reduction** (2 sources)
   - Format:
     - Traits: `activity.timeReduction` (flat seconds)
     - Qualities: `activityTime.reductionPercent` (percentage)
   - Defined in: balanced trait, grain quality
   - Should apply to: Activity duration calculations
   - Status: ❌ Ignored by activityHandler

---

## Issues to Address

### 1. Inconsistent Effect Naming
- Traits use `activity.timeReduction` (flat)
- Qualities use `activityTime.reductionPercent` (percentage)
- **Decision needed**: Standardize on single format

### 2. Missing Combat Stat Integration
- Combat service reads `itemDef.properties.damage/armor/evasion`
- Combat service IGNORES `trait.effects.combat.*`
- **Fix needed**: Add trait evaluation to combat calculations

### 3. Missing Activity Duration Integration
- Activity duration comes from activity definition only
- No trait/quality effects applied
- **Fix needed**: Add modifier evaluation to activity start/complete

### 4. Incomplete Trait Definitions
- **reinforced** trait has armor bonus in DESCRIPTION but not in effects data
- **Fix needed**: Add missing `combat.armorBonus` to data

### 5. Vendor-Only Modifiers
- 4 traits (blessed, fragrant, masterwork, pristine) only affect vendor price
- **Question**: Keep these or consolidate into fewer "rare/valuable" traits?

---

## Recommendations

### Consolidation Opportunities

**Option A: Keep All Traits**
- Pros: More variety for players
- Cons: Some are functionally identical (all just vendorPrice multipliers)

**Option B: Consolidate Vendor-Only Traits**
- Merge: blessed + masterwork + pristine → **"Masterwork"** (equipment only)
- Keep: fragrant (resource-specific flavor)
- Pros: Simpler, less redundancy
- Cons: Less naming variety

**Recommendation**: Option B - consolidate vendor-only equipment traits

### Effect Type Standardization

**Proposed unified format**:
```typescript
effects: {
  applicators: [
    {
      context: 'combat.damage',
      modifierType: 'flat',
      value: 7,
      condition: { type: 'always' }
    },
    {
      context: 'activity.duration',
      modifierType: 'percentage',
      value: -0.15,  // -15% time
      condition: {
        type: 'activity.type',
        value: ['woodcutting', 'mining', 'fishing']
      }
    }
  ]
}
```

### Migration Priority

1. **Phase 1: Core Combat** (Immediate value)
   - hardened (damage bonus)
   - reinforced (armor bonus - fix data first)
   - Priority: High - affects combat balance

2. **Phase 2: Activity Modifiers** (QoL improvement)
   - balanced (time reduction)
   - grain quality (time reduction)
   - Priority: Medium - nice but not critical

3. **Phase 3: Vendor Consolidation** (Cleanup)
   - Merge vendor-only traits
   - Priority: Low - purely organizational

---

## Next Steps

1. ✅ Complete this audit
2. Design effect applicator type system
3. Fix reinforced trait data (add missing combat.armorBonus)
4. Build trait evaluation engine
5. Migrate traits to new format (start with combat traits)
6. Update services to use evaluator
7. Test with existing content
8. Document new workflow for future affixes

---

## Future Affix Considerations

Based on your affix plans, the system should support:

- **Flat stat bonuses**: +10 damage, +5 armor
- **Percentage bonuses**: +15% crit chance, +20% attack speed
- **New abilities**: Grant skill while equipped
- **Conditional effects**: Bonus vs. specific enemy types
- **Stacking rules**: How multiple affixes interact

The data-driven system will handle all of these through effect applicators.
