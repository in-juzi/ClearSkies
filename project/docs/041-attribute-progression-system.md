# Attribute-Based Progression System

**Date**: 2025-01-15
**Status**: Planned

## Overview

This document describes the attribute-based progression system that makes player HP, MP, and carrying capacity scale dynamically with attribute levels. This replaces the previous static values and gives attributes meaningful gameplay impact beyond their skill-linked XP bonuses.

## Design Rationale

### Problem Statement

Prior to this system, several core player properties were static and didn't reward character progression:
- **HP**: Fixed value, didn't increase with level or strength
- **MP**: Fixed value, didn't scale with magical aptitude
- **Inventory Capacity**: Item count limit (arbitrary number of items regardless of what they are)

This created a disconnect where players could become masters of combat or magic but still have the same survivability and resources as a fresh character.

### Solution

Tie these properties to the attribute system, making character building meaningful:
1. **HP scales with physical attributes** (Strength, Endurance, Will)
2. **MP scales with mental attributes** (Wisdom, Will)
3. **Carrying capacity uses weight-based system** tied to physical strength

## Attribute Rename: Magic → Wisdom

### Rationale

"Magic" as an attribute name doesn't fit the medieval fantasy setting - magic is something you *do*, not something you *are*. "Wisdom" better captures the intended concept:
- Mental fortitude and spiritual power
- Magical understanding and channeling ability
- Aligns with traditional RPG conventions (D&D, etc.)

### Migration Required

Database migration needed to rename the attribute in existing player documents:
```javascript
// Migration: rename 'magic' to 'wisdom' in attributes map
db.players.updateMany(
  {},
  { $rename: { 'attributes.magic': 'attributes.wisdom' } }
);
```

## HP Scaling Formula

### Formula
```
HP = Base HP + (Strength × STR_HP_BONUS) + (Endurance × END_HP_BONUS) + (Will × WILL_HP_BONUS)
```

### Proposed Values
```javascript
const BASE_HP = 10;
const STR_HP_BONUS = 4;  // Primary physical stat
const END_HP_BONUS = 2;  // Secondary - stamina/toughness
const WILL_HP_BONUS = 1; // Tertiary - mental fortitude
```

### Scaling Examples

| STR | END | WILL | Total HP | Notes |
|-----|-----|------|----------|-------|
| 1   | 1   | 1    | 17       | Fresh character |
| 10  | 10  | 10   | 80       | Early game |
| 25  | 25  | 25   | 185      | Mid game |
| 50  | 50  | 50   | 360      | High level |
| 100 | 100 | 100  | 710      | Endgame |

### Attribute Synergies

- **Strength**: Primary HP stat, also linked to melee combat skills
- **Endurance**: Secondary HP stat, linked to fishing/smithing
- **Will**: Tertiary HP stat, linked to gathering/cooking/alchemy AND provides MP

This creates interesting build choices - pure mages still get some HP from Will, while warriors naturally become tanky.

## MP Scaling Formula

### Formula
```
MP = Base MP + (Wisdom × WIS_MP_BONUS) + (Will × WILL_MP_BONUS)
```

### Proposed Values (Conservative)
```javascript
const BASE_MP = 10;
const WIS_MP_BONUS = 6;  // Primary magical stat (reduced from initial 10)
const WILL_MP_BONUS = 3; // Secondary - mental reserves (reduced from initial 4)
```

### Original vs Conservative Scaling

| Level | Original (WIS×10, WILL×4) | Conservative (WIS×6, WILL×3) | Difference |
|-------|---------------------------|------------------------------|------------|
| 10/10 | 150 MP                    | 100 MP                       | -50 MP     |
| 25/25 | 360 MP                    | 235 MP                       | -125 MP    |
| 50/50 | 710 MP                    | 460 MP                       | -250 MP    |

**Rationale for Conservative Values**:
- Prevents mana from scaling too aggressively early
- Leaves room to buff later if abilities feel too expensive
- Easier to increase scaling than decrease it post-launch
- Still provides meaningful mana growth (×46 from level 1 to 50)

### Attribute Synergies

- **Wisdom**: Primary MP stat, linked to casting skill
- **Will**: Provides both HP and MP, linked to gathering/cooking/alchemy

Will becomes a "hybrid" stat valuable to all playstyles, while Wisdom is specialist for magic users.

## Carrying Capacity Formula

### Weight-Based System

Replaces the old item count limit with a weight-based system that's more realistic and immersive.

### Formula
```
Carrying Capacity (kg) = Base Capacity + (Strength × STR_CAPACITY_BONUS) + (Endurance × END_CAPACITY_BONUS)
```

### Proposed Values
```javascript
const BASE_CAPACITY_KG = 50;  // Average deadlift for untrained individuals
const STR_CAPACITY_BONUS = 2; // +2 kg per Strength level
const END_CAPACITY_BONUS = 1; // +1 kg per Endurance level
```

### Scaling Examples

| STR | END | Capacity | Example Loadout |
|-----|-----|----------|-----------------|
| 1   | 1   | 53 kg    | Light gear + some herbs |
| 10  | 10  | 80 kg    | Full armor + weapon + resources |
| 25  | 25  | 125 kg   | Heavy equipment + large haul |
| 50  | 50  | 200 kg   | Warrior with full inventory |

### Weight Guidelines by Item Category

Recommended weight assignments for items:

| Category | Weight Range | Examples |
|----------|--------------|----------|
| **Consumables** | 0.2 - 0.5 kg | Potions, food, elixirs |
| **Herbs/Flowers** | 0.05 - 0.1 kg | Chamomile, nettle, sage |
| **Fish** | 0.5 - 2 kg | Small fish (0.5kg), large fish (2kg) |
| **Ore** | 3 - 8 kg | Copper ore (3kg), iron ore (5kg) |
| **Ingots** | 2 - 5 kg | Copper ingot (2kg), iron ingot (4kg) |
| **Wood/Logs** | 1 - 3 kg | Oak log (2kg), pine log (1.5kg) |
| **Weapons** | 1 - 4 kg | Dagger (1kg), sword (2.5kg), axe (4kg) |
| **Armor** | 3 - 10 kg | Leather (3kg), bronze (6kg), iron (10kg) |
| **Tools** | 1 - 3 kg | Pickaxe (2.5kg), fishing rod (1kg) |
| **Gemstones** | 0.1 - 0.3 kg | Ruby, sapphire, diamond |

### Player Housing Integration (Future)

When housing is implemented, storage will work differently:
- **Carried Inventory**: Weight-based (what you carry in the world)
- **House Storage**: Count-based (shelf/chest space doesn't care about weight)
- **Example**: Carry 100 flowers (10kg) easily, but house storage limited by container slots

This creates meaningful gameplay:
- Light items (herbs, gems) easy to carry in bulk
- Heavy items (armor, ore) require strength or multiple trips
- House storage valuable for hoarding resources

## Additional Attribute Benefits

### Perception
- **Drop Quality**: +1% chance for higher quality items per level
- **Critical Hits**: +0.5% crit chance in combat per level
- **Hidden Content**: Unlock rare gathering spots at thresholds (25, 50, 75)

### Dexterity
- **Activity Speed**: -0.5% duration per level (max -25% at level 50)
- **Evasion**: +1% dodge chance in combat per level
- **Crafting Quality**: Improved success rates for quality inheritance

### Charisma
- **Vendor Prices**: -1% buy prices, +1% sell prices per level
- **Special Stock**: Unlock rare vendor items at thresholds (25, 50, 75)
- **Quest Rewards**: Better rewards from NPC interactions (future)

## Implementation Details

### Backend Changes Required

1. **Player Model** ([be/models/Player.ts](../../be/models/Player.ts))
   - Rename `attributes.magic` → `attributes.wisdom`
   - Add virtual properties: `maxHP`, `maxMP`, `carryingCapacity`
   - Calculate based on attribute levels using formulas above
   - Add `currentWeight` calculated field (sum of inventory item weights)

2. **Item Type System** ([shared/types/items.ts](../../shared/types/items.ts))
   - Add required `weight` property (number, in kg) to base Item interface
   - Update all item definitions with appropriate weights

3. **Inventory Controller** ([be/controllers/inventoryController.ts](../../be/controllers/inventoryController.ts))
   - Replace item count checks with weight checks
   - Validate `player.currentWeight + newItemWeight <= player.carryingCapacity`
   - Return weight errors with helpful messages

4. **Combat Service** ([be/services/combatService.ts](../../be/services/combatService.ts))
   - Update damage calculations to reference `player.maxHP`
   - Update ability costs to reference `player.maxMP`
   - Update healing/mana restoration to respect new maximums

### Frontend Changes Required

1. **Inventory Component** ([ui/src/app/components/game/inventory/](../../ui/src/app/components/game/inventory/))
   - Display: "Weight: 45.2 / 80 kg" instead of "Items: 23 / 50"
   - Color-code weight display:
     - Green: < 80% capacity
     - Yellow: 80-95% capacity
     - Red: 95-100% capacity
   - Show individual item weights in tooltips

2. **Character Status Component** ([ui/src/app/components/game/character-status/](../../ui/src/app/components/game/character-status/))
   - Display calculated HP/MP with formula tooltips on hover
   - Example tooltip: "HP: 142 (Base 10 + STR 60 + END 40 + WILL 32)"
   - Show carrying capacity with formula tooltip

3. **Attributes Component** ([ui/src/app/components/game/attributes/](../../ui/src/app/components/game/attributes/))
   - Rename "Magic" → "Wisdom" in UI
   - Show attribute benefits in tooltips (HP, MP, capacity bonuses)
   - Display next-level preview (e.g., "+4 HP, +6 MP at next level")

### Database Migration

**File**: `be/migrations/008-rename-magic-to-wisdom.js`

```javascript
exports.up = async function(db) {
  // Rename magic attribute to wisdom for all players
  await db.collection('players').updateMany(
    {},
    {
      $rename: {
        'attributes.magic.level': 'attributes.wisdom.level',
        'attributes.magic.experience': 'attributes.wisdom.experience'
      }
    }
  );

  console.log('Renamed magic attribute to wisdom');
};

exports.down = async function(db) {
  // Revert wisdom back to magic
  await db.collection('players').updateMany(
    {},
    {
      $rename: {
        'attributes.wisdom.level': 'attributes.magic.level',
        'attributes.wisdom.experience': 'attributes.magic.experience'
      }
    }
  );

  console.log('Reverted wisdom attribute to magic');
};
```

### Constants File

Create `shared/constants/attribute-constants.ts`:

```typescript
export const ATTRIBUTE_SCALING = {
  // HP Scaling
  BASE_HP: 10,
  STR_HP_BONUS: 4,
  END_HP_BONUS: 2,
  WILL_HP_BONUS: 1,

  // MP Scaling
  BASE_MP: 10,
  WIS_MP_BONUS: 6,
  WILL_MP_BONUS: 3,

  // Carrying Capacity
  BASE_CAPACITY_KG: 50,
  STR_CAPACITY_BONUS: 2,
  END_CAPACITY_BONUS: 1,

  // Other Attributes
  PERCEPTION_QUALITY_BONUS: 0.01,    // 1% per level
  PERCEPTION_CRIT_BONUS: 0.005,      // 0.5% per level
  DEXTERITY_SPEED_BONUS: 0.005,      // 0.5% per level (max 25%)
  DEXTERITY_EVASION_BONUS: 0.01,     // 1% per level
  CHARISMA_VENDOR_BONUS: 0.01        // 1% per level
} as const;
```

## Game Balance Considerations

### Potential Issues

1. **Will is Very Powerful**
   - Affects HP, MP, AND alchemy skill
   - May become "must-have" stat for all builds
   - **Alternative**: Remove HP bonus from Will, give it debuff resistance instead

2. **High-Level HP Scaling**
   - At level 100 attributes: 710 HP
   - Needs playtesting to ensure combat remains challenging
   - May require enemy damage scaling adjustments

3. **Mana Abundance**
   - Even conservative scaling gives 460 MP at level 50
   - Abilities need appropriate costs to avoid spam
   - Consider mana regeneration rates

### Tuning Recommendations

Start conservative, tune upward based on playtesting:
- It's easier to buff than nerf
- Players prefer buffs over nerfs
- Early-game feel is most important (first 10 levels)
- Monitor high-level balance through analytics

## Benefits

1. **Character Progression Feels Meaningful**
   - Every attribute level provides tangible benefits
   - Players see immediate impact (more HP, more carrying capacity)

2. **Build Diversity**
   - Strength builds = high HP, heavy gear
   - Wisdom builds = high MP, magic focus
   - Hybrid builds = balanced stats

3. **Immersive Weight System**
   - Realistic limitations (can't carry 1000 ore)
   - Strategic choices (what to keep vs drop)
   - Makes inventory management engaging

4. **Future-Proof Architecture**
   - Easy to add new attribute bonuses
   - Housing storage differentiates from carried weight
   - Scales well with new content

## Future Expansion

### Potential Additions

1. **Over-Encumbered State**
   - Allow exceeding capacity with penalties
   - -50% movement speed, can't gather, can't fast travel
   - Encourages strategic load management

2. **Attribute Milestones**
   - Special unlocks at 25/50/75/100 levels
   - Perception: Rare gathering spots
   - Charisma: Exclusive vendor stock
   - Dexterity: Crafting specializations

3. **Equipment Weight Reduction**
   - Special armor traits reduce worn item weight
   - Bags/containers add capacity
   - Pack animals/mounts (future)

4. **Attribute Respeccing**
   - Allow players to redistribute points (costly)
   - Prevents "trap" builds
   - Enables experimentation

5. **Soft Caps**
   - Diminishing returns after certain thresholds
   - Prevents extreme min-maxing
   - Example: HP scaling reduced by 50% after 500 HP

## Related Documentation

- [011-level-based-quality-trait-system.md](011-level-based-quality-trait-system.md) - Quality/trait scaling system
- [017-combat-system.md](017-combat-system.md) - Combat mechanics and damage calculations
- [032-xp-system.md](032-xp-system.md) - Skill and attribute XP progression
- [034-database-migrations.md](034-database-migrations.md) - Migration system documentation

## Implementation Files

### Backend
- [be/models/Player.ts](../../be/models/Player.ts) - Player model with attribute calculations
- [be/services/combatService.ts](../../be/services/combatService.ts) - Combat HP/MP usage
- [be/controllers/inventoryController.ts](../../be/controllers/inventoryController.ts) - Weight validation
- [shared/constants/attribute-constants.ts](../../shared/constants/attribute-constants.ts) - Scaling formulas (to be created)
- [shared/types/items.ts](../../shared/types/items.ts) - Item weight property
- [be/migrations/008-rename-magic-to-wisdom.js](../../be/migrations/008-rename-magic-to-wisdom.js) - Attribute rename migration (to be created)

### Frontend
- [ui/src/app/components/game/character-status/](../../ui/src/app/components/game/character-status/) - HP/MP display with tooltips
- [ui/src/app/components/game/inventory/](../../ui/src/app/components/game/inventory/) - Weight-based capacity display
- [ui/src/app/components/game/attributes/](../../ui/src/app/components/game/attributes/) - Attribute benefits tooltips

## Testing Checklist

- [ ] Fresh character has base HP/MP/capacity values
- [ ] HP increases correctly when leveling STR/END/WILL
- [ ] MP increases correctly when leveling WIS/WILL
- [ ] Carrying capacity increases with STR/END levels
- [ ] Cannot add items that exceed weight capacity
- [ ] Weight display updates in real-time
- [ ] Formula tooltips show correct calculations
- [ ] Magic → Wisdom migration works on existing players
- [ ] Combat respects new HP/MP maximums
- [ ] Healing/mana potions respect new caps
