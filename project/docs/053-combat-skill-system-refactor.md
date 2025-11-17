# Combat Skill System Refactor

**Date**: 2025-01-16
**Status**: Planned

## Overview

Comprehensive refactor of the combat skill system to remove the gun skill, add a protection/tank skill, implement proper weapon type mechanics (one-handed, dual-wield, two-handed), prepare for multi-combatant encounters, and enforce ability requirements.

## Design Goals

1. **Remove Gun Skill** - Firearms don't fit the medieval fantasy aesthetic
2. **Add Protection Skill** - Tank/defensive playstyle with passive and active XP gains
3. **Weapon Type Mechanics** - Proper differentiation between one-handed, dual-wield, and two-handed combat
4. **Gathering Tool Balance** - Tools should work as weak weapons but not be optimal
5. **Multi-Combatant Architecture** - Prepare for party/raid/summoning systems
6. **Ability Requirement Validation** - Enforce skill level and weapon type requirements

## Combat Skills (After Refactor)

| Skill | Attribute | How It Levels | Playstyle |
|-------|-----------|---------------|-----------|
| **oneHanded** | Strength | Attacking with 1H weapon + shield/empty offHand | Balanced warrior with shield synergy |
| **dualWield** | Dexterity | Attacking with weapons in both hands | Fast DPS, high attack speed |
| **twoHanded** | Strength | Attacking with 2H weapon (greatsword, etc.) | Slow heavy hits, burst damage |
| **protection** | Endurance | Taking damage (1 dmg = 1 XP), using defensive abilities | Tank, damage mitigation, future aggro |
| **ranged** | Dexterity | Attacking with bows/crossbows | Physical ranged DPS, kiting |
| **casting** | Wisdom | Casting spells/summoning | Magic DPS, healing, future summoning |

**Removed:** gun (doesn't fit theme)
**Added:** protection (fills tank role, future-proof for party content)

## Weapon Type Mechanics

### Skill Determination Logic

The combat skill being trained is **context-dependent** based on equipped items:

```typescript
getActiveCombatSkill(player): string {
  const mainHand = player.equipmentSlots.get('mainHand');
  const offHand = player.equipmentSlots.get('offHand');

  // Check if mainHand weapon is two-handed
  if (mainHand && mainHandItem.properties.twoHanded) {
    return 'twoHanded';
  }

  // Check if both hands have weapons
  if (mainHand && offHand && isWeapon(offHand)) {
    return 'dualWield';
  }

  // One-handed (weapon + shield/empty)
  return 'oneHanded';
}
```

### Two-Handed Weapon Restrictions

- Two-handed weapons have `properties.twoHanded: true` flag
- **Equipping a 2H weapon** → auto-unequips offHand slot
- **Equipping mainHand/offHand while 2H equipped** → auto-unequips the 2H weapon
- Examples: Greatsword, Battleaxe, Halberd, Greataxe

### Dual-Wield Mechanics

- Requires weapons in **both** mainHand and offHand slots
- Any one-handed weapon can be dual-wielded
- Future: Could add attack speed bonuses or dual-strike abilities

## Protection Skill Design

### XP Gain Methods

1. **Passive: Taking Damage**
   - 1 damage taken = 1 protection XP
   - Only when in combat
   - Encourages tanking higher-tier content

2. **Active: Defensive Abilities**
   - New abilities grant protection XP on use
   - Example: "Defensive Stance" grants 15 XP

### Protection Abilities

**Defensive Stance** (Initial Implementation)
- **Type:** Buff
- **Effect:** +20 armor for 3 turns
- **Cost:** 8 mana
- **Cooldown:** 4 turns
- **XP Award:** 15 protection XP on use
- **Requirements:** protection level 1, any weapon type

**Future Abilities:**
- Shield Bash (damage + taunt, requires shield equipped)
- Fortify (HoT + armor buff)
- Taunt (forces enemy to attack you, future party content)

### Design Rationale

Protection skill solves two problems:
1. **Gameplay:** Provides tank/defensive playstyle option
2. **Architecture:** Future-proofs for party/raid content where dedicated tanks are needed

Passive XP gain (damage taken) encourages engaging with challenging content and makes failed encounters less punishing.

## Gathering Tools Combat Balance

### Current Problem
- Tools (axes, pickaxes, fishing rods) use `skillScalar: oneHanded` for combat
- Makes them as effective as weapons, which doesn't make sense thematically

### Solution: Damage Reduction

| Item Type | Damage Roll | Notes |
|-----------|-------------|-------|
| Unarmed | 1d1 | Baseline (1 damage) |
| Bronze/Iron Tools | 1d2 | Weak weapons (avg 1.5 damage) |
| Fishing Rods | 1d2 | Same as tools |
| Bronze Sword | 1d4 | Real weapons start here (avg 2.5 damage) |
| Iron Sword | 1d6 | Tier 2 weapons (avg 3.5 damage) |
| Greatsword | 1d10 | Two-handed power (avg 5.5 damage) |

**Design Goal:** Tools should work in emergencies (dangerous gathering zones with ambushes) but not be optimal for combat.

## Multi-Combatant Architecture

### Combat State Restructure

**Before (1v1):**
```typescript
interface ActiveCombat {
  monster: MonsterInstance;
  playerHealth: number;
  monsterHealth: number;
  // ...
}
```

**After (Team-based):**
```typescript
interface ActiveCombat {
  playerTeam: CombatEntity[];   // Array of combatants
  enemyTeam: CombatEntity[];    // Array of enemies
  // Each combatant individually schedules their next attack
  // based on their attack speed (existing paradigm)
  playerTurnCount: number;      // Tracks player's attack count for UI display
  // ...
}
```

### CombatEntity Abstraction

Extend `be/services/combat/CombatEntity.ts` to support:
- **PlayerEntity** - Wraps Player model stats
- **MonsterEntity** - Wraps Monster definition
- **PetEntity** - Future: summoned familiars
- **NPC Entity** - Future: party members/allies

### Backward Compatibility

- Initial implementation: Arrays of length 1 (single player vs single monster)
- UI displays first combatant from each team
- Future expansion: Show multiple team members, targeting system

### Targeting System (Future)

- Abilities/attacks specify target entity index
- Default: First alive enemy
- Advanced: Click-to-target UI, smart targeting (healers, tanks, etc.)

## Ability Requirement Validation

### Current Problem
- `minSkillLevel` and `weaponTypes` are defined in abilities but **never validated**
- Players can use any ability regardless of requirements

### Solution: Backend Validation

In `combatService.useAbility()`:

```typescript
// 1. Get active combat skill
const activeCombatSkill = player.getActiveCombatSkill();

// 2. Validate skill level
const skillLevel = player.skills[activeCombatSkill]?.level || 1;
if (skillLevel < ability.requirements.minSkillLevel) {
  throw new Error(`Requires ${ability.requirements.minSkillLevel} ${activeCombatSkill}`);
}

// 3. Validate weapon type
if (!ability.requirements.weaponTypes.includes(activeCombatSkill)) {
  throw new Error(`Cannot use this ability with ${activeCombatSkill}`);
}
```

### Frontend Updates

- Filter abilities by skill level in `getAbilitiesForWeapon()`
- Gray out unusable abilities with tooltip explaining why
- Show required skill level in ability details

## Implementation Phases

### Phase 1: Core Skill System Updates
- Remove gun skill from constants and Player model
- Add protection skill to constants and Player model
- Update ability definitions (Aimed Shot, Rapid Fire → ranged only)
- Database migrations for skill changes

### Phase 2: Equipment Slot Validation
- Implement two-handed weapon auto-unequip logic
- Add weapon slot restrictions (weapons → mainHand/offHand, armor → correct slots)
- Update frontend equipment component visual feedback

### Phase 3: Combat Skill Determination
- Create `Player.getActiveCombatSkill()` method
- Update `combatService.calculateDamage()` to use active skill
- Award XP to the skill being used (not weapon's skillScalar)

### Phase 4: Gathering Tools Combat Nerf
- Reduce tool damage rolls to 1d2
- Keep weapon damage higher (swords 1d4+)
- Unarmed combat baseline: 1d1

### Phase 5: Protection Skill XP System
- Award protection XP in `takeDamage()` (1 dmg = 1 XP)
- Create "Defensive Stance" ability with XP-on-use
- Add `xpOnUse` field to Ability type for future expansion

### Phase 6: Multi-Combatant Architecture
- Extend ActiveCombat type to support team arrays
- Expand CombatEntity base class
- Implement turn order queue
- Maintain backward compatibility (1v1 in arrays of length 1)

### Phase 7: Ability Requirement Validation
- Backend: Validate minSkillLevel and weaponTypes in useAbility()
- Frontend: Filter abilities by skill level, show tooltips for disabled abilities

### Phase 8: Data Updates
- Create two-handed weapons (Greatsword, Battleaxe)
- Create protection abilities (Defensive Stance, Shield Bash, Fortify)
- Update existing ability requirements for balance

### Phase 9: Database Migrations
- Migration: Remove gun skill from all players
- Migration: Add protection skill to all players (level 1, 0 XP)
- Migration: Update activeCombat to team structure (if any active)

### Phase 10: Testing & Balance
- Test two-handed weapon equip/unequip flow
- Test skill XP awards for all combat skills
- Test protection XP from damage taken
- Test ability requirement validation
- Balance review: protection XP rate, tool vs weapon damage

## Database Migrations

### Migration: Remove Gun Skill
```javascript
// 018-remove-gun-skill.js
module.exports = {
  async up(db) {
    await db.collection('players').updateMany(
      {},
      { $unset: { 'skills.gun': '' } }
    );
  },
  async down(db) {
    await db.collection('players').updateMany(
      {},
      { $set: { 'skills.gun': { level: 1, experience: 0 } } }
    );
  }
};
```

### Migration: Add Protection Skill
```javascript
// 019-add-protection-skill.js
module.exports = {
  async up(db) {
    await db.collection('players').updateMany(
      {},
      { $set: { 'skills.protection': { level: 1, experience: 0, totalXP: 0 } } }
    );
  },
  async down(db) {
    await db.collection('players').updateMany(
      {},
      { $unset: { 'skills.protection': '' } }
    );
  }
};
```

## Files to Modify

### Shared Types & Constants
- `shared/constants/item-constants.ts` - Remove GUN, add PROTECTION
- `shared/types/items.ts` - Add `twoHanded?: boolean` to WeaponItem properties
- `shared/types/combat.ts` - Update ActiveCombat for multi-combatant

### Backend
- `be/models/Player.ts` - Add protection skill, getActiveCombatSkill() method
- `be/services/combatService.ts` - Skill determination, protection XP, validation
- `be/services/itemService.ts` - Two-handed weapon validation
- `be/controllers/inventoryController.ts` - Equipment slot validation
- `be/data/abilities/definitions/` - New protection abilities
- `be/data/items/definitions/equipment/` - New two-handed weapons
- `be/migrations/` - Gun removal, protection addition

### Frontend
- `ui/src/app/services/combat.service.ts` - Ability filtering by skill level
- `ui/src/app/components/game/equipment/equipment.component.ts` - Visual feedback
- `ui/src/app/components/game/combat/combat.component.ts` - Ability tooltips
- `ui/src/app/components/game/skills/skills.component.ts` - Display protection skill

## Benefits

1. **Cleaner Theme** - Removes firearms from medieval fantasy setting
2. **Tank Role** - Protection skill enables defensive playstyles, future party content
3. **Build Diversity** - Encounter-specific weapon choices (shield vs dual-wield vs two-handed)
4. **Mechanical Depth** - Context-dependent skill training creates strategic equipment decisions
5. **Future-Proof** - Multi-combatant architecture supports raids, parties, summoning
6. **Tool Balance** - Gathering tools work in emergencies but don't replace combat gear
7. **Validation** - Ability requirements prevent exploits and enforce progression

## Future Expansion

### Short-Term
- More protection abilities (Shield Bash, Fortify, Taunt)
- Two-handed weapon variety (Greatsword, Battleaxe, Greataxe, Halberd)
- Dual-wield attack speed bonuses or dual-strike abilities

### Medium-Term
- Party system with tank/DPS/healer roles
- Aggro/threat mechanics (protection generates threat)
- Weapon type advantages (two-handed vs armored enemies, dual-wield vs fast enemies)

### Long-Term
- Raid bosses requiring specific team compositions
- Summoning system via casting skill (familiars, pets)
- Pet companions that fight alongside player
- Multi-target abilities and AoE effects

## Related Documentation

- [017-combat-system.md](017-combat-system.md) - Original combat system design
- [032-xp-system.md](032-xp-system.md) - Skill-to-attribute XP linking
- [041-attribute-progression-system.md](041-attribute-progression-system.md) - Attribute scaling formulas
- [001-equipment-system.md](001-equipment-system.md) - Equipment slot mechanics

## Implementation Files

### Core Game Logic
- [Player.ts](../../be/models/Player.ts) - Player model with skills and equipment
- [combatService.ts](../../be/services/combatService.ts) - Combat calculations and XP awards
- [itemService.ts](../../be/services/itemService.ts) - Item validation and equip logic

### Data Registries
- [AbilityRegistry.ts](../../be/data/abilities/AbilityRegistry.ts) - All combat abilities
- [ItemRegistry.ts](../../be/data/items/ItemRegistry.ts) - All items including weapons

### Frontend Components
- [combat.component.ts](../../ui/src/app/components/game/combat/combat.component.ts) - Combat UI
- [equipment.component.ts](../../ui/src/app/components/game/equipment/equipment.component.ts) - Equipment management
- [skills.component.ts](../../ui/src/app/components/game/skills/skills.component.ts) - Skill display
