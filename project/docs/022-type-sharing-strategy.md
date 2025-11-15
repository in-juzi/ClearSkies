# Type Sharing Strategy: Backend ↔ Frontend

## Current Problem

ClearSkies has **duplicate type definitions** across backend and frontend:

**Backend** (`be/types/`): 70+ TypeScript types
**Frontend** (`ui/src/app/models/`): ~30 duplicate types with slight variations

**Issues:**
- 🔴 Type drift risk when backend changes aren't reflected in frontend
- 🔴 Maintenance overhead (update types in 2+ places)
- 🔴 No compile-time API contract enforcement
- 🔴 Inconsistencies between backend/frontend type definitions

## Recommended Approach: TypeScript Path Mapping

**Single source of truth** using TypeScript path aliases to import backend types directly in frontend.

### Pros
✅ True single source of truth
✅ Compile-time type safety across full stack
✅ Works with watch mode and hot reload
✅ No build script maintenance
✅ Backend API changes caught at frontend compile-time

### Cons
❌ Requires adjusting import paths across codebase (~2-4 hours)
❌ Slightly more complex directory structure

## Implementation Plan

### Step 1: Create Shared Types Directory

```
shared/
└── types/
    ├── index.ts        # Barrel export (re-export all types)
    ├── common.ts       # Rarity, EquipmentSlot, SkillName, Stats
    ├── items.ts        # Item, EquipmentItem, ResourceItem, etc.
    ├── locations.ts    # Location, Activity, Facility, DropTable
    ├── crafting.ts     # Recipe, Vendor, ActiveCrafting
    ├── combat.ts       # Monster, Ability, ActiveCombat
    ├── models.ts       # API response models (PlayerModel, etc.)
    └── guards.ts       # Type guard functions
```

Move `be/types/` → `shared/types/` (keep Mongoose-specific types in `be/types/` if needed).

### Step 2: Configure TypeScript Path Mapping

**Backend** (`be/tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"],
      "@shared/types": ["../shared/types/index"]
    }
  }
}
```

**Frontend** (`ui/tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"],
      "@shared/types": ["../shared/types/index"]
    }
  }
}
```

### Step 3: Update Imports

**Backend Services** (e.g., `be/services/itemService.ts`):
```typescript
// Before
import { Item, ResourceItem, EquipmentItem } from '../types';

// After
import { Item, ResourceItem, EquipmentItem } from '@shared/types';
```

**Frontend Services** (e.g., `ui/src/app/services/inventory.service.ts`):
```typescript
// Before
import { ItemDefinition, ItemInstance } from '../models/inventory.model';

// After
import { Item, ItemInstance } from '@shared/types';

getItemDefinition(itemId: string): Observable<Item> {
  return this.http.get<Item>(`${this.apiUrl}/definitions/${itemId}`);
}
```

### Step 4: Remove Duplicate Frontend Models

After migration, delete:
- `ui/src/app/models/inventory.model.ts`
- `ui/src/app/models/location.model.ts`
- `ui/src/app/models/recipe.model.ts`
- `ui/src/app/models/vendor.model.ts`

Keep only frontend-specific models (e.g., UI state, derived data).

### Step 5: Create Frontend-Specific Extensions (Optional)

For UI-specific enhancements, extend shared types:

```typescript
import { Item, ItemInstance } from '@shared/types';

// Frontend-specific extension
export interface ItemDetails extends ItemInstance {
  definition: Item;           // Backend type
  vendorPrice: number;        // Calculated by backend
  qualityDetails: QualityMap; // Frontend enhancement
}
```

## Migration Priority

Migrate types in order of usage frequency:

1. ✅ **Week 1**: Common types (`common.ts`) - Most fundamental
2. ✅ **Week 2**: Item types (`items.ts`) - Most frequently used
3. ✅ **Week 3**: Location types (`locations.ts`) - Second most common
4. ✅ **Week 4**: Crafting & Combat types - Complete migration
5. ✅ **Week 5**: Cleanup - Remove all duplicate frontend models

## Alternative Approaches

### Approach 2: Copy Types on Build (Simpler)

Add prebuild script to copy `be/types/` → `ui/src/app/types/`.

**Pros:** Simpler, no path mapping
**Cons:** Types only update on build, not in watch mode

**When to use:** If path mapping causes Angular build issues.

### Approach 3: Incremental Adoption (Lowest Effort)

Create `be/types/shared.ts` barrel file with curated exports, copy only that file.

**Pros:** Minimal disruption, test concept first
**Cons:** Not a complete solution, still some duplication

**When to use:** As stepping stone to Approach 1, or if time is limited.

## Expected Benefits

After full migration:

- 🎯 **Type Safety**: Backend API changes caught at frontend compile-time
- 📉 **50% Reduction**: in type definition maintenance
- 🐛 **Fewer Bugs**: Impossible frontend/backend type mismatches
- 📚 **Better DX**: Single import path for all game types
- 🚀 **Faster Dev**: No manual type synchronization

## Example: Before & After

### Before (Duplicate Types)

**Backend** (`be/types/items.ts`):
```typescript
export interface Item {
  itemId: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategories: string[];
  rarity: Rarity;
  baseValue: number;
  // ... 20+ more properties
}
```

**Frontend** (`ui/src/app/models/inventory.model.ts`):
```typescript
export interface ItemDefinition {
  itemId: string;
  name: string;
  description: string;
  category: string;
  subcategories: string[];
  rarity: string;
  baseValue: number;
  // ... slight variations, drift risk!
}
```

**Problem:** Manual sync required, type drift risk.

### After (Shared Types)

**Shared** (`shared/types/items.ts`):
```typescript
export interface Item {
  itemId: string;
  name: string;
  description: string;
  category: ItemCategory;
  subcategories: string[];
  rarity: Rarity;
  baseValue: number;
  // ... single source of truth
}
```

**Backend Service** (`be/services/itemService.ts`):
```typescript
import { Item } from '@shared/types';

getItemDefinition(itemId: string): Item | undefined {
  return this.itemRegistry.get(itemId);
}
```

**Frontend Service** (`ui/src/app/services/inventory.service.ts`):
```typescript
import { Item, ItemInstance } from '@shared/types';

getItemDefinition(itemId: string): Observable<Item> {
  return this.http.get<Item>(`${this.apiUrl}/definitions/${itemId}`);
}
```

**Benefit:** Compile-time guarantee that API returns exactly what frontend expects!

## Type Safety Example

**Without shared types:**
```typescript
// Backend changes Item.rarity from string to Rarity enum
// Frontend still expects string - NO COMPILE ERROR
// Runtime error when UI tries to display rarity
```

**With shared types:**
```typescript
// Backend changes Item.rarity from string to Rarity enum
// Frontend compile fails: "Type 'Rarity' is not assignable to type 'string'"
// Fix frontend before deploying - caught at compile time!
```

## Specific Types to Share

### High Priority (Most Duplicated)
- ✅ Item types (`items.ts`) - Item, EquipmentItem, ResourceItem, ConsumableItem
- ✅ Common types (`common.ts`) - Rarity, EquipmentSlot, SkillName, Stats
- ✅ Location types (`locations.ts`) - Location, Activity, Facility
- ✅ Recipe types (`crafting.ts`) - Recipe, Vendor, ActiveCrafting
- ✅ Combat types (`combat.ts`) - Monster, Ability, ActiveCombat

### Medium Priority
- ✅ Model types (`models.ts`) - API response shapes (PlayerModel, etc.)
- ✅ Type guards (`guards.ts`) - Runtime type checking functions

### Low Priority (Frontend-Specific)
- ❌ UI state types - Keep in frontend
- ❌ Component-specific types - Keep in frontend
- ❌ Angular-specific types - Keep in frontend

## Implementation Effort

**Total Time:** 2-4 hours for full migration

- ⏱️ 30 min: Create `shared/types/` and move files
- ⏱️ 1 hour: Update tsconfig.json and test builds
- ⏱️ 1-2 hours: Update backend service imports
- ⏱️ 1 hour: Update frontend service imports, remove duplicates

**Incremental:** Can be done over multiple sessions, one type category at a time.

## Testing Plan

After each migration phase:

1. ✅ **TypeScript Compilation**: `cd be && npm run build` and `cd ui && ng build`
2. ✅ **Backend Tests**: `cd be && npm test` (if tests exist)
3. ✅ **Frontend Tests**: `cd ui && ng test` (if tests exist)
4. ✅ **Manual Testing**: Start servers, test affected features
5. ✅ **Validation Script**: `cd be && npm run validate`

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Import path complexity | Use barrel files (`@shared/types`) for clean imports |
| Build time increase | Minimal - TypeScript already compiles both, no extra step |
| Breaking existing code | Migrate incrementally, test after each phase |
| Angular path resolution issues | Use both `paths` and `baseUrl` in tsconfig.json |
| Team unfamiliarity | Document patterns, code review, pair programming |

## Next Steps

Ready to implement? Choose approach:

1. **Full Migration (Recommended)**: Implement TypeScript path mapping
2. **Test First**: Start with Approach 3 (incremental) for 1-2 types
3. **Discuss**: Review pros/cons with team before committing

## Related Documentation

- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Angular Path Mapping](https://angular.io/guide/file-structure#path-mapping)
- [Item Constants System](../../be/data/constants/README.md)
- [Backend Type System](../../be/types/README.md)
