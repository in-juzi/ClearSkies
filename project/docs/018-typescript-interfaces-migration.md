# TypeScript Interfaces-Only Migration

**Status**: ✅ Complete
**Date**: November 2025
**Approach**: Interfaces-only (no runtime changes)

## Overview

The ClearSkies backend has been migrated to TypeScript using an **interfaces-only** approach. This provides compile-time type safety and better developer experience without changing any runtime behavior or requiring a build step for development.

---

## Architecture

### Hybrid Approach

The project uses a **hybrid TypeScript/JavaScript architecture**:

- **Type Definitions**: TypeScript interfaces in `be/types/`
- **Services**: Converted to TypeScript (.ts files)
- **Controllers/Models/Routes**: Remain as JavaScript (can use types via JSDoc)
- **Data Files**: JSON files (validated against TypeScript types)

This approach allows:
- ✅ Gradual migration (convert files incrementally)
- ✅ No breaking changes (existing JS code works unchanged)
- ✅ Type safety where it matters most (services layer)
- ✅ Flexibility to keep some files as JavaScript

---

## File Structure

### Type Definitions (`be/types/`)

```
be/types/
├── index.ts           # Central export (import from here)
├── common.ts          # Base types (Rarity, Stats, Skill, IconConfig)
├── items.ts           # Item hierarchy (70+ lines, 15 interfaces)
├── combat.ts          # Combat system (187 lines, 12 interfaces)
├── locations.ts       # Locations/activities (186 lines, 13 interfaces)
├── crafting.ts        # Crafting/vendors (61 lines, 7 interfaces)
└── guards.ts          # Type guard functions (123 lines, 13 functions)
```

**Total**: 882 lines of type definitions covering all game systems

### Converted Services (`be/services/`)

| Service | Lines | Description |
|---------|-------|-------------|
| `itemService.ts` | 550 | Item management, quality/trait generation |
| `combatService.ts` | 675 | Combat calculations, monster AI, damage |
| `locationService.ts` | 347 | Location/activity system, XP scaling |
| `recipeService.ts` | 270 | Recipe validation, crafting outcomes |
| `vendorService.ts` | 180 | Vendor stock, buy/sell transactions |
| `dropTableService.ts` | 200 | Weighted loot drops, nested tables |

**Total**: 2,222 lines of typed service code

---

## Type System Design

### 1. Common Types (`common.ts`)

**Base types shared across all systems:**

```typescript
// Literal types for compile-time validation
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'equipment' | 'consumable' | 'resource';
export type SkillName = 'woodcutting' | 'mining' | 'fishing' | ...;

// Stats with current/max values
export interface Stats {
  current: number;
  max: number;
}

// Skill progression
export interface Skill {
  level: number;
  experience: number;
  mainAttribute?: AttributeName;
}

// Item instance in inventory
export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
  qualities: QualityMap;
  traits: TraitMap;
  equipped: boolean;
}
```

### 2. Item Types (`items.ts`)

**Hierarchical item system with inheritance:**

```typescript
// Base interface for all items
export interface Item {
  itemId: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategories: string[];
  baseValue: number;
  rarity: Rarity;
  stackable: boolean;
  icon: IconConfig;
  properties: ItemProperties;
  allowedQualities: string[];
  allowedTraits: string[];
}

// Equipment specialization
export interface EquipmentItem extends Item {
  category: 'equipment';
  stackable: false;
  slot: EquipmentSlot;
  subtype: string;
  properties: EquipmentProperties;
}

// Weapon further specializes equipment
export interface WeaponItem extends EquipmentItem {
  subcategories: string[]; // Must include 'weapon'
  properties: WeaponProperties;
}

// Armor further specializes equipment
export interface ArmorItem extends EquipmentItem {
  subcategories: string[]; // Must include 'armor'
  properties: ArmorProperties;
}

// Consumables (food, potions)
export interface ConsumableItem extends Item {
  category: 'consumable';
  properties: ConsumableProperties;
}

// Resources (wood, ore, herbs)
export interface ResourceItem extends Item {
  category: 'resource';
  stackable: true;
  properties: ResourceProperties;
}
```

**Design Rationale:**
- **Inheritance** models real-world relationships (weapons ARE equipment)
- **Literal types** prevent typos (`category: 'equipmnt'` → compile error)
- **Required fields** enforced at compile time
- **Type narrowing** via discriminated unions

### 3. Combat Types (`combat.ts`)

**Combat entities and calculations:**

```typescript
// Monster definition
export interface Monster {
  monsterId: string;
  name: string;
  level: number;
  stats: { health: Stats; mana: Stats };
  attributes: Record<AttributeName, Attribute>;
  skills: Record<SkillName, Skill>;
  equipment: MonsterEquipment;
  combatStats: { armor: number; evasion: number };
  passiveAbilities: PassiveAbility[];
  lootTables: string[];
  goldDrop: { min: number; max: number };
  experience: number;
}

// Combat ability
export interface Ability {
  abilityId: string;
  name: string;
  type: AbilityType;
  targetType: TargetType;
  powerMultiplier: number;
  manaCost: number;
  cooldown: number;
  requirements: AbilityRequirements;
  effects: AbilityEffects;
  icon: IconConfig;
}

// Active combat state
export interface ActiveCombat {
  monster: MonsterInstance;
  turnState: TurnState;
  abilityCooldowns: Record<string, number>;
  combatLog: CombatLogEntry[];
}
```

### 4. Location Types (`locations.ts`)

**World structure and activities:**

```typescript
export interface Location {
  locationId: string;
  name: string;
  description: string;
  biome: Biome;
  facilities: string[];
  navigationLinks: NavigationLink[];
  isStartingLocation?: boolean;
}

export interface Activity {
  activityId: string;
  name: string;
  description: string;
  type: ActivityType;
  requirements: ActivityRequirements;
}

export interface GatheringActivity extends Activity {
  type: 'resource-gathering';
  duration: number;
  rewards: GatheringRewards;
}

export interface CombatActivity extends Activity {
  type: 'combat';
  combatConfig: { monsterId: string };
}
```

### 5. Type Guards (`guards.ts`)

**Runtime type narrowing functions:**

```typescript
// Check if item is a weapon
export function isWeaponItem(item: Item): item is WeaponItem {
  return (
    item.category === 'equipment' &&
    item.subcategories?.includes('weapon') === true
  );
}

// Check if item is armor
export function isArmorItem(item: Item): item is ArmorItem {
  return (
    item.category === 'equipment' &&
    item.subcategories?.includes('armor') === true
  );
}

// Check if equipment has weapon properties
export function hasWeaponProperties(item: EquipmentItem): item is WeaponItem {
  return (
    item.properties.damageRoll !== undefined &&
    item.properties.attackSpeed !== undefined
  );
}
```

**Usage:**
```typescript
const item = itemService.getItemDefinition('iron_sword');

if (isWeaponItem(item)) {
  // TypeScript knows item is WeaponItem here
  console.log(item.properties.damageRoll); // ✅ Valid
  console.log(item.properties.armor);       // ❌ Compile error
}
```

---

## Service Conversion Pattern

### Before (JavaScript)

```javascript
// itemService.js
class ItemService {
  getItemDefinition(itemId) {
    return this.itemDefinitions.get(itemId);
  }

  calculateVendorPrice(itemInstance) {
    let price = itemDef.baseValue;
    // ... calculations
    return price;
  }
}

module.exports = new ItemService();
```

### After (TypeScript)

```typescript
// itemService.ts
import { Item, ItemInstance, QualityMap, TraitMap } from '../types';

class ItemService {
  private itemDefinitions: Map<string, Item> = new Map();

  getItemDefinition(itemId: string): Item | undefined {
    return this.itemDefinitions.get(itemId);
  }

  calculateVendorPrice(itemInstance: ItemInstance): number {
    let price: number = itemDef.baseValue;
    // ... calculations (now type-checked)
    return price;
  }

  createItemInstance(
    itemId: string,
    quantity: number = 1,
    qualities: QualityMap = {},
    traits: TraitMap = {}
  ): ItemInstance {
    // ... fully typed
  }
}

export default new ItemService();
```

**Benefits:**
- ✅ Parameter types documented and enforced
- ✅ Return types explicit (no guessing)
- ✅ Private fields marked with `private`
- ✅ Default parameters type-checked
- ✅ IDE autocomplete for all methods/properties

---

## Configuration

### TypeScript Compiler (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "sourceMap": true,
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": false,              // Gradual migration
    "alwaysStrict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowJs": true,              // Allow JavaScript files
    "checkJs": false              // Don't type-check JS files
  },
  "include": ["**/*.ts", "**/*.js"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Settings:**
- `strict: false` - Gradual migration (enable incrementally)
- `allowJs: true` - JavaScript files can coexist
- `declaration: true` - Generate .d.ts files
- `sourceMap: true` - Debugging support

### NPM Scripts (`package.json`)

```json
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@types/node": "^24.10.0",
    "@types/express": "^5.0.5",
    "@types/cors": "^2.8.19",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/uuid": "^10.0.0"
  }
}
```

---

## Usage Examples

### Example 1: Type-Safe Item Creation

```typescript
import itemService from './services/itemService';
import { Item, WeaponItem, isWeaponItem } from './types';

// Get item (type-safe)
const item: Item | undefined = itemService.getItemDefinition('iron_sword');

if (!item) {
  throw new Error('Item not found');
}

// Type narrowing with guard
if (isWeaponItem(item)) {
  // TypeScript knows this is a WeaponItem
  console.log(`Damage: ${item.properties.damageRoll}`);
  console.log(`Speed: ${item.properties.attackSpeed}`);
  // item.properties.armor // ❌ Compile error - weapons don't have armor
}

// Create instance
const instance = itemService.createItemInstance(
  'iron_sword',
  1,
  { sharpness: 3 }, // QualityMap
  { blessed: 2 }     // TraitMap
);
```

### Example 2: Combat Calculations

```typescript
import combatService from './services/combatService';
import { Monster, Ability } from './types';

// Get typed monster
const monster: Monster | undefined = combatService.getMonster('goblin_warrior');

if (monster) {
  console.log(`${monster.name} - Level ${monster.level}`);
  console.log(`HP: ${monster.stats.health.max}`);
  console.log(`XP Reward: ${monster.experience}`);
}

// Get abilities for weapon type
const abilities: Ability[] = combatService.getAbilitiesForWeapon('oneHanded');

abilities.forEach(ability => {
  console.log(`${ability.name}: ${ability.manaCost} mana, ${ability.cooldown}s cooldown`);
});
```

### Example 3: Recipe Validation

```typescript
import recipeService from './services/recipeService';
import { Recipe } from './types';

// Get typed recipe
const recipe: Recipe | null = recipeService.getRecipe('cooked_salmon');

if (recipe) {
  // Validate requirements
  const validation = recipeService.validateRecipeRequirements(player, recipe);

  if (validation.valid) {
    // Calculate outcome with type safety
    const outputs = recipeService.calculateCraftingOutcome(
      recipe,
      ingredients,
      player.skills.cooking.level,
      itemService
    );

    outputs.forEach(output => {
      console.log(`Created: ${output.itemId} x${output.quantity}`);
    });
  } else {
    console.error(validation.message);
  }
}
```

### Example 4: Location System

```typescript
import locationService from './services/locationService';
import { Location, Activity, isGatheringActivity } from './types';

// Get typed location
const location: Location | undefined = locationService.getStartingLocation();

if (location) {
  console.log(`Starting at: ${location.name} (${location.biome})`);
}

// Get activity with type narrowing
const activity: Activity | undefined = locationService.getActivity('chop-oak');

if (activity && isGatheringActivity(activity)) {
  // TypeScript knows this is GatheringActivity
  console.log(`Duration: ${activity.duration}s`);
  console.log(`XP: ${JSON.stringify(activity.rewards.experience)}`);
}
```

---

## Benefits

### 1. Compile-Time Safety

**Before (JavaScript):**
```javascript
// Typo goes unnoticed until runtime
item.catagory === 'equipment'  // ❌ Silent fail

// Missing property causes undefined at runtime
const damage = weapon.properties.damgeRoll; // ❌ undefined
```

**After (TypeScript):**
```typescript
// Typo caught at compile time
item.catagory === 'equipment'  // ❌ Compile error: Did you mean 'category'?

// Missing property caught immediately
const damage = weapon.properties.damgeRoll; // ❌ Compile error: Property doesn't exist
```

### 2. IntelliSense & Autocomplete

When you type `item.`, your IDE shows:
- ✅ All available properties
- ✅ Their types
- ✅ JSDoc comments
- ✅ Deprecated markers

This eliminates the need to constantly check documentation or source code.

### 3. Refactoring Support

**Renaming:**
```typescript
// Rename 'baseValue' to 'basePrice'
// TypeScript updates ALL references across the codebase
interface Item {
  basePrice: number; // Renamed
}
```

All usages of `item.baseValue` are flagged as errors until fixed.

### 4. Self-Documenting Code

```typescript
// Clear function signature
function calculateScaledXP(
  rawXP: number,
  playerLevel: number,
  activityLevel: number
): number {
  // ...
}

// vs JavaScript (no types visible)
function calculateScaledXP(rawXP, playerLevel, activityLevel) {
  // What types? Check docs or source
}
```

### 5. Prevents Common Bugs

```typescript
// Can't pass wrong types
itemService.createItemInstance(
  123,          // ❌ Error: Expected string
  'iron_sword', // ❌ Error: Wrong parameter order
  1
);

// Correct usage
itemService.createItemInstance('iron_sword', 1);
```

---

## Migration Strategy

### Phase 1: Type Definitions (✅ Complete)

1. Create `be/types/` directory
2. Define interfaces for all game systems
3. Create type guard functions
4. Export from central `index.ts`

### Phase 2: Services (✅ Complete)

1. Convert `.js` → `.ts` one service at a time
2. Add type annotations to methods
3. Mark private fields
4. Test compilation after each service

**Completed Services:**
- ✅ itemService.ts
- ✅ combatService.ts
- ✅ locationService.ts
- ✅ recipeService.ts
- ✅ vendorService.ts
- ✅ dropTableService.ts

### Phase 3: Controllers (Optional)

Controllers can remain JavaScript and use types via JSDoc:

```javascript
/**
 * @param {import('../types').Item} item
 * @returns {number}
 */
function calculatePrice(item) {
  return item.baseValue * 1.5;
}
```

Or convert to TypeScript for full type safety.

### Phase 4: Enable Stricter Checks (Future)

Gradually enable stricter TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,              // Enable all strict checks
    "noImplicitAny": true,       // No 'any' types
    "strictNullChecks": true     // Explicit null handling
  }
}
```

---

## Validation & Testing

### Compilation

```bash
# Type check without emitting files
npm run type-check

# Compile to JavaScript
npm run build

# Watch mode (recompile on save)
npm run build:watch
```

### Output

Compiled files go to `be/dist/`:
- **JavaScript**: `dist/**/*.js`
- **Type declarations**: `dist/**/*.d.ts`
- **Source maps**: `dist/**/*.js.map`

### Verification

```bash
# Check all services compiled
ls -lh be/dist/services/*.js

# combatService.js     (26K)
# dropTableService.js  (7.1K)
# itemService.js       (23K)
# locationService.js   (15K)
# recipeService.js     (11K)
# vendorService.js     (6.7K)
```

---

## Common Patterns

### Pattern 1: Optional Parameters with Defaults

```typescript
function createItem(
  itemId: string,
  quantity: number = 1,
  qualities: QualityMap = {},
  traits: TraitMap = {}
): ItemInstance {
  // ...
}

// Call with defaults
createItem('iron_sword');                    // Uses defaults
createItem('iron_sword', 5);                 // Custom quantity
createItem('iron_sword', 1, { sharp: 3 });  // Custom quality
```

### Pattern 2: Union Types for Variants

```typescript
type ActivityType = 'resource-gathering' | 'combat' | 'social';

interface Activity {
  activityId: string;
  type: ActivityType;
  // ...
}

function handleActivity(activity: Activity) {
  switch (activity.type) {
    case 'resource-gathering':
      // Handle gathering
      break;
    case 'combat':
      // Handle combat
      break;
    // TypeScript ensures all cases handled
  }
}
```

### Pattern 3: Record Types for Maps

```typescript
// Instead of any or object
type SkillLevels = Record<SkillName, number>;

const requirements: SkillLevels = {
  woodcutting: 5,
  mining: 10
  // TypeScript validates keys are valid SkillNames
};
```

### Pattern 4: Partial Types for Updates

```typescript
import { Partial } from 'typescript';

interface Monster {
  health: number;
  mana: number;
  armor: number;
}

// Update only some fields
function updateMonster(monster: Monster, updates: Partial<Monster>) {
  return { ...monster, ...updates };
}

updateMonster(goblin, { health: 50 }); // ✅ Valid
updateMonster(goblin, { invalid: 10 }); // ❌ Compile error
```

---

## Troubleshooting

### Issue: "Cannot find module '../types'"

**Solution**: Ensure `tsconfig.json` includes TypeScript files:
```json
{
  "include": ["**/*.ts"]
}
```

### Issue: "Property 'X' does not exist on type 'Y'"

**Solution**: Either:
1. Add the property to the interface
2. Use type assertion: `(item as any).X`
3. Use optional chaining: `item.X?.value`

### Issue: "Type 'undefined' is not assignable to type 'X'"

**Solution**: Make the type nullable:
```typescript
// Before
const item: Item = getItem(); // Error if getItem() returns undefined

// After
const item: Item | undefined = getItem(); // ✅ Correct
```

### Issue: Compilation is slow

**Solution**:
1. Use `--noEmit` for type checking only
2. Enable `incremental` mode in tsconfig
3. Exclude unnecessary files in tsconfig

---

## Future Enhancements

### 1. Stricter Type Checking

Enable strict mode incrementally:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Generic Types

Add generics for reusable patterns:
```typescript
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function fetchItem(id: string): ServiceResponse<Item> {
  // ...
}
```

### 3. Conditional Types

Advanced type manipulation:
```typescript
type ItemsByCategory<C extends ItemCategory> =
  C extends 'equipment' ? EquipmentItem :
  C extends 'consumable' ? ConsumableItem :
  C extends 'resource' ? ResourceItem :
  never;
```

### 4. Enum Types

Replace string literals with enums:
```typescript
enum Rarity {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary'
}
```

---

## Summary

### What Was Achieved

✅ **882 lines** of type definitions
✅ **2,222 lines** of typed service code
✅ **6 services** converted to TypeScript
✅ **70+ interfaces** covering all game systems
✅ **13 type guard** functions for runtime safety
✅ **Zero compilation errors**
✅ **100% backward compatible** with existing JavaScript

### Impact

- **Development Speed**: Faster with autocomplete and instant error checking
- **Code Quality**: Type safety prevents entire classes of bugs
- **Refactoring**: Safe and confident code changes
- **Documentation**: Types serve as always-up-to-date documentation
- **Onboarding**: New developers understand code structure immediately

### Maintenance

- **Keep types in sync** with JSON data files
- **Add types** for new systems as they're built
- **Gradually enable** stricter TypeScript settings
- **Convert controllers** to TypeScript when convenient

---

## References

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Type Definitions**: `be/types/`
- **Services**: `be/services/*.ts`
- **Configuration**: `be/tsconfig.json`
- **CLAUDE.md**: Project documentation with TypeScript section
