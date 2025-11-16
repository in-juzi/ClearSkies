# Creating Traits and Affixes - Quick Reference Guide

**For**: Adding new modifiers to the game without touching service code
**System**: Data-driven effect applicators

---

## Quick Start Templates

### Simple Flat Bonus

**Example**: +10 damage trait
```typescript
import { TraitDefinition } from '@shared/types';
import { EffectContext, ModifierType, ConditionType } from '@shared/types/effect-system';

export const MyTrait: TraitDefinition = {
  traitId: "my_trait",
  name: "My Trait",
  shorthand: "MT",
  description: "Grants bonus damage",
  rarity: "uncommon",
  applicableCategories: ["equipment"],
  maxLevel: 3,
  levels: {
    "1": {
      name: "Tier 1",
      description: "Small damage boost (+5 damage)",
      effects: {
        vendorPrice: { modifier: 1.2 },
        applicators: [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 5,
            condition: { type: ConditionType.ALWAYS }
          }
        ]
      }
    },
    "2": {
      name: "Tier 2",
      description: "Medium damage boost (+10 damage)",
      effects: {
        vendorPrice: { modifier: 1.4 },
        applicators: [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 10,
            condition: { type: ConditionType.ALWAYS }
          }
        ]
      }
    },
    "3": {
      name: "Tier 3",
      description: "Large damage boost (+15 damage)",
      effects: {
        vendorPrice: { modifier: 1.6 },
        applicators: [
          {
            context: EffectContext.COMBAT_DAMAGE,
            modifierType: ModifierType.FLAT,
            value: 15,
            condition: { type: ConditionType.ALWAYS }
          }
        ]
      }
    }
  }
};
```

### Percentage Bonus

**Example**: +20% attack speed
```typescript
applicators: [
  {
    context: EffectContext.COMBAT_ATTACK_SPEED,
    modifierType: ModifierType.PERCENTAGE,
    value: 0.20,  // 0.20 = +20%
    condition: { type: ConditionType.ALWAYS },
    description: "+20% attack speed"
  }
]
```

### Activity Time Reduction

**Example**: -15% gathering time
```typescript
applicators: [
  {
    context: EffectContext.ACTIVITY_DURATION,
    modifierType: ModifierType.PERCENTAGE,
    value: -0.15,  // Negative = reduction
    condition: { type: ConditionType.ALWAYS },
    description: "-15% activity time"
  }
]
```

### Conditional Effect (HP Threshold)

**Example**: +50% damage when below 50% HP
```typescript
applicators: [
  {
    context: EffectContext.COMBAT_DAMAGE,
    modifierType: ModifierType.PERCENTAGE,
    value: 0.50,
    condition: {
      type: ConditionType.HP_BELOW_PERCENT,
      value: 0.50  // Triggers when HP < 50%
    },
    description: "+50% damage when below 50% HP"
  }
]
```

### Conditional Effect (Enemy Type)

**Example**: +30% damage vs beasts
```typescript
applicators: [
  {
    context: EffectContext.COMBAT_DAMAGE,
    modifierType: ModifierType.PERCENTAGE,
    value: 0.30,
    condition: {
      type: ConditionType.TARGET_TYPE,
      value: ["beast", "wild_animal"]  // Array for multiple types
    },
    description: "+30% damage vs beasts"
  }
]
```

### Conditional Effect (Activity Type)

**Example**: +25% XP for woodcutting/mining
```typescript
applicators: [
  {
    context: EffectContext.ACTIVITY_XP_GAIN,
    modifierType: ModifierType.PERCENTAGE,
    value: 0.25,
    condition: {
      type: ConditionType.ACTIVITY_TYPE,
      value: ["woodcutting", "mining"]
    },
    description: "+25% XP for woodcutting and mining"
  }
]
```

### Multi-Effect Trait

**Example**: Berserker (+damage, -armor)
```typescript
applicators: [
  {
    context: EffectContext.COMBAT_DAMAGE,
    modifierType: ModifierType.PERCENTAGE,
    value: 0.30,
    condition: { type: ConditionType.ALWAYS },
    description: "+30% damage"
  },
  {
    context: EffectContext.COMBAT_ARMOR,
    modifierType: ModifierType.PERCENTAGE,
    value: -0.20,  // Negative = penalty
    condition: { type: ConditionType.ALWAYS },
    description: "-20% armor"
  }
]
```

### Granted Ability Affix (Future)

**Example**: Grants Fireball ability when equipped
```typescript
applicators: [
  {
    context: EffectContext.GRANTS_ABILITY,
    modifierType: ModifierType.FLAT,
    value: 1,
    abilityId: "fireball",
    condition: {
      type: ConditionType.EQUIPPED_SLOT,
      value: "mainHand"
    },
    description: "Grants Fireball ability"
  }
]
```

---

## Available Effect Contexts

### Combat Stats
- `EffectContext.COMBAT_DAMAGE` - Outgoing damage
- `EffectContext.COMBAT_ARMOR` - Damage reduction
- `EffectContext.COMBAT_EVASION` - Dodge chance
- `EffectContext.COMBAT_CRIT_CHANCE` - Critical hit chance
- `EffectContext.COMBAT_ATTACK_SPEED` - Attack frequency
- `EffectContext.COMBAT_HEALTH_REGEN` - HP regeneration
- `EffectContext.COMBAT_MANA_REGEN` - MP regeneration

### Activity Bonuses
- `EffectContext.ACTIVITY_DURATION` - Activity time (negative = faster)
- `EffectContext.ACTIVITY_XP_GAIN` - Experience gained
- `EffectContext.ACTIVITY_YIELD_QUANTITY` - More resources
- `EffectContext.ACTIVITY_YIELD_QUALITY` - Better quality items

### Crafting Bonuses
- `EffectContext.CRAFTING_QUALITY_BONUS` - Higher quality output
- `EffectContext.CRAFTING_SUCCESS_RATE` - Less failure
- `EffectContext.CRAFTING_YIELD_MULTIPLIER` - More items crafted

### Economic
- `EffectContext.VENDOR_SELL_PRICE` - Sell for more gold
- `EffectContext.VENDOR_BUY_PRICE` - Buy for less gold

### Special
- `EffectContext.CONSUMABLE_BUFF` - Apply buff on consumption
- `EffectContext.CONSUMABLE_HOT` - Heal over time
- `EffectContext.CONSUMABLE_DOT` - Damage over time
- `EffectContext.GRANTS_ABILITY` - Unlock ability while equipped

---

## Modifier Types

### Flat Bonuses
```typescript
modifierType: ModifierType.FLAT
value: 10  // +10 to stat
```
**Use for**: Damage, armor, HP, fixed bonuses

### Percentage Bonuses
```typescript
modifierType: ModifierType.PERCENTAGE
value: 0.25  // +25% to stat
value: -0.15 // -15% to stat (penalty/reduction)
```
**Use for**: Time reductions, XP gains, attack speed, percentage buffs

### Multipliers
```typescript
modifierType: ModifierType.MULTIPLIER
value: 2.0  // 2x stat (double)
value: 0.5  // 0.5x stat (half)
```
**Use for**: Rare/legendary effects, cursed items, special mechanics

**Calculation Order**: `(base + flat) * (1 + percentage) * multiplier`

---

## Condition Types

### Always Active
```typescript
condition: { type: ConditionType.ALWAYS }
```
No runtime check needed.

### HP Thresholds
```typescript
// Below absolute HP
condition: { type: ConditionType.HP_BELOW, value: 100 }

// Below percentage HP
condition: { type: ConditionType.HP_BELOW_PERCENT, value: 0.50 }

// Above absolute HP
condition: { type: ConditionType.HP_ABOVE, value: 500 }

// Above percentage HP
condition: { type: ConditionType.HP_ABOVE_PERCENT, value: 0.75 }
```

### Combat State
```typescript
condition: { type: ConditionType.IN_COMBAT }
condition: { type: ConditionType.OUT_OF_COMBAT }
```

### Activity Restrictions
```typescript
// Specific skill
condition: {
  type: ConditionType.ACTIVITY_TYPE,
  value: "woodcutting"  // Single skill
}

condition: {
  type: ConditionType.ACTIVITY_TYPE,
  value: ["woodcutting", "mining", "fishing"]  // Multiple skills
}

// Specific location
condition: {
  type: ConditionType.ACTIVITY_LOCATION,
  value: "forest-clearing"
}
```

### Enemy Targeting
```typescript
// Specific monster type
condition: {
  type: ConditionType.TARGET_TYPE,
  value: ["beast", "undead"]
}

// Target low HP
condition: {
  type: ConditionType.TARGET_BELOW_HP_PERCENT,
  value: 0.25  // Target < 25% HP
}
```

### Equipment State
```typescript
// Shield equipped
condition: { type: ConditionType.SHIELD_EQUIPPED }

// Two-handed weapon
condition: { type: ConditionType.TWO_HANDED }

// Dual wielding
condition: { type: ConditionType.DUAL_WIELDING }

// Specific slot
condition: {
  type: ConditionType.EQUIPPED_SLOT,
  value: "mainHand"
}
```

### Character Progression
```typescript
// Skill level requirement
condition: {
  type: ConditionType.SKILL_LEVEL_ABOVE,
  value: { skill: "woodcutting", level: 50 }
}

// Attribute requirement
condition: {
  type: ConditionType.ATTRIBUTE_ABOVE,
  value: { attribute: "strength", value: 30 }
}
```

---

## Workflow

### 1. Create Trait Definition File

**File**: `be/data/items/traits/definitions/MyTrait.ts`

```typescript
import { TraitDefinition } from '@shared/types';
import { EffectContext, ModifierType, ConditionType } from '@shared/types/effect-system';

export const MyTrait: TraitDefinition = {
  // ... trait definition with applicators
};
```

### 2. Register in TraitRegistry

**File**: `be/data/items/traits/TraitRegistry.ts`

```typescript
import { MyTrait } from './definitions/MyTrait';

export class TraitRegistry {
  private static traits = new Map([
    // ... existing traits
    ['my_trait', MyTrait],
  ]);
}
```

### 3. Add to Item Definitions

**File**: `be/data/items/definitions/equipment/MyWeapon.ts`

```typescript
import { TRAIT_IDS } from '../../../constants/item-constants';

allowedTraits: [TRAIT_IDS.MY_TRAIT, TRAIT_IDS.HARDENED]
```

### 4. Test In Game

No service changes needed! The effect evaluator automatically:
- Finds all equipped items
- Checks for traits/qualities
- Evaluates applicators
- Applies effects based on context

**That's it!** The effect will automatically work in combat/activities/crafting.

---

## Debugging

### Check Applied Effects

The evaluation result includes detailed logging:

```typescript
const result = effectEvaluator.evaluatePlayerEffects(player, EffectContext.COMBAT_DAMAGE);

console.log(result.appliedEffects);  // See which effects were used
console.log(result.skippedEffects);  // See which were skipped and why
console.log(result.flatBonus);       // Total flat bonus
console.log(result.percentageBonus); // Total percentage bonus
console.log(result.multiplier);      // Total multiplier
```

### Common Issues

**Effect not applying?**
- Check if trait is registered in TraitRegistry
- Check if item has trait in `allowedTraits` array
- Check if player has item equipped
- Check if condition is met (runtime context)

**Wrong magnitude?**
- Verify `value` in applicator (0.20 = 20%, not 20)
- Check modifier type (FLAT vs PERCENTAGE vs MULTIPLIER)
- Verify calculation formula: `(base + flat) * (1 + percentage) * multiplier`

**Condition not triggering?**
- Check runtime context passed to evaluator
- Verify condition value matches runtime data type
- Add logging in `effectEvaluator.isConditionMet()`

---

## Best Practices

### Naming Conventions
- Trait IDs: lowercase_snake_case (`hardened`, `of_fury`)
- Display names: Title Case (`Hardened`, `of Fury`)
- Descriptions: Include effect magnitude (`+10 damage`, `-15% time`)

### Balance Guidelines
- **Flat bonuses**: Scale with item tier (T1: +2, T2: +5, T3: +10)
- **Percentage bonuses**: Cap at +50% for single effect
- **Multi-effect traits**: Positive + negative for balance
- **Conditional effects**: Higher magnitude allowed (situational)

### Documentation
- Always include `description` field in applicators
- Use clear, player-friendly language
- Include effect magnitude in trait level descriptions

### Future-Proofing
- Use enums (EffectContext, ModifierType) not magic strings
- Import from `@shared/types/effect-system` for type safety
- Test with multiple levels/conditions to ensure scalability

---

## Questions?

See [047-data-driven-effect-system-implementation.md](047-data-driven-effect-system-implementation.md) for full architecture details.
