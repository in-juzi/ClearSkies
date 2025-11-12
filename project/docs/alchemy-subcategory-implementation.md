# Alchemy Skill & Subcategory Crafting System Implementation

## Overview

This document details the implementation of two major features for the ClearSkies crafting system:

1. **Alchemy Skill**: A new crafting skill for processing herbs and reagents into consumables and crafting materials
2. **Subcategory Ingredient System**: Allow recipes to require items by subcategory (e.g., "any herb") instead of specific itemIds

## Design Goals

### Alchemy Skill
- **Purpose**: Process gathered herbs into useful consumables (potions, tinctures, elixirs)
- **Progression**: Level 1-20+ recipes with increasing complexity
- **Attribute Link**: Will (same as Gathering/Cooking - nature-based skills)
- **Location**: Village Apothecary facility at Kennik (starting location)

### Subcategory System
- **Flexibility**: Players choose which specific items to use for "any herb" requirements
- **Emergent Gameplay**: Quality/trait optimization becomes player decision-making
- **Scope**: Implemented for Alchemy initially, extended to Smithing (logs)
- **Future-Proof**: Architecture supports expansion to all crafting skills

### Recipe Discovery
- **Progression**: Some recipes unlocked by default, others discovered through crafting
- **Conditions**: Unlock via crafting prerequisites or item discovery
- **UI**: Show locked recipes with unlock hints (optional visibility toggle)

## Architecture Changes

### Type System Extensions

#### Recipe Ingredient (be/types/crafting.ts)
```typescript
interface RecipeIngredient {
  itemId?: string;           // Specific item requirement (existing)
  subcategory?: string;      // OR subcategory requirement (new)
  quantity: number;
  // Validation: exactly one of itemId or subcategory must be present
}
```

**Rationale**: Union type allows gradual adoption without breaking existing recipes.

#### Recipe Unlock System (be/types/crafting.ts)
```typescript
interface RecipeUnlockConditions {
  discoveredByDefault?: boolean;      // Default: true for backward compatibility
  requiredRecipes?: string[];         // Must craft these recipes first
  requiredItems?: string[];           // Unlock by possessing items
  questRequired?: string;             // Future: quest completion gate
}

interface Recipe {
  // ... existing fields
  unlockConditions?: RecipeUnlockConditions;
}
```

**Rationale**: Optional field maintains backward compatibility. Recipes without unlock conditions default to immediately available.

#### Player Model Extension (be/models/Player.js)
```typescript
unlockedRecipes: {
  type: [String],
  default: []
}
```

**Rationale**: Track discovered recipes per-player. Empty array = only default recipes visible.

### Service Layer Updates

#### RecipeService.validateRecipeRequirements()
**Current**: Validates ingredients by itemId only
**New**: Branch logic based on ingredient type

```typescript
if (ingredient.itemId) {
  // Existing validation (specific item)
} else if (ingredient.subcategory) {
  // New: Find items matching subcategory
  const matchingItems = player.inventory.filter(item => {
    const itemDef = itemService.getItemDefinition(item.itemId);
    return itemDef.subcategories.includes(ingredient.subcategory);
  });
  // Validate sufficient quantity available
}
```

**Considerations**:
- Instance selection mode: Validate selected instances match subcategory
- Auto-select mode: Find and count items by subcategory
- Error messages: "Requires 2 herbs (any type)" vs "Requires 2 Lavender"

#### RecipeService.checkRecipeUnlocks()
**New method**: Check unlock conditions and return newly unlocked recipes

```typescript
checkRecipeUnlocks(player: Player): string[] {
  const newlyUnlocked: string[] = [];

  for (const recipe of allRecipes) {
    // Skip if already unlocked
    if (player.unlockedRecipes.includes(recipe.recipeId)) continue;

    // Check if should unlock by default
    if (!recipe.unlockConditions || recipe.unlockConditions.discoveredByDefault) {
      newlyUnlocked.push(recipe.recipeId);
      continue;
    }

    // Check required recipes crafted
    if (recipe.unlockConditions.requiredRecipes) {
      const allCrafted = recipe.unlockConditions.requiredRecipes.every(
        reqRecipeId => player.craftedRecipes.includes(reqRecipeId)
      );
      if (allCrafted) newlyUnlocked.push(recipe.recipeId);
    }

    // Check required items possessed
    if (recipe.unlockConditions.requiredItems) {
      const allOwned = recipe.unlockConditions.requiredItems.every(
        itemId => player.hasInventoryItem(itemId, 1)
      );
      if (allOwned) newlyUnlocked.push(recipe.recipeId);
    }
  }

  return newlyUnlocked;
}
```

**When to call**:
- After completing crafting (`completeCrafting` endpoint)
- After adding items to inventory (`addItem` endpoint)
- On player login (check for newly available recipes)

### Controller Updates

#### craftingController.startCrafting()
**Change**: Add unlock validation before allowing craft

```typescript
// After recipe exists check
if (!player.unlockedRecipes.includes(recipeId)) {
  const recipe = recipeService.getRecipe(recipeId);
  if (recipe.unlockConditions && !recipe.unlockConditions.discoveredByDefault) {
    return res.status(403).json({
      message: 'Recipe not yet discovered',
      hint: getUnlockHint(recipe.unlockConditions)
    });
  }
}
```

#### New Endpoint: GET /api/crafting/unlocked
**Purpose**: Fetch player's unlocked recipe list for frontend filtering

```typescript
router.get('/unlocked', authMiddleware, async (req, res) => {
  const player = await Player.findOne({ userId: req.user._id });
  const newlyUnlocked = recipeService.checkRecipeUnlocks(player);

  if (newlyUnlocked.length > 0) {
    player.unlockedRecipes.push(...newlyUnlocked);
    await player.save();
  }

  res.json({ unlockedRecipes: player.unlockedRecipes });
});
```

### Frontend Updates

#### Crafting Component (ui/src/app/components/game/crafting/)

**New State**:
```typescript
unlockedRecipes = signal<Set<string>>(new Set());
showLockedRecipes = signal<boolean>(false);
```

**Ingredient Display Logic**:
```typescript
// For subcategory ingredients, show generic label
getIngredientLabel(ingredient: RecipeIngredient): string {
  if (ingredient.itemId) {
    const item = this.itemService.getItem(ingredient.itemId);
    return `${item.name} (${ingredient.quantity})`;
  } else if (ingredient.subcategory) {
    return `Any ${ingredient.subcategory} (${ingredient.quantity})`;
  }
}
```

**Instance Selection Filter**:
```typescript
// When selecting instances for subcategory ingredient
getAvailableInstancesForIngredient(ingredient: RecipeIngredient): ItemInstance[] {
  if (ingredient.itemId) {
    return this.inventory().filter(i => i.itemId === ingredient.itemId);
  } else if (ingredient.subcategory) {
    return this.inventory().filter(i => {
      const itemDef = this.itemService.getItemDefinition(i.itemId);
      return itemDef.subcategories.includes(ingredient.subcategory);
    });
  }
}
```

**Locked Recipe UI**:
```typescript
// Filter recipes based on unlock status
filteredRecipes = computed(() => {
  let recipes = this.allRecipes();

  if (!this.showLockedRecipes()) {
    recipes = recipes.filter(r => this.unlockedRecipes().has(r.recipeId));
  }

  // ... existing filters (search, craftable, sort)

  return recipes;
});
```

**Recipe Card Styling**:
- Unlocked: Normal styling
- Locked: Grayscale filter, lock icon, unlock hint tooltip
- Newly unlocked: Highlight animation, "NEW" badge

## Implementation Phases

### Phase 1: Skill Rename (Herbalism → Gathering)

**Why first**: Clean foundation before adding new skill

**Files to modify**:
1. [be/types/common.ts:23-35](be/types/common.ts#L23-L35) - Add 'gathering' to SkillName type
2. Create [be/migrations/008-rename-herbalism-to-gathering.js](be/migrations/008-rename-herbalism-to-gathering.js)
3. Update 6 herb items in [be/data/items/definitions/resources/](be/data/items/definitions/resources/)
   - Chamomile.ts, Lavender.ts, Mint.ts, Rosemary.ts, Sage.ts, Thyme.ts
   - Change `skillSource: "herbalism"` → `skillSource: "gathering"`
4. Update gathering activities in [be/data/locations/ActivityRegistry.ts](be/data/locations/ActivityRegistry.ts)
   - Search for `skills: { herbalism: N }` → change to `skills: { gathering: N }`
5. Frontend skill display in [ui/src/app/components/game/skills/skills.ts](ui/src/app/components/game/skills/skills.ts)

**Migration logic**:
```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { 'skills.herbalism': { $exists: true } },
    {
      $rename: { 'skills.herbalism': 'skills.gathering' }
    }
  );
  return { modified: result.modifiedCount, message: 'Renamed herbalism to gathering' };
}

async function down() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { 'skills.gathering': { $exists: true } },
    {
      $rename: { 'skills.gathering': 'skills.herbalism' }
    }
  );
  return { modified: result.modifiedCount, message: 'Reverted gathering to herbalism' };
}
```

### Phase 2: Add Alchemy Skill

**Files to modify**:
1. [be/types/common.ts:23-35](be/types/common.ts#L23-L35) - Add 'alchemy' to SkillName type
2. Create [be/migrations/009-add-alchemy-skill.js](be/migrations/009-add-alchemy-skill.js)
3. [be/data/constants/item-constants.ts](be/data/constants/item-constants.ts) - Add `SKILL.ALCHEMY = 'alchemy'`

**Migration logic**:
```javascript
async function up() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    { 'skills.alchemy': { $exists: false } },
    {
      $set: {
        'skills.alchemy': {
          level: 1,
          experience: 0,
          mainAttribute: 'will'
        }
      }
    }
  );
  return { modified: result.modifiedCount, message: 'Added alchemy skill linked to Will' };
}

async function down() {
  const Player = mongoose.model('Player');
  const result = await Player.updateMany(
    {},
    { $unset: { 'skills.alchemy': '' } }
  );
  return { modified: result.modifiedCount, message: 'Removed alchemy skill' };
}
```

### Phase 3: Subcategory & Unlock Systems

**Type updates**:
1. [be/types/crafting.ts:12-22](be/types/crafting.ts#L12-L22) - Extend RecipeIngredient and Recipe interfaces
2. [be/models/Player.js](be/models/Player.js) - Add unlockedRecipes field

**Service updates**:
3. [be/services/recipeService.ts:29-101](be/services/recipeService.ts#L29-L101) - Update validateRecipeRequirements()
4. [be/services/recipeService.ts](be/services/recipeService.ts) - Add checkRecipeUnlocks() method

**Controller updates**:
5. [be/controllers/craftingController.js:71-159](be/controllers/craftingController.js#L71-L159) - Add unlock check to startCrafting()
6. [be/controllers/craftingController.js:166-299](be/controllers/craftingController.js#L166-L299) - Call checkRecipeUnlocks() after completeCrafting()
7. [be/routes/crafting.js](be/routes/crafting.js) - Add GET /unlocked endpoint

**Frontend updates**:
8. [ui/src/app/components/game/crafting/crafting.component.ts](ui/src/app/components/game/crafting/crafting.component.ts) - Add unlock state and subcategory display
9. [ui/src/app/components/game/crafting/crafting.component.html](ui/src/app/components/game/crafting/crafting.component.html) - Add locked recipe UI

### Phase 4: Alchemy Content

**Item verification**:
1. Check all 6 herb items have `'herb'` in subcategories array
   - [be/data/items/definitions/resources/](be/data/items/definitions/resources/)

**Recipe creation**:
2. Create [be/data/recipes/alchemy/](be/data/recipes/alchemy/) directory
3. Create 4-6 alchemy recipes (see Recipe Design section below)
4. Register recipes in [be/data/recipes/RecipeRegistry.ts](be/data/recipes/RecipeRegistry.ts)

**Facility creation**:
5. Create [be/data/locations/facilities/VillageApothecary.ts](be/data/locations/facilities/VillageApothecary.ts)
6. Update [be/data/locations/definitions/Kennik.ts](be/data/locations/definitions/Kennik.ts) - Add apothecary to facilities

### Phase 5: Smithing Update

**Files to modify**:
1. Wood items in [be/data/items/definitions/resources/](be/data/items/definitions/resources/)
   - OakLog.ts, WillowLog.ts, YewLog.ts
   - Add `'log'` to subcategories array (likely needs to be added if not present)
2. Charcoal recipes in [be/data/recipes/smithing/](be/data/recipes/smithing/)
   - Change `{ itemId: 'oak_log', quantity: 1 }` → `{ subcategory: 'log', quantity: 1 }`

### Phase 6: Testing & Validation

**Automated checks**:
```bash
cd be && npm run validate    # Cross-reference validation
cd be && npm run migrate     # Run migrations
```

**Manual testing checklist**:
- [ ] Gathering skill renamed in UI
- [ ] Alchemy skill appears in skills panel
- [ ] Gathering activities award XP to Gathering skill
- [ ] Alchemy recipes appear at Village Apothecary
- [ ] Subcategory ingredients show "Any herb" label
- [ ] Can select different herbs for same recipe
- [ ] Quality inheritance works with mixed herbs
- [ ] Traits transfer from best ingredient
- [ ] Recipe unlocks trigger after prerequisites
- [ ] Locked recipes show properly (if toggle enabled)
- [ ] Unlock notifications appear
- [ ] Smithing charcoal works with any log type
- [ ] Auto-select best works with subcategory ingredients

## Recipe Design

### Alchemy Recipe Progression

#### Level 1: Basic Tinctures (Unlocked by default)
```typescript
// be/data/recipes/alchemy/BasicHealthTincture.ts
export const BasicHealthTincture: Recipe = {
  recipeId: 'basic_health_tincture',
  name: 'Basic Health Tincture',
  description: 'A simple herbal remedy that restores minor health.',
  skill: 'alchemy',
  requiredLevel: 1,
  duration: 8,
  ingredients: [
    { subcategory: 'herb', quantity: 2 }  // Any 2 herbs
  ],
  outputs: [
    { itemId: 'weak_health_potion', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 20,
  unlockConditions: {
    discoveredByDefault: true
  }
};
```

```typescript
// be/data/recipes/alchemy/BasicManaTincture.ts
export const BasicManaTincture: Recipe = {
  recipeId: 'basic_mana_tincture',
  name: 'Basic Mana Tincture',
  description: 'A simple herbal infusion that restores minor mana.',
  skill: 'alchemy',
  requiredLevel: 1,
  duration: 8,
  ingredients: [
    { subcategory: 'herb', quantity: 2 }  // Any 2 herbs
  ],
  outputs: [
    { itemId: 'weak_mana_potion', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 20,
  unlockConditions: {
    discoveredByDefault: true
  }
};
```

#### Level 5: Enhanced Potions (Unlocked after crafting 5 basic tinctures)
```typescript
// be/data/recipes/alchemy/EnhancedHealthPotion.ts
export const EnhancedHealthPotion: Recipe = {
  recipeId: 'enhanced_health_potion',
  name: 'Enhanced Health Potion',
  description: 'A refined herbal concoction with improved healing properties.',
  skill: 'alchemy',
  requiredLevel: 5,
  duration: 10,
  ingredients: [
    { itemId: 'lavender', quantity: 2 },     // Specific: calming properties
    { subcategory: 'herb', quantity: 1 }     // Any additional herb
  ],
  outputs: [
    { itemId: 'health_potion', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 35,
  unlockConditions: {
    discoveredByDefault: false,
    requiredRecipes: ['basic_health_tincture']  // Craft basic version first
  }
};
```

#### Level 10: Specialized Elixirs (Unlocked by default at level)
```typescript
// be/data/recipes/alchemy/AntidoteElixir.ts
export const AntidoteElixir: Recipe = {
  recipeId: 'antidote_elixir',
  name: 'Antidote Elixir',
  description: 'A potent mixture that neutralizes toxins and poisons.',
  skill: 'alchemy',
  requiredLevel: 10,
  duration: 12,
  ingredients: [
    { itemId: 'sage', quantity: 2 },         // Specific: purifying properties
    { itemId: 'thyme', quantity: 1 }         // Specific: antiseptic properties
  ],
  outputs: [
    { itemId: 'antidote', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 50,
  unlockConditions: {
    discoveredByDefault: true
  }
};
```

#### Level 15: Magical Reagents (Unlocked by possession)
```typescript
// be/data/recipes/alchemy/CrystallineEssence.ts
export const CrystallineEssence: Recipe = {
  recipeId: 'crystalline_essence',
  name: 'Crystalline Essence',
  description: 'Herbs infused with gemstone magic, creating a powerful reagent for advanced alchemy.',
  skill: 'alchemy',
  requiredLevel: 15,
  duration: 15,
  ingredients: [
    { subcategory: 'herb', quantity: 3 },
    { itemId: 'sapphire', quantity: 1 }      // Gemstone for magical infusion
  ],
  outputs: [
    { itemId: 'crystalline_essence', quantity: 1, qualityModifier: 'inherit' }
  ],
  experience: 75,
  unlockConditions: {
    discoveredByDefault: false,
    requiredItems: ['sapphire']  // Discover by finding sapphire
  }
};
```

### Smithing Recipe Update

#### Before (Specific Item):
```typescript
// be/data/recipes/smithing/Charcoal.ts
ingredients: [
  { itemId: 'oak_log', quantity: 1 }
]
```

#### After (Subcategory):
```typescript
// be/data/recipes/smithing/Charcoal.ts
ingredients: [
  { subcategory: 'log', quantity: 1 }  // Any wood log
]
```

**Rationale**: Charcoal production doesn't require specific wood types. This makes smithing more accessible early-game.

## New Items Required

### Consumables (if not already existing)
- `antidote` - Cures poison status (future combat feature)
- `crystalline_essence` - Reagent for advanced alchemy (future recipes)

**Note**: Check existing consumables first. Weak/normal health and mana potions should already exist.

## Facility Definition

```typescript
// be/data/locations/facilities/VillageApothecary.ts
import { Facility } from '../../../types';

export const VillageApothecary: Facility = {
  facilityId: 'village-apothecary',
  name: 'Village Apothecary',
  description: 'A cozy shop filled with drying herbs and bubbling alembics. The village alchemist practices the ancient art of potion-making here.',
  type: 'crafting',
  craftingSkills: ['alchemy'],
  activityIds: []  // No gathering activities, only crafting
};
```

**Add to Kennik**:
```typescript
// be/data/locations/definitions/Kennik.ts
facilityIds: [
  'kennik-market',
  'kennik-dock',
  'kennik-kitchen',
  'kennik-garden',
  'village-forge',
  'village-apothecary'  // NEW
]
```

## Quality Inheritance Behavior

### Scenario: Mixed Herb Quality
**Recipe**: Basic Health Tincture (any 2 herbs)
**Ingredients**:
- Lavender (Quality: purity L3)
- Sage (Quality: purity L1, sheen L2; Trait: fragrant L2)

**Result**:
- Output quality: purity L3 (max level across ingredients)
- Skill bonus: +1 if player alchemy level 10+ (every 10 levels = +1, max +2)
- Final: purity L4 (L3 + L1 bonus, capped at L5)
- Traits: fragrant L2 (from Sage, best ingredient = most traits)

### Scenario: Specific + Subcategory Mix
**Recipe**: Enhanced Health Potion (2 lavender + any herb)
**Ingredients**:
- Lavender #1 (Quality: purity L2)
- Lavender #2 (Quality: purity L4; Trait: pristine L1)
- Chamomile (Quality: purity L5, sheen L3; Trait: fragrant L3)

**Result**:
- Output quality: purity L5, sheen L3 (max across all 3 ingredients)
- Skill bonus: +2 if player alchemy level 20+
- Final: purity L5 (already capped), sheen L5 (L3 + L2 bonus)
- Traits: fragrant L3 (from Chamomile, 1 trait vs Lavender #2's 1 trait - tiebreaker: first found)

**Player Strategy**: Use highest purity lavender + highest overall quality any-herb to maximize output.

## UI/UX Considerations

### Subcategory Ingredient Display

**Recipe card**:
```
Ingredients:
├─ Lavender (2)           ← Specific item (shows item icon)
└─ Any herb (1)           ← Subcategory (shows generic herb icon?)
```

**Instance selection modal**:
```
Select Any herb (1 needed):
├─ Chamomile (Purity L3, Fragrant L2) [3 available]
├─ Sage (Purity L1) [5 available]
├─ Thyme (Purity L2, Sheen L1) [2 available]
└─ Mint (Purity L4) [1 available]
```

**Selected ingredients**:
```
Selected:
├─ Lavender #1 (Purity L4)      ← Specific requirement
├─ Lavender #2 (Purity L2)      ← Specific requirement
└─ Mint #1 (Purity L4)          ← Subcategory requirement (player chose Mint)
```

### Locked Recipe Display

**Option 1: Hidden completely**
- Recipes not unlocked don't appear in list
- Con: Player doesn't know what's possible

**Option 2: Grayed out with hint**
- Recipe card shows but disabled
- Unlock hint: "Craft Basic Health Tincture to unlock"
- Pro: Creates goals and intrigue

**Recommendation**: Option 2 with toggle "Show locked recipes" (default: true)

### Unlock Notification

**Toast message**:
```
🔓 New recipe discovered!
Enhanced Health Potion
[View Recipe] button
```

**Chat message** (if chat system active):
```
[System] You've discovered a new alchemy recipe: Enhanced Health Potion
```

## Edge Cases & Error Handling

### Subcategory Validation
**Problem**: Player selects items, then removes one from inventory before starting craft
**Solution**: Re-validate on `startCrafting()` endpoint, return error if items missing

### Recipe Unlock Race Condition
**Problem**: Player completes craft, recipe unlocks, but frontend doesn't update
**Solution**: `completeCrafting()` response includes `newlyUnlockedRecipes: string[]` field

### Subcategory Auto-Select
**Problem**: Player clicks "Auto-select best" with subcategory ingredient - which items to choose?
**Solution**: Sort all matching items by quality score (sum of quality levels), select highest

### Mixed Quality Calculation
**Problem**: One ingredient has purity L5, another has sheen L5 - which quality to boost with skill bonus?
**Solution**: Apply skill bonus to primary quality (first quality type in output's allowedQualities array)

### Trait Tiebreaker
**Problem**: Two ingredients both have 1 trait - which to inherit?
**Solution**: Use first ingredient in recipe order (consistent behavior)

## Migration Safety

### Skill Rename Migration
**Risk**: Low - simple field rename
**Rollback**: Supported via `down()` function
**Testing**: Check skills panel displays correctly, activities still work

### Add Alchemy Skill Migration
**Risk**: Low - adding new field with default value
**Rollback**: Supported via `down()` function (removes field)
**Testing**: Verify new skill appears, XP awards correctly, links to Will attribute

### Add Unlocked Recipes Field
**Risk**: Medium - affects crafting access control
**Backward Compatibility**: Empty array = no recipes unlocked, but recipes with `discoveredByDefault: true` (or no unlockConditions) should still be accessible
**Testing**: Verify existing recipes still craftable, new unlock system works

## Performance Considerations

### Recipe Unlock Checking
**Concern**: Checking unlock conditions for all recipes on every craft completion
**Mitigation**:
- Check only recipes player doesn't already have unlocked
- Cache recipe definitions in RecipeService (already done)
- Short-circuit on first condition failure

**Estimated cost**: ~10-20ms for 50 recipes (negligible)

### Subcategory Filtering
**Concern**: Filtering inventory by subcategory for every ingredient
**Mitigation**:
- Frontend caches item definitions (already done via itemService)
- Subcategory check is simple array includes operation
- Typical inventory size: 50-100 items

**Estimated cost**: ~1-2ms per ingredient (negligible)

## Future Enhancements

### Phase 7+ (Not in current scope)
1. **Trait-based output modification**: Fragrant herb → +10% potion effectiveness
2. **Alchemy experimentation mode**: Try random combinations to discover recipes
3. **Quality thresholds**: Recipe requires minimum quality level ingredient
4. **Subcategory quantity constraints**: "At least 1 flower, rest any herb"
5. **Batch crafting**: Craft multiple outputs at once (3x ingredients = 3x outputs)
6. **Skill-based unlock**: Reaching Alchemy level 10 unlocks recipe
7. **Subcategory expansion to all crafting**: Cooking "any meat", smithing "any metal ingot"

## Documentation Updates

### CLAUDE.md Updates
- Add Alchemy to completed features list
- Update skill count (12 → 13 skills)
- Add subcategory crafting system to key features
- Add recipe unlock system to key features
- Update Gathering (formerly Herbalism) references
- Add Village Apothecary to facilities list

### New Documentation
- This file: `project/docs/alchemy-subcategory-implementation.md`
- Consider: `project/docs/recipe-unlock-system.md` (if system becomes complex)

## Success Criteria

### Functional Requirements
- ✅ Gathering skill renamed from Herbalism with backward compatibility
- ✅ Alchemy skill functional with XP awarding and Will attribute link
- ✅ Subcategory ingredients work in recipes (validation, selection, consumption)
- ✅ Recipe unlock system functional (conditions, discovery, notifications)
- ✅ Quality inheritance works with subcategory ingredients
- ✅ Trait transfer works with mixed ingredients
- ✅ 4-6 alchemy recipes created with progression curve
- ✅ Village Apothecary facility accessible at Kennik
- ✅ Smithing charcoal recipes use any log

### Quality Requirements
- ✅ No breaking changes to existing recipes
- ✅ Migrations rollback cleanly
- ✅ UI clearly indicates subcategory vs specific ingredients
- ✅ Locked recipes provide helpful unlock hints
- ✅ Performance acceptable (<50ms overhead per craft operation)
- ✅ Validation script passes (no broken references)

### User Experience Requirements
- ✅ Players understand subcategory system without external explanation
- ✅ Recipe unlocks feel rewarding (not frustrating)
- ✅ Quality optimization with subcategories creates meaningful choices
- ✅ Alchemy skill provides value (useful consumables)

## Timeline Estimate

**Phase 1-2** (Skills): 1-2 hours
- Type updates, migrations, item/activity updates

**Phase 3** (Subcategory/Unlock): 3-4 hours
- Complex service logic, controller updates, type extensions

**Phase 4** (Alchemy Content): 2-3 hours
- Recipe creation, facility definition, balancing

**Phase 5** (Smithing Update): 30 minutes
- Simple recipe updates

**Phase 6** (Testing): 1-2 hours
- Validation, migration testing, manual UI testing

**Total**: 8-12 hours

## Conclusion

This implementation adds significant depth to the crafting system while maintaining backward compatibility and setting up future expansion opportunities. The subcategory system enables emergent gameplay through player choice, and the unlock system creates progression beyond simple level requirements.

The modular phased approach allows for incremental testing and rollback if issues arise. Each phase is independently functional, reducing risk of cascading failures.
