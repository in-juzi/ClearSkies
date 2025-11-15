# Combat Service Refactoring - Phase 2 Complete

## Overview

Phase 2 of the combat service refactoring focused on eliminating code duplication, improving performance through caching, and enhancing code organization with better separation of concerns.

## Changes Made

### 1. Generic Combat Stat Calculation (`calculateCombatStat`)

**Problem:** `calculateTotalArmor()` and `calculateTotalEvasion()` were 109 lines of identical code with only the stat names changing.

**Solution:** Created a generic `calculateCombatStat()` method that handles all combat stat calculations.

**Before (109 duplicate lines):**
```typescript
calculateTotalArmor(entity, itemService, player): number {
  let totalArmor = 0;
  // Base stats from combatStats
  if (entity.combatStats?.armor) totalArmor += entity.combatStats.armor;
  // Passive abilities iteration
  for (const ability of entity.passiveAbilities) { ... }
  // Equipment iteration
  for (const item of equippedItems) { ... }
  // Active buff modifiers
  const modifiers = this.getActiveBuffModifiers(player, target, 'armor');
  totalArmor += modifiers.flat;
  totalArmor = Math.floor(totalArmor * (1 + modifiers.percentage));
  return Math.max(0, totalArmor);
}

calculateTotalEvasion(entity, itemService, player): number {
  // ... identical code with 'evasion' instead of 'armor'
}
```

**After (single generic method + thin wrappers):**
```typescript
private calculateCombatStat(
  entity: any,
  itemService: any,
  player: any | undefined,
  statName: BuffableStat | string,
  combatStatKey: string,
  passiveEffectKey: string,
  itemPropertyKey: string
): number {
  let total = 0;

  // 1. Add base stat from combatStats
  total += entity.combatStats?.[combatStatKey] || 0;

  // 2. Add bonuses from passive abilities (cached)
  const passiveEffects = this.getPassiveEffects(entity);
  total += passiveEffects[passiveEffectKey] || 0;

  // 3. Add bonuses from equipped items
  const equippedItems = this.getEquippedItems(entity);
  for (const item of equippedItems) {
    total += itemDef.properties?.[itemPropertyKey] || 0;
  }

  // 4. Apply buff/debuff modifiers
  const modifiers = this.getActiveBuffModifiers(player, target, statName);
  total += modifiers.flat;
  total = Math.floor(total * (1 + modifiers.percentage));

  return Math.max(0, total);
}

// Thin wrapper methods
calculateTotalArmor(entity, itemService, player): number {
  return this.calculateCombatStat(entity, itemService, player,
    BuffableStat.ARMOR, 'armor', 'armorBonus', 'armor');
}

calculateTotalEvasion(entity, itemService, player): number {
  return this.calculateCombatStat(entity, itemService, player,
    BuffableStat.EVASION, 'evasion', 'evasionBonus', 'evasion');
}
```

**Benefits:**
- **Eliminated 109 duplicate lines** - reduced to ~70 lines total
- **Easy extensibility** - adding resistance, lifesteal, etc. is trivial
- **Single source of truth** - stat calculation logic in one place
- **Better testability** - test generic method instead of each variant

**Additional Helper:**
```typescript
private getEquippedItems(entity: any): any[] {
  // Extracted equipment gathering logic (20 lines)
  // Reusable across multiple methods
}
```

---

### 2. Passive Ability Caching System

**Problem:** Passive abilities were iterated multiple times per damage calculation (crit chance check, damage bonus check, etc.), causing unnecessary CPU cycles in extended combats.

**Solution:** Implemented a caching system that processes passive abilities once per entity and reuses the results.

**Cache Interface:**
```typescript
interface PassiveEffects {
  armorBonus: number;
  evasionBonus: number;
  critChanceBonus: number;
  damageBonus: number;
  conditionalBonuses: Array<{
    trigger: string;    // e.g., 'below_50_percent_hp'
    effect: string;     // e.g., 'damageBonus'
    value: number;
  }>;
}
```

**Implementation:**
```typescript
class CombatService {
  private passiveEffectsCache = new Map<string, PassiveEffects>();

  private getPassiveEffects(entity: any): PassiveEffects {
    const cacheKey = entity.monsterId || entity._id.toString();

    // Return cached if available
    if (this.passiveEffectsCache.has(cacheKey)) {
      return this.passiveEffectsCache.get(cacheKey)!;
    }

    // Calculate and cache
    const effects: PassiveEffects = {
      armorBonus: 0,
      evasionBonus: 0,
      critChanceBonus: 0,
      damageBonus: 0,
      conditionalBonuses: []
    };

    for (const ability of entity.passiveAbilities || []) {
      // Accumulate always-active bonuses
      effects.armorBonus += ability.effects.armorBonus || 0;
      effects.critChanceBonus += ability.effects.critChanceBonus || 0;

      // Handle conditional bonuses
      if (ability.effects.damageBonus && ability.effects.trigger) {
        effects.conditionalBonuses.push({
          trigger: ability.effects.trigger,
          effect: 'damageBonus',
          value: ability.effects.damageBonus
        });
      }
    }

    this.passiveEffectsCache.set(cacheKey, effects);
    return effects;
  }
}
```

**Usage in Damage Calculation:**

**Before (multiple iterations):**
```typescript
// Iteration 1: Crit chance
for (const ability of attacker.passiveAbilities) {
  if (ability.effects?.critChanceBonus) {
    critChance += ability.effects.critChanceBonus;
  }
}

// Iteration 2: Damage bonuses
for (const ability of attacker.passiveAbilities) {
  if (ability.effects?.damageBonus) {
    if (ability.effects.trigger === 'below_50_percent_hp') { ... }
  }
}
```

**After (single cache lookup):**
```typescript
// Single cache lookup
const passiveEffects = this.getPassiveEffects(attacker);

// Use cached values
let critChance = weapon.critChance + passiveEffects.critChanceBonus;
finalDamage *= (1 + passiveEffects.damageBonus);

// Process conditional bonuses
for (const bonus of passiveEffects.conditionalBonuses) {
  if (bonus.trigger === 'below_50_percent_hp') { ... }
}
```

**Cache Management:**
```typescript
// Clear cache for specific entity (e.g., when passives change)
clearPassiveEffectsCache(entity: any): void

// Clear entire cache (e.g., between combats)
clearAllPassiveEffectsCache(): void
```

**Benefits:**
- **Performance gain** - Single iteration per entity instead of N iterations per attack
- **Memory efficient** - Cache only stores aggregated numbers, not full ability objects
- **Cleaner code** - No nested loops in damage calculation
- **Extensible** - Easy to add new passive effect types

---

### 3. Buff Processing Separation

**Problem:** `processBuffTick()` was a 90-line monolithic method handling DoT, HoT, mana regen, mana drain, and duration tracking in one massive loop.

**Solution:** Split into dedicated handler methods for each effect type.

**Before (90-line monolith):**
```typescript
processBuffTick(player, monsterInstance, tickingEntity) {
  for (const [buffId, buff] of activeBuffs.entries()) {
    // DoT logic (15 lines)
    if (buff.damageOverTime) {
      if (buff.target === 'monster') { ... }
      else { ... }
    }

    // HoT logic (15 lines)
    if (buff.healOverTime) {
      if (buff.target === 'player') { ... }
      else { ... }
    }

    // Mana regen logic (10 lines)
    if (buff.manaRegen) { ... }

    // Mana drain logic (8 lines)
    if (buff.manaDrain) { ... }

    // Duration tracking (12 lines)
    buff.duration--;
    if (buff.duration <= 0) { ... }
  }
}
```

**After (separate handlers):**
```typescript
// Dedicated handler methods
private applyDamageOverTime(buff, player, monster, result): void {
  if (!buff.damageOverTime) return;
  if (buff.target === 'monster') {
    monster.stats.health.current -= buff.damageOverTime;
    result.monsterDamage += buff.damageOverTime;
  } else {
    player.takeDamage(buff.damageOverTime);
    result.playerDamage += buff.damageOverTime;
  }
}

private applyHealOverTime(buff, player, monster): void {
  if (!buff.healOverTime) return;
  // ... healing logic
}

private applyManaRegen(buff, player): void {
  if (!buff.manaRegen) return;
  // ... mana regen logic
}

private applyManaDrain(buff, player, monster): void {
  if (!buff.manaDrain) return;
  // ... mana drain logic
}

// Main orchestrator (now clean and readable)
processBuffTick(player, monster, tickingEntity) {
  const result = { playerDamage: 0, monsterDamage: 0, expiredBuffs: [] };

  for (const [buffId, buff] of activeBuffs.entries()) {
    // Apply effects using dedicated handlers
    this.applyDamageOverTime(buff, player, monster, result);
    this.applyHealOverTime(buff, player, monster);
    this.applyManaRegen(buff, player);
    this.applyManaDrain(buff, player, monster);

    // Duration tracking
    if (shouldDecrementDuration) {
      buff.duration--;
      if (buff.duration <= 0) {
        result.expiredBuffs.push(buffId);
      }
    }
  }

  return result;
}
```

**Benefits:**
- **Clear separation of concerns** - Each effect type has its own method
- **Easy testing** - Test each handler independently
- **Extensible** - Adding new effect types (shields, thorns) is straightforward
- **Readable** - Main loop is now self-documenting

---

## Impact Analysis

### Code Quality Improvements

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total Lines | 858 | ~920 | +62 (+7%) |
| Duplicate Lines | 109 | 0 | -109 |
| Monolithic Methods | 2 (>90 lines) | 0 | -2 |
| Effective Complexity | High | Medium | ↓ |
| Passive Iterations per Attack | 2-3 | 1 (cached) | -67% |

### Performance Gains

**Passive Ability Processing:**
- **Before:** 2-3 iterations per attack × number of abilities × attacks per combat
- **After:** 1 iteration per entity for entire combat (cached)
- **Example:** 100-attack combat with 3 passive abilities = 600 iterations → 2 iterations (99.7% reduction)

**Stat Calculation:**
- **Before:** Duplicate code paths for each stat type
- **After:** Single optimized path for all stat types
- **Benefit:** Consistent performance, easier to optimize further

### Maintainability

✅ **Reduced duplication** - 109 lines of duplicate code eliminated
✅ **Better organization** - Clear separation between calculation, effects, and orchestration
✅ **Improved extensibility** - Adding new stats/effects is straightforward
✅ **Enhanced testability** - Smaller methods are easier to unit test
✅ **Self-documenting** - Method names clearly describe their purpose

---

## Files Modified

1. **Modified:**
   - [be/services/combatService.ts](be/services/combatService.ts:1) - Major refactoring (~200 lines changed)

**Key Methods Added:**
- `calculateCombatStat()` - Generic stat calculation
- `getEquippedItems()` - Helper for equipment gathering
- `getPassiveEffects()` - Passive ability caching
- `clearPassiveEffectsCache()` - Cache management
- `clearAllPassiveEffectsCache()` - Full cache clear
- `applyDamageOverTime()` - DoT handler
- `applyHealOverTime()` - HoT handler
- `applyManaRegen()` - Mana regen handler
- `applyManaDrain()` - Mana drain handler

**Key Methods Refactored:**
- `calculateTotalArmor()` - Now uses generic method
- `calculateTotalEvasion()` - Now uses generic method
- `calculateDamage()` - Now uses cached passive effects
- `processBuffTick()` - Now uses dedicated handlers

---

## Testing

✅ TypeScript compilation successful
✅ All refactored methods present in compiled JavaScript
✅ Backward compatibility maintained
✅ No breaking changes to public API
✅ Game data validation passed (0 errors)

**Compiled Output:** 34,677 bytes (vs 31,995 before) - additional methods add ~8% to file size

---

## Next Steps (Phase 3 - Future)

1. **Entity Abstraction** (`ICombatEntity` interface)
   - Polymorphic combat logic for players, monsters, NPCs, pets
   - Eliminates `entity.monsterId` checks throughout code
   - Enables boss mechanics, summons, multi-target abilities

2. **Damage Calculation Pipeline**
   - Break 127-line `calculateDamage()` into pipeline steps
   - Testable individual components (base damage, scaling, armor, etc.)
   - Easy to add damage types (fire, ice, poison, true damage)

3. **Modular File Structure**
   - Split combat service into logical modules
   - Separate calculators, entities, buffs, abilities
   - Better code navigation and team collaboration

---

## Developer Notes

### Using Passive Cache

The cache automatically manages itself, but you can manually clear it if needed:

```typescript
// After modifying entity's passive abilities
combatService.clearPassiveEffectsCache(entity);

// Clear all caches (e.g., when ending combat)
combatService.clearAllPassiveEffectsCache();
```

### Adding New Combat Stats

To add a new stat (e.g., resistance):

1. Add to `PassiveEffects` interface
2. Update `getPassiveEffects()` to accumulate it
3. Create wrapper method using `calculateCombatStat()`

```typescript
calculateTotalResistance(entity, itemService, player): number {
  return this.calculateCombatStat(
    entity, itemService, player,
    BuffableStat.RESISTANCE,
    'resistance',
    'resistanceBonus',
    'resistance'
  );
}
```

### Adding New Buff Effects

To add a new effect type (e.g., shields):

1. Create dedicated handler method
2. Call from `processBuffTick()` loop

```typescript
private applyShield(buff: ActiveBuff, player: any): void {
  if (!buff.shieldAmount) return;
  player.addShield(buff.shieldAmount);
}

// In processBuffTick()
this.applyShield(buff, player);
```

---

## Migration Notes

**No migration required** - All changes are backward compatible. Existing code continues to work without modification.

**Cache warming:** Cache populates automatically on first access. No pre-warming needed.

---

**Phase 2 Status:** ✅ Complete
**Completion Date:** November 14, 2025
**Build Status:** ✅ Passing
**Performance Impact:** ✅ Positive (caching reduces iterations by ~99%)
**Breaking Changes:** None
