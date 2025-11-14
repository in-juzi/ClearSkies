# Combat Service Refactoring - Phase 1 Complete

## Overview

Phase 1 of the combat service refactoring focused on extracting magic numbers and improving type safety with minimal risk to existing functionality.

## Changes Made

### 1. Created Combat Constants (`be/data/constants/combat-constants.ts`)

Extracted all magic numbers into a centralized configuration file:

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

**Benefits:**
- Single file to tune all combat formulas
- Self-documenting game mechanics
- No need to search code for balance changes
- Includes detailed comments explaining each formula

### 2. Created Combat Enums (`shared/types/combat-enums.ts`)

Added type-safe enums for combat properties:

```typescript
export enum BuffableStat {
  ARMOR = 'armor',
  EVASION = 'evasion',
  DAMAGE = 'damage',
  CRIT_CHANCE = 'critChance',
  ATTACK_SPEED = 'attackSpeed',
  HEALTH_REGEN = 'healthRegen',
  MANA_REGEN = 'manaRegen',
  RESISTANCE = 'resistance',
  LIFESTEAL = 'lifesteal'
}

export enum ModifierType {
  FLAT = 'flat',           // +10 armor
  PERCENTAGE = 'percentage', // +20% damage
  MULTIPLIER = 'multiplier'  // 2x damage
}

export enum PassiveTrigger {
  ALWAYS = 'always',
  BELOW_50_PERCENT_HP = 'below_50_percent_hp',
  ABOVE_75_PERCENT_HP = 'above_75_percent_hp',
  COMBAT_START = 'combat_start',
  KILL_ENEMY = 'kill_enemy',
  TAKE_DAMAGE = 'take_damage',
  DEAL_CRIT = 'deal_crit'
}

export enum CombatLogTypeEnum {
  SYSTEM = 'system',
  ATTACK = 'attack',
  ABILITY = 'ability',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  HEAL = 'heal',
  MISS = 'miss',
  CRIT = 'crit',
  DODGE = 'dodge'
}
```

**Benefits:**
- Autocomplete for all stat names
- Prevents typos ("armour" vs "armor")
- Self-documenting API
- Easy to add new stats/modifiers

### 3. Updated StatModifier Interface (`shared/types/combat.ts`)

Enhanced type safety while maintaining backward compatibility:

```typescript
export interface StatModifier {
  stat: BuffableStat | string;              // Type-safe or legacy string
  type: ModifierType | StatModifierType;    // Type-safe or legacy string
  value: number;
}
```

**Benefits:**
- New code can use enums for type safety
- Existing code continues to work with strings
- Gradual migration path

### 4. Updated CombatService (`be/services/combatService.ts`)

Replaced all magic numbers with constants:

**Before:**
```typescript
return armor / (armor + 1000);
const chance = evasion / (evasion + 1000);
return Math.min(0.75, chance);
finalDamage = Math.floor(scaledDamage * 2);
```

**After:**
```typescript
return armor / (armor + COMBAT_FORMULAS.ARMOR_SCALING_FACTOR);
const chance = evasion / (evasion + COMBAT_FORMULAS.EVASION_SCALING_FACTOR);
return Math.min(COMBAT_FORMULAS.EVASION_CAP, chance);
finalDamage = Math.floor(scaledDamage * COMBAT_FORMULAS.CRIT_MULTIPLIER);
```

Updated 15+ locations throughout the service with type-safe constants.

## Files Modified

1. **Created:**
   - `be/data/constants/combat-constants.ts`
   - `shared/types/combat-enums.ts`
   - `project/docs/combat-service-refactoring-phase1.md`

2. **Modified:**
   - `be/services/combatService.ts` (~15 changes)
   - `shared/types/combat.ts` (added enum imports, updated StatModifier interface)
   - `shared/types/index.ts` (export new enums)

## Testing

✅ TypeScript compilation successful
✅ All constants properly imported in compiled JavaScript
✅ Enum types compiled correctly
✅ Backward compatibility maintained (no breaking changes)
✅ Game data validation passed (0 errors, 17 warnings - pre-existing)

## Impact Analysis

**Code Changes:** ~50 lines added, ~20 lines modified
**Risk Level:** **Low** - purely additive, no logic changes
**Breaking Changes:** None
**Performance Impact:** None (constants are inlined at compile time)

## Next Steps (Phase 2 - Future)

1. **Consolidate duplicate stat calculation** - Merge `calculateTotalArmor()` and `calculateTotalEvasion()` into generic `calculateCombatStat()`
2. **Add passive ability caching** - Cache passive effects per entity to avoid multiple iterations
3. **Split buff processing** - Separate handlers per effect type (DoT, HoT, mana regen, etc.)

## Future Benefits

This refactoring enables:

✅ **Easy balance tuning** - Change one constant, affect entire combat system
✅ **Clear documentation** - Constants file documents all game mechanics
✅ **Type safety** - Enums prevent typos and enable autocomplete
✅ **Extensibility** - Easy to add new stats (resistance, lifesteal) or modifiers
✅ **Testability** - Can mock COMBAT_FORMULAS for unit tests
✅ **Future phases** - Foundation for entity abstraction and damage calculation refactoring

## Developer Notes

To modify combat balance:
1. Edit `be/data/constants/combat-constants.ts`
2. Run `npm run build` in `be/` directory
3. Test changes in game

To add new buffable stats:
1. Add to `BuffableStat` enum in `shared/types/combat-enums.ts`
2. Add logic to calculate/apply stat in `combatService.ts`
3. Run `npm run build`

---

**Phase 1 Status:** ✅ Complete
**Completion Date:** November 14, 2025
**Build Status:** ✅ Passing
**Validation Status:** ✅ Passing (0 errors, 17 pre-existing warnings)
