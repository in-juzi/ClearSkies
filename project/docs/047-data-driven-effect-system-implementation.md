# Data-Driven Effect System - Implementation Plan

**Date**: 2025-11-15
**Status**: Architecture Complete - Ready for Migration
**Purpose**: Flexible, declarative system for trait/quality/affix effects

---

## Overview

The new effect system moves modifier logic from hardcoded service methods into declarative data definitions. This enables:

✅ **Adding new modifiers = just data** (no service code changes)
✅ **Complex conditional effects** (HP thresholds, enemy types, equipped items)
✅ **Future affix system** (drop-only modifiers with abilities)
✅ **Clean service code** (generic evaluators replace switch statements)

---

## Architecture Components

### 1. Type System ([shared/types/effect-system.ts](../../../shared/types/effect-system.ts))

**Core Enums**:
- `EffectContext` - Where effects apply (combat.damage, activity.duration, etc.)
- `ModifierType` - How effects modify values (flat, percentage, multiplier)
- `ConditionType` - When effects apply (always, HP thresholds, enemy types, etc.)

**Effect Applicators**:
All effect types extend `BaseEffectApplicator`:
```typescript
{
  context: EffectContext.COMBAT_DAMAGE,
  modifierType: ModifierType.FLAT,
  value: 7,
  condition: { type: ConditionType.ALWAYS },
  description: "+7 flat damage"
}
```

**Supported Contexts** (19 total):
- Combat: damage, armor, evasion, critChance, attackSpeed, healthRegen, manaRegen
- Activity: duration, xpGain, yieldQuantity, yieldQuality
- Crafting: qualityBonus, successRate, yieldMultiplier
- Vendor: sellPrice, buyPrice
- Special: consumable buffs/HoTs/DoTs, granted abilities

**Conditional Effect Types** (20+ conditions):
- HP-based: below/above absolute or percentage
- Combat state: in combat, out of combat
- Activity: specific skill types, locations
- Enemy: target type, target HP threshold
- Equipment: specific slots, two-handed, dual wielding, shield
- Character: skill/attribute thresholds, time of day, active buffs

### 2. Evaluation Engine ([be/services/effectEvaluator.ts](../../../be/services/effectEvaluator.ts))

**Core Method**:
```typescript
effectEvaluator.evaluatePlayerEffects(
  player,
  EffectContext.COMBAT_DAMAGE,
  { hpPercent: 0.35, target: monster } // Runtime context for conditions
)
```

**Returns**:
```typescript
{
  flatBonus: 9,           // Total flat modifiers
  percentageBonus: 0.15,  // Total percentage (15%)
  multiplier: 1.0,        // Total multiplier
  appliedEffects: [...],  // Which effects were used
  skippedEffects: [...]   // Which were skipped (condition not met)
}
```

**Convenience Methods**:
```typescript
// Get combat stat bonus
effectEvaluator.getCombatStatBonus(player, 'damage', runtimeContext)

// Get activity duration modifier
effectEvaluator.getActivityDurationModifier(player, 'woodcutting', 'forest-clearing')

// Calculate final value
effectEvaluator.calculateFinalValue(baseValue, evaluationResult)
// Formula: (base + flat) * (1 + percentage) * multiplier
```

**Features**:
- ✅ Evaluates traits, qualities, and affixes (future)
- ✅ Checks conditions against runtime context
- ✅ Aggregates all applicable effects
- ✅ **Legacy mode** - supports old effect format during migration
- ✅ Detailed logging (which effects applied/skipped and why)

---

## Migration Status

### ✅ Completed

1. **Type System** - Full effect applicator definitions
2. **Evaluation Engine** - Generic evaluator with condition support
3. **Example Trait** - Hardened trait migrated to new format

### 🔄 In Progress

**Trait Migrations**:
- ✅ Hardened (combat.damage) - DONE
- ⏳ Reinforced (combat.armor) - Needs data fix first
- ⏳ Balanced (activity.duration) - Ready to migrate
- ⏳ Grain Quality (activity.duration percentage) - Ready to migrate

**Other Traits** (vendor-only or alchemy - working as-is):
- blessed, fragrant, masterwork, pristine (vendor-only)
- empowering, invigorating, restorative, warding (alchemy - special consumable logic)

### ⏸️ Pending

1. **Service Integration** - Update services to use evaluator
2. **Testing** - Verify effects apply correctly in game
3. **Documentation** - Write trait/affix creation guide
4. **Full Migration** - Convert remaining traits/qualities

---

## Example: Before and After

### Before (Old System)

**Trait Definition**:
```typescript
{
  "effects": {
    "vendorPrice": { "modifier": 1.6 },
    "combat": { "damageBonus": 7 }  // ❌ Ignored by combat service
  }
}
```

**Combat Service** (hardcoded):
```typescript
// Only reads itemDef.properties.damage, ignores traits entirely
const damage = baseDamage + itemDef.properties.damage;
```

**Problem**: Combat service doesn't know about trait effects. Adding new traits requires service code changes.

### After (New System)

**Trait Definition**:
```typescript
{
  "effects": {
    "vendorPrice": { "modifier": 1.6 },
    "applicators": [
      {
        context: EffectContext.COMBAT_DAMAGE,
        modifierType: ModifierType.FLAT,
        value: 7,
        condition: { type: ConditionType.ALWAYS },
        description: "+7 flat damage"
      }
    ]
  }
}
```

**Combat Service** (generic):
```typescript
// Automatically includes ALL applicable trait/quality/affix effects
const traitBonus = effectEvaluator.getCombatStatBonus(player, 'damage');
const damage = baseDamage + itemDef.properties.damage + traitBonus.flat;
```

**Solution**: Combat service generically evaluates all effects. New traits work automatically.

---

## Migration Steps

### Phase 1: Combat Traits (High Priority)

**Goal**: Make weapon/armor traits actually work

1. ✅ Migrate Hardened trait (DONE)
2. Fix Reinforced trait data (add missing combat.armorBonus to old effects)
3. Migrate Reinforced trait to new format
4. Update combatService.calculateCombatStat() to use effectEvaluator
5. Test in combat

**Expected Result**: Players with Hardened weapons see increased damage, Reinforced armor provides defense.

### Phase 2: Activity Traits (Medium Priority)

**Goal**: Make gathering/crafting tools faster

1. Migrate Balanced trait (activity.duration flat reduction)
2. Migrate Grain quality (activity.duration percentage reduction)
3. Update activityHandler to apply duration modifiers on activity start
4. Test with woodcutting axe

**Expected Result**: Balanced trait reduces activity time, higher grain wood produces faster tools.

### Phase 3: Vendor Consolidation (Low Priority)

**Goal**: Simplify vendor-only traits

1. Decide: Keep all 4 vendor traits or consolidate?
2. If consolidating: Merge blessed/masterwork/pristine into single "Masterwork" trait
3. Update item definitions to use consolidated trait

**Expected Result**: Cleaner trait list, less redundancy.

### Phase 4: Service Integration

**Files to Update**:

1. **[combatService.ts:256-265](../../../be/services/combatService.ts#L256-L265)** - Add trait bonuses to damage/armor/evasion
   ```typescript
   // Before
   total += itemDef.properties.damage;

   // After
   const traitBonus = effectEvaluator.getCombatStatBonus(player, 'damage', runtimeContext);
   total += itemDef.properties.damage + traitBonus.flat;
   ```

2. **[activityHandler.ts](../../../be/sockets/activityHandler.ts)** - Apply duration modifiers
   ```typescript
   // Before
   const duration = activity.duration * 1000;

   // After
   const durationMod = effectEvaluator.getActivityDurationModifier(player, activityType);
   const duration = effectEvaluator.calculateFinalValue(activity.duration, durationMod) * 1000;
   ```

3. **[recipeService.ts](../../../be/services/recipeService.ts)** - Apply crafting bonuses (future)

---

## Future: Affix System

The effect system is designed to support your planned affix system:

**Example Affix Definitions**:
```typescript
// Flat damage affix
{
  affixId: "of_fury",
  name: "of Fury",
  rarity: "rare",
  applicators: [
    {
      context: EffectContext.COMBAT_DAMAGE,
      modifierType: ModifierType.FLAT,
      value: 15,
      condition: { type: ConditionType.ALWAYS }
    }
  ]
}

// Conditional affix (bonus vs beasts)
{
  affixId: "beastslayer",
  name: "Beastslayer",
  rarity: "epic",
  applicators: [
    {
      context: EffectContext.COMBAT_DAMAGE,
      modifierType: ModifierType.PERCENTAGE,
      value: 0.50,  // +50% damage
      condition: {
        type: ConditionType.TARGET_TYPE,
        value: ["beast", "wild_animal"]
      }
    }
  ]
}

// Ability-granting affix
{
  affixId: "of_flames",
  name: "of Flames",
  rarity: "legendary",
  applicators: [
    {
      context: EffectContext.GRANTS_ABILITY,
      value: 1,
      abilityId: "fireball",
      condition: { type: ConditionType.EQUIPPED_SLOT, value: "mainHand" }
    }
  ]
}
```

**How It Works**:
- Affixes use same applicator system as traits
- Evaluator automatically includes affix effects
- No service changes needed
- Supports stacking rules (configure in evaluator)

---

## Benefits Summary

### For Development Velocity
- ✅ New traits = just JSON data, no code changes
- ✅ Self-documenting (effects declared in data)
- ✅ Faster iteration (no compile/test cycle for data changes)

### For Game Balance
- ✅ Central effect tuning (adjust values in data files)
- ✅ Detailed logging (see which effects applied and why)
- ✅ Easy A/B testing (swap effect values)

### For Future Features
- ✅ Affix system ready to go
- ✅ Set bonuses (future: multiple items trigger effects)
- ✅ Enchantment system (permanent item upgrades)
- ✅ Curse system (negative effects with upsides)

---

## Next Actions

1. **Fix Reinforced trait data** - Add missing `combat.armorBonus` to old effects
2. **Migrate remaining combat traits** - Reinforced, Balanced
3. **Integrate combat service** - Use effectEvaluator for damage/armor calculations
4. **Test in game** - Verify trait effects apply correctly
5. **Migrate activity modifiers** - Balanced trait, Grain quality
6. **Integrate activity handler** - Use effectEvaluator for duration modifiers
7. **Document workflow** - Create guide for adding new traits/affixes

---

## Questions?

- **Performance**: Evaluation is fast (simple loops, no DB queries). Cached equipment lookups.
- **Stacking**: Currently additive (all effects sum). Can configure priority/exclusivity rules if needed.
- **UI Display**: Effect descriptions can be shown in item tooltips (`applicator.description`)
- **Backward Compatibility**: Legacy effects supported during migration, can be removed after full migration

Ready to proceed with Phase 1 (Combat Traits)?
