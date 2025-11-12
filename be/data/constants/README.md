# Item Constants

Centralized constant values for use in item definitions. This provides consistency, reduces typos, and makes it easier to maintain item properties across the codebase.

## Benefits

- **Type Safety**: Constants are strongly typed and validated at compile time
- **Consistency**: Ensures all items use the same values for common properties
- **Maintainability**: Change values in one place rather than across dozens of files
- **Autocomplete**: IDE provides suggestions for available constants
- **Readability**: Named constants are more descriptive than magic strings

## Usage Examples

### Basic Example - Using Rarity and Tier

```typescript
import { ResourceItem } from '../../../../types/items';
import { RARITY, TIER } from '../../../constants/item-constants';

export const CopperOre: ResourceItem = {
  itemId: "copper_ore",
  name: "Copper Ore",
  rarity: RARITY.COMMON,  // Instead of "common"
  properties: {
    tier: TIER.T1,        // Instead of 1
    // ...
  },
  // ...
} as const;
```

### Using Quality and Trait Sets

```typescript
import { QUALITY_SETS, TRAIT_SETS } from '../../../constants/item-constants';

export const OakLog: ResourceItem = {
  // ...
  allowedQualities: QUALITY_SETS.WOOD,      // ['woodGrain', 'moisture']
  allowedTraits: TRAIT_SETS.WOOD_PRISTINE,  // ['pristine', 'knotted', 'weathered']
  // ...
} as const;
```

### Using Material and Skill Source

```typescript
import { MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronOre: ResourceItem = {
  // ...
  properties: {
    material: MATERIAL.IRON,
    skillSource: SKILL_SOURCE.MINING,
    // ...
  },
  // ...
} as const;
```

### Using Subcategories

```typescript
import { SUBCATEGORIES } from '../../../constants/item-constants';

export const Amethyst: ResourceItem = {
  // ...
  subcategories: SUBCATEGORIES.GEMSTONE,  // ['gemstone', 'crystal', 'jewelry', 'enchanting']
  // ...
} as const;
```

### Equipment Items - Slots and Subtypes

```typescript
import { SLOT, WEAPON_SUBTYPE, WEAPON_TYPE } from '../../../constants/item-constants';

export const IronSword: WeaponItem = {
  // ...
  slot: SLOT.MAIN_HAND,
  subtype: WEAPON_SUBTYPE.SWORD,
  weaponType: WEAPON_TYPE.ONE_HANDED,
  // ...
} as const;
```

### Custom Combinations

You can also mix constants with custom values:

```typescript
import { RARITY, TRAIT_SETS } from '../../../constants/item-constants';

export const SpecialItem: ResourceItem = {
  // ...
  rarity: RARITY.EPIC,
  allowedQualities: ['purity', 'sheen'],  // Custom quality combo
  allowedTraits: TRAIT_SETS.BLESSED,      // Just blessed trait
  // ...
} as const;
```

## Available Constants

### RARITY
- `COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`

### TIER
- `T1` (1), `T2` (2), `T3` (3), `T4` (4), `T5` (5)

### QUALITY_SETS
- `NONE` - No qualities
- `WOOD` - Wood-based items (woodGrain, moisture)
- `ORE` - Raw ore (purity)
- `METAL` - Processed metals (purity, sheen)
- `GEMSTONE` - Gems and crystals (sheen)
- `FOOD` - Food items (age)
- `HERB` - Herbs and plants (age)

### TRAIT_SETS
- `NONE` - No traits
- `WOOD` - Wood items (knotted, weathered)
- `WOOD_PRISTINE` - Premium wood (pristine, knotted, weathered)
- `EQUIPMENT` - Metal equipment (masterwork, cursed, blessed)
- `EQUIPMENT_PRISTINE` - Premium equipment (pristine, masterwork, cursed, blessed)
- `GEMSTONE` - Gems (pristine, blessed)
- `FOOD` - Food items (blessed, cursed)
- `FOOD_FRAGRANT` - Aromatic food (fragrant, blessed, cursed)
- `HERB` - Herbs (fragrant, blessed)
- `HERB_PRISTINE` - Premium herbs (pristine, fragrant, blessed)
- `POTION` - Potions (blessed, cursed)

### SUBCATEGORIES
- `WOOD`, `ORE`, `INGOT`, `FISH`, `GEMSTONE`, `HERB`
- `MONSTER_DROP`, `MONSTER_DROP_ALCHEMY`
- `COOKED_FOOD`, `POTION`

### SKILL_SOURCE
- `WOODCUTTING`, `MINING`, `FISHING`, `HERBALISM`, `SMITHING`, `COOKING`
- `COMBAT`, `ONE_HANDED`, `DUAL_WIELD`, `TWO_HANDED`, `RANGED`, `CASTING`, `GUN`

### MATERIAL
- Metals: `BRONZE`, `IRON`, `STEEL`, `COPPER`, `TIN`, `SILVER`, `GOLD`
- Woods: `OAK`, `WILLOW`, `MAPLE`, `YEW`, `BAMBOO`
- Gemstones: `AMETHYST`, `CITRINE`, `AQUAMARINE`, `GARNET`, `EMERALD`
- Other: `LEATHER`, `HEMP`, `GEMSTONE`, `GENERIC`

### SLOT (Equipment)
- `MAIN_HAND`, `OFF_HAND`, `HEAD`, `BODY`, `BELT`
- `GLOVES`, `BOOTS`, `NECKLACE`, `RING_RIGHT`, `RING_LEFT`

### WEAPON_SUBTYPE
- `SWORD`, `AXE`, `MACE`, `DAGGER`, `STAFF`, `BOW`, `CROSSBOW`, `GUN`, `SHIELD`
- `WOODCUTTING_AXE`, `MINING_PICKAXE`, `FISHING_ROD`

### ARMOR_SUBTYPE
- `HELM`, `COIF`, `TUNIC`, `PLATE`, `GLOVES`, `BOOTS`, `BELT`

### WEAPON_TYPE
- `ONE_HANDED`, `DUAL_WIELD`, `TWO_HANDED`, `RANGED`, `CASTING`, `GUN`

### ARMOR_TYPE
- `LIGHT`, `MEDIUM`, `HEAVY`

### CONSUMABLE_SUBTYPE
- `HEALTH_POTION`, `MANA_POTION`, `FOOD`, `BUFF_POTION`

## Migration Guide

To migrate existing item definitions to use constants:

1. Add import at the top of the file:
   ```typescript
   import { RARITY, TIER, QUALITY_SETS, TRAIT_SETS } from '../../../constants/item-constants';
   ```

2. Replace string literals with constants:
   - `"common"` → `RARITY.COMMON`
   - `1` → `TIER.T1`
   - `["sheen"]` → `QUALITY_SETS.GEMSTONE`
   - `["pristine", "blessed"]` → `TRAIT_SETS.GEMSTONE`

3. TypeScript will validate that constants are used correctly

4. Run `npm run build` to verify compilation succeeds

## Adding New Constants

When adding new materials, subtypes, or categories:

1. Add the constant to the appropriate section in `item-constants.ts`
2. Update this README with the new constant
3. Consider creating new preset combinations if applicable
4. Run `npm run build` to ensure type safety

## Notes

- All constants use `as const` to ensure type safety
- The Item type definitions accept `readonly` arrays to work with constants
- You can still use custom values where needed - constants are optional
- Constants reduce the chance of typos in commonly used values
