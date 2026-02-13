# UI Utilities Reference

## Overview

The frontend uses centralized utilities for common operations, eliminating duplicate code across components.

## Rarity Utilities

### Location

[ui/src/app/pipes/](../../ui/src/app/pipes/)

### Available Pipes

#### RarityClassPipe

Maps rarity values to CSS border class names.

**Usage**:
```typescript
import { RarityClassPipe } from '../pipes/rarity-class.pipe';

// In template:
<div [class]="item.rarity | rarityClass">...</div>
```

**Output**:
- `common` → `border-gray-500`
- `uncommon` → `border-green-500`
- `rare` → `border-blue-500`
- `epic` → `border-purple-500`
- `legendary` → `border-orange-500`

#### RarityColorPipe

Maps rarity values to CSS text color class names.

**Usage**:
```typescript
import { RarityColorPipe } from '../pipes/rarity-color.pipe';

// In template:
<span [class]="item.rarity | rarityColor">{{ item.name }}</span>
```

**Output**:
- `common` → `text-gray-400`
- `uncommon` → `text-green-400`
- `rare` → `text-blue-400`
- `epic` → `text-purple-400`
- `legendary` → `text-orange-400`

#### RarityNamePipe

Capitalizes rarity names for display.

**Usage**:
```typescript
import { RarityNamePipe } from '../pipes/rarity-name.pipe';

// In template:
<span>{{ item.rarity | rarityName }}</span>
```

**Output**:
- `common` → `Common`
- `uncommon` → `Uncommon`
- `rare` → `Rare`
- `epic` → `Epic`
- `legendary` → `Legendary`

### Component Setup

```typescript
import { RarityClassPipe, RarityColorPipe, RarityNamePipe } from '../pipes';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [RarityClassPipe, RarityColorPipe, RarityNamePipe],
  templateUrl: './my-component.html'
})
export class MyComponent {}
```

## Item Filter Service

### Location

[ui/src/app/services/item-filter.service.ts](../../ui/src/app/services/item-filter.service.ts)

### Available Methods

#### filterByCategory()

Filter items by category.

```typescript
filterByCategory(items: ItemInstance[], category: string): ItemInstance[]
```

**Example**:
```typescript
const equipmentItems = this.itemFilter.filterByCategory(items, 'equipment');
```

#### filterBySubcategory()

Filter items by subcategory.

```typescript
filterBySubcategory(items: ItemInstance[], subcategory: string): ItemInstance[]
```

**Example**:
```typescript
const weapons = this.itemFilter.filterBySubcategory(items, 'weapon');
```

#### filterByRarity()

Filter items by rarity.

```typescript
filterByRarity(items: ItemInstance[], rarity: string): ItemInstance[]
```

**Example**:
```typescript
const rareItems = this.itemFilter.filterByRarity(items, 'rare');
```

#### filterBySearch()

Search items by name or itemId.

```typescript
filterBySearch(items: ItemInstance[], searchTerm: string): ItemInstance[]
```

**Example**:
```typescript
const searchResults = this.itemFilter.filterBySearch(items, 'sword');
```

#### filterByQuality()

Filter items by minimum quality level.

```typescript
filterByQuality(items: ItemInstance[], minQuality: number): ItemInstance[]
```

**Example**:
```typescript
const highQuality = this.itemFilter.filterByQuality(items, 3);
```

#### filterByTrait()

Filter items that have a specific trait.

```typescript
filterByTrait(items: ItemInstance[], traitId: string): ItemInstance[]
```

**Example**:
```typescript
const pristineItems = this.itemFilter.filterByTrait(items, 'pristine');
```

#### filterEquipped()

Filter only equipped items.

```typescript
filterEquipped(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const equippedItems = this.itemFilter.filterEquipped(items);
```

#### filterUnequipped()

Filter only unequipped items.

```typescript
filterUnequipped(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const unequippedItems = this.itemFilter.filterUnequipped(items);
```

#### applyFilters()

Apply multiple filters at once.

```typescript
applyFilters(
  items: ItemInstance[],
  filters: {
    category?: string;
    subcategory?: string;
    rarity?: string;
    search?: string;
    minQuality?: number;
    trait?: string;
    equipped?: boolean;
  }
): ItemInstance[]
```

**Example**:
```typescript
const filtered = this.itemFilter.applyFilters(items, {
  category: 'equipment',
  rarity: 'rare',
  search: 'sword'
});
```

### Component Setup

```typescript
import { ItemFilterService } from '../services/item-filter.service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [],
  providers: [ItemFilterService]
})
export class MyComponent {
  constructor(private itemFilter: ItemFilterService) {}
}
```

## Item Sort Utilities

### Location

[ui/src/app/utils/item-sort.utils.ts](../../ui/src/app/utils/item-sort.utils.ts)

### Available Functions

#### sortByScore()

Sort items by quality + trait score (customizable trait weight).

```typescript
sortByScore(items: ItemInstance[], traitWeight: number = 0.5): ItemInstance[]
```

**Example**:
```typescript
import { sortByScore } from '../utils/item-sort.utils';

const sortedByScore = sortByScore(items, 0.75); // Higher trait weight
```

#### sortByName()

Sort items alphabetically by name.

```typescript
sortByName(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByName = sortByName(items);
```

#### sortByRarity()

Sort items by rarity (legendary → common).

```typescript
sortByRarity(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByRarity = sortByRarity(items);
```

#### sortByCategory()

Sort items by category (alphabetically).

```typescript
sortByCategory(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByCategory = sortByCategory(items);
```

#### sortByQuantity()

Sort items by quantity (descending).

```typescript
sortByQuantity(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByQuantity = sortByQuantity(items);
```

#### sortByWeight()

Sort items by weight (heaviest first).

```typescript
sortByWeight(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByWeight = sortByWeight(items);
```

#### sortByValue()

Sort items by base value (highest first).

```typescript
sortByValue(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sortedByValue = sortByValue(items);
```

#### sortByCategoryRarityScore()

Multi-criteria sort: category → rarity → score.

```typescript
sortByCategoryRarityScore(items: ItemInstance[]): ItemInstance[]
```

**Example**:
```typescript
const sorted = sortByCategoryRarityScore(items);
```

#### calculateItemScore()

Helper function to calculate item score.

```typescript
calculateItemScore(item: ItemInstance, traitWeight: number = 0.5): number
```

**Example**:
```typescript
const score = calculateItemScore(item, 0.5);
```

### Component Setup

```typescript
import { sortByRarity, calculateItemScore } from '../utils/item-sort.utils';

@Component({
  selector: 'app-my-component',
  standalone: true
})
export class MyComponent {
  sortItems() {
    this.items = sortByRarity(this.items);
  }
}
```

## Benefits

### Code Reduction
- ✅ Eliminates 100+ lines of duplicate code across components
- ✅ Single source of truth for filtering and sorting logic
- ✅ Easier to test and maintain

### Consistency
- ✅ Uniform behavior across inventory, bank, vendor, crafting, equipment
- ✅ Same rarity styling everywhere
- ✅ Predictable sorting and filtering

### Developer Experience
- ✅ Simple, intuitive APIs
- ✅ TypeScript type safety
- ✅ IDE autocomplete support
- ✅ Composable utilities (chain filters and sorts)

## Migration Status

All game components migrated to use centralized utilities:
- ✅ Inventory component
- ✅ Bank component
- ✅ Vendor component
- ✅ Equipment component
- ✅ Crafting component
- ✅ Item details panel component

## Usage Patterns

### Filtering + Sorting

```typescript
import { ItemFilterService } from '../services/item-filter.service';
import { sortByRarity } from '../utils/item-sort.utils';

// Filter then sort
const filtered = this.itemFilter.filterByCategory(items, 'equipment');
const sorted = sortByRarity(filtered);
```

### Multiple Filters

```typescript
const result = this.itemFilter.applyFilters(items, {
  category: 'equipment',
  rarity: 'rare',
  minQuality: 3,
  equipped: false
});
```

### Custom Sort Order

```typescript
// Sort by score with high trait weight
const sorted = sortByScore(items, 1.0); // Traits heavily weighted

// Sort by multiple criteria
const sorted = items
  .filter(item => item.category === 'equipment')
  .sort((a, b) => {
    // First by rarity
    const rarityCompare = sortByRarity([a, b]);
    if (rarityCompare[0] !== a) return 1;
    // Then by score
    return calculateItemScore(b) - calculateItemScore(a);
  });
```

## See Also

- [015-inventory-system.md](015-inventory-system.md) - Inventory system architecture
- [011-level-based-quality-trait-system.md](011-level-based-quality-trait-system.md) - Quality/trait system
