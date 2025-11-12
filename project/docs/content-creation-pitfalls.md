# Content Creation Pitfalls & Solutions

This document captures common pitfalls encountered when creating new game content and how to avoid them.

## TypeScript Type System Issues

### Combat Activity Structure
**Pitfall**: Using the base `Activity` interface instead of `ActivityUnion` for combat activities.

**Symptoms**:
```
error TS2769: No overload matches this call.
Type 'Activity' is not assignable to type 'ActivityUnion'.
```

**Solution**: Combat activities must:
1. Import `ActivityUnion` instead of `Activity`
2. Include `type: "combat"` property
3. Use `combatConfig` object with `monsterId` instead of `rewards.combat`
4. Omit `duration` field (combat activities are not timed)
5. Keep `requirements` but remove `equipped` property (not needed for combat)

**Correct Structure**:
```typescript
import { ActivityUnion } from '../../../types/locations';

export const ActivityCombatExample: ActivityUnion = {
  "activityId": "combat-example",
  "type": "combat",
  "name": "Fight Example",
  "description": "Engage in combat...",
  "requirements": {
    "skills": {
      "oneHanded": 5
    }
  },
  "combatConfig": {
    "monsterId": "example_monster"
  }
} as const;
```

### Facility Icon Property
**Pitfall**: Forgetting the required `icon` property on facilities.

**Symptoms**:
```
error TS2741: Property 'icon' is missing in type '{ ... }' but required in type 'Facility'.
```

**Solution**: All facilities must include an `icon` property matching their type:
```typescript
export const ExampleFacility: Facility = {
  "facilityId": "example-facility",
  "name": "Example Facility",
  "description": "...",
  "type": "combat",
  "icon": "combat",  // Must match type
  "activities": [...]
} as const;
```

### Navigation Link Requirements
**Pitfall**: Navigation link `requirements.skills` expects full `Record<SkillName, number>` type (all skills).

**Symptoms**:
```
error TS2740: Type '{ readonly oneHanded: 4; }' is missing the following properties from type 'Record<SkillName, number>': fishing, mining, woodcutting, ...
```

**Root Cause**: TypeScript type definition inconsistency:
- `ActivityRequirements.skills` uses `Record<string, number>` (flexible)
- `NavigationRequirements.skills` uses `Record<SkillName, number>` (requires ALL skills)

**Solution**: Either:
1. Use `requirements: {}` (no requirements)
2. Use `attributes` instead of `skills` for navigation requirements
3. Wait for type definition fix to use `Partial<Record<SkillName, number>>`

**Example**:
```typescript
"navigationLinks": [
  {
    "targetLocationId": "goblin-village",
    "name": "Hidden Path",
    "description": "...",
    "travelTime": 10,
    "requirements": {},  // Empty is valid
    "encounters": []
  }
]
```

## Data Validation Issues

### Invalid Item References
**Pitfall**: Referencing items that don't exist in the item registry.

**Symptoms**: Validation script errors like:
```
❌ [drop-table] drop-tables/combat-goblin-scout
  → Invalid itemId: animal_hide
```

**Solution**: Always verify item IDs exist before using them:

1. **Search for items**:
   ```bash
   # Find items by pattern
   cd be
   npx ts-node -e "console.log(require('./data/items/ItemRegistry').ItemRegistry.getAllIds())"
   ```

2. **Common item name variations**:
   - `animal_hide` → `leather_scraps` or `wolf_pelt`
   - `health_potion_small` → `health_potion_minor`
   - `mana_potion_small` → `mana_potion_minor`
   - `thyme` → Use existing herbs: `nettle`, `chamomile`, `sage`, etc.

3. **Check herb items**: Located in `be/data/items/definitions/resources/`
   - Available herbs: sage, nettle, chamomile, mandrake_root, dragons_breath, moonpetal, etc.

### Drop Table Item Validation
**Pitfall**: Creating drop tables with non-existent items.

**Solution**: Run validation script after creating drop tables:
```bash
cd be
npm run validate
```

The script will report:
- ✅ All valid item references
- ❌ Invalid itemIds with suggestions
- ⚠️ Warnings about missing weapon subtypes (can be ignored if intentional)

## Monster Definition Issues

### Loot Table References
**Pitfall**: Monster `lootTables` array references drop tables that haven't been created yet.

**Solution**: Create drop tables BEFORE referencing them in monster definitions.

**Creation Order**:
1. Create drop table TypeScript files
2. Register in `DropTableRegistry.ts`
3. Create monster with loot table references
4. Register in `MonsterRegistry.ts`

## Build Process

### Registry Registration Order
**Pitfall**: Forgetting to register new content in registries causes runtime errors.

**Solution**: After creating new content, update registries in this order:

1. **Drop Tables** → `be/data/locations/DropTableRegistry.ts`
   ```typescript
   import { CombatGoblinScout } from './drop-tables/CombatGoblinScout';
   // Add to Map:
   [CombatGoblinScout.dropTableId, CombatGoblinScout],
   ```

2. **Monsters** → `be/data/monsters/MonsterRegistry.ts`
   ```typescript
   import { GoblinScout } from './definitions/GoblinScout';
   [GoblinScout.monsterId, GoblinScout],
   ```

3. **Activities** → `be/data/locations/ActivityRegistry.ts`
   ```typescript
   import { ActivityCombatGoblinScout } from './activities/ActivityCombatGoblinScout';
   [ActivityCombatGoblinScout.activityId, ActivityCombatGoblinScout],
   ```

4. **Facilities** → `be/data/locations/FacilityRegistry.ts`
   ```typescript
   import { GoblinVillage } from './facilities/GoblinVillage';
   [GoblinVillage.facilityId, GoblinVillage],
   ```

5. **Locations** → `be/data/locations/LocationRegistry.ts`
   ```typescript
   import { GoblinVillage } from './definitions/GoblinVillage';
   [GoblinVillage.locationId, GoblinVillage],
   ```

### TypeScript Compilation
**Pitfall**: Forgetting to run `npm run build` after making changes.

**Solution**: Always compile TypeScript after content changes:
```bash
cd be
npm run build
```

This command:
1. Validates all game data references
2. Compiles TypeScript to JavaScript
3. Copies data files to `dist/` directory

**Build Output**: Should see:
```
✅ Validation passed with warnings. Review warnings above.
```

Errors = must fix, Warnings = review but okay to proceed.

## Common Mistakes Checklist

When creating new combat content, verify:

- [ ] Combat activities use `ActivityUnion` type
- [ ] Combat activities include `type: "combat"`
- [ ] Combat activities use `combatConfig` not `rewards.combat`
- [ ] Facilities include `icon` property
- [ ] All referenced items exist in ItemRegistry
- [ ] Potion names use `_minor` not `_small` suffix
- [ ] Drop tables registered before monsters reference them
- [ ] All content registered in appropriate registries
- [ ] Navigation links use empty `requirements: {}` if no skill requirements
- [ ] TypeScript build passes: `npm run build`
- [ ] Validation script passes: `npm run validate`

## Debugging Tips

### TypeScript Errors
1. Read the full error message - it shows exactly which property is missing
2. Compare with working examples in the same directory
3. Check if using correct type import (`Activity` vs `ActivityUnion`)

### Validation Errors
1. Run `npm run validate` to see all issues at once
2. Item not found? Search `be/data/items/definitions/` for similar names
3. Check ItemRegistry.ts for complete list of available items

### Runtime Errors
1. Content not appearing? Check registry registration
2. Monster not spawning? Verify monster exists in MonsterRegistry
3. Loot not dropping? Verify drop table exists and is registered

## Real Example: Goblin Village Creation

The Goblin Village location creation encountered these issues in order:

1. ❌ Used `Activity` instead of `ActivityUnion` for combat activities
2. ❌ Missing `type: "combat"` property
3. ❌ Used `rewards.combat` instead of `combatConfig`
4. ❌ Missing `icon` property on GoblinVillage facility
5. ❌ Used `Record<SkillName, number>` for navigation requirements
6. ❌ Referenced non-existent items: `animal_hide`, `thyme`, `rosemary`, `health_potion_small`
7. ✅ Fixed all issues, build succeeded

**Time to fix**: ~5 minutes after identifying patterns

**Key Lesson**: Use validation script early and often!

## Future Improvements

**Type System**:
- Change `NavigationRequirements.skills` to `Partial<Record<SkillName, number>>`
- Add better JSDoc comments for combat activity structure
- Create type guard utilities for activity types

**Validation**:
- Add suggestions for similar item names when validation fails
- Warn about common naming mistakes (small → minor)
- Pre-validate drop tables before monster creation

**Documentation**:
- Add example templates for each content type
- Create interactive content generator CLI tool
- Document all available item IDs in one place
