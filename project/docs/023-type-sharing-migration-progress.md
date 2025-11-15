# Type Sharing Migration Progress

## ✅ Completed (Backend)

The backend has been fully migrated to use shared types via TypeScript path mapping!

### What Was Done

1. **✅ Created Shared Types Directory**
   - Moved all type files from `be/types/` → `shared/types/`
   - Kept `express.d.ts` in backend (Express-specific)
   - Shared types now include: combat.ts, common.ts, crafting.ts, guards.ts, items.ts, locations.ts, models.ts, validation.ts

2. **✅ Updated Backend TypeScript Configuration**
   - Added path mapping in `be/tsconfig.json`:
     ```json
     "baseUrl": "./",
     "paths": {
       "@shared/*": ["../shared/*"],
       "@shared/types": ["../shared/types/index"]
     }
     ```
   - Removed `rootDir` constraint to allow shared files outside be/ directory
   - Added `../shared/**/*.ts` to include paths

3. **✅ Updated All Backend Imports**
   - Replaced `from '../types'` → `from '@shared/types'`
   - Replaced `from './types'` → `from '@shared/types'`
   - 13 files updated:
     - ✅ be/controllers/attributesController.ts
     - ✅ be/controllers/inventoryController.ts
     - ✅ be/controllers/skillsController.ts
     - ✅ be/models/Player.ts
     - ✅ be/scripts/validate-game-data.ts
     - ✅ be/services/combatService.ts
     - ✅ be/services/dropTableService.ts
     - ✅ be/services/itemService.ts
     - ✅ be/services/locationService.ts
     - ✅ be/services/recipeService.ts
     - ✅ be/services/vendorService.ts
     - ✅ be/sockets/activityHandler.ts
     - ✅ be/types/index.ts

4. **✅ Fixed Shared Type Dependencies**
   - Updated `shared/types/guards.ts` to use correct path for item-constants:
     ```typescript
     import { SUBCATEGORY } from '../../be/data/constants/item-constants';
     ```

5. **✅ Verified Backend Build**
   - ✅ TypeScript compilation succeeds
   - ✅ Validation script passes (0 errors, 10 expected warnings)
   - ✅ All shared types resolve correctly
   - ✅ Build output in `be/dist/` includes compiled shared types

### Backend Result

**Single source of truth achieved!** Backend now imports all types from `@shared/types` with compile-time validation.

Example usage:
```typescript
// Before
import { Item, ItemInstance } from '../types';

// After
import { Item, ItemInstance } from '@shared/types';
```

---

## 🔄 Next Steps (Frontend)

The frontend configuration is ready, but imports haven't been migrated yet. Here's what needs to be done:

### Frontend Migration TODO

1. **Update Frontend TypeScript Configuration** ✅ DONE
   - Path mapping already added to `ui/tsconfig.app.json`
   - Ready to import from `@shared/types`

2. **Update Frontend Service Imports** (MANUAL WORK REQUIRED)

   Services that need migration (~10-15 files):
   - [ ] `ui/src/app/services/inventory.service.ts`
   - [ ] `ui/src/app/services/location.service.ts`
   - [ ] `ui/src/app/services/recipe.service.ts`
   - [ ] `ui/src/app/services/combat.service.ts`
   - [ ] `ui/src/app/services/vendor.service.ts`
   - [ ] `ui/src/app/services/chat.service.ts`
   - [ ] Other services as needed

   **Migration Pattern:**
   ```typescript
   // Before
   import { ItemDefinition, ItemInstance } from '../models/inventory.model';

   // After
   import { Item, ItemInstance } from '@shared/types';

   // Note: Rename ItemDefinition → Item (backend name)
   ```

3. **Remove Duplicate Frontend Models** (AFTER MIGRATION)

   Once services are migrated, delete these duplicate type files:
   - [ ] `ui/src/app/models/inventory.model.ts` (keep ItemDetails, remove Item types)
   - [ ] `ui/src/app/models/location.model.ts`
   - [ ] `ui/src/app/models/recipe.model.ts`
   - [ ] `ui/src/app/models/vendor.model.ts`

   **Keep frontend-specific types** like:
   - `ItemDetails` (extends backend Item with UI-specific data)
   - Component-specific interfaces
   - Angular-specific types

4. **Create Frontend Type Extensions** (RECOMMENDED)

   For UI-specific enhancements:
   ```typescript
   // ui/src/app/models/ui-extensions.ts
   import { Item, ItemInstance } from '@shared/types';

   export interface ItemDetails extends ItemInstance {
     definition: Item;           // Backend type
     vendorPrice: number;        // Calculated by backend API
     qualityDetails: any;        // Frontend-specific display data
   }
   ```

5. **Test Frontend Build**
   ```bash
   cd ui && ng build
   ```

   Expected result: TypeScript compilation succeeds with shared types

6. **Update Component Imports** (OPTIONAL)

   Components can also import shared types if needed:
   ```typescript
   import { Item, Rarity } from '@shared/types';
   ```

### Migration Strategy

**Incremental Approach (Recommended):**
1. Start with 1 service (e.g., inventory.service.ts)
2. Update imports, test build
3. Fix any type mismatches
4. Repeat for other services
5. Remove duplicate models last

**Time Estimate:** 2-4 hours total
- 15-30 min per service (5-10 services)
- 30 min for cleanup and testing

---

## Benefits Achieved

### Backend Benefits ✅
- ✅ Single source of truth for all types
- ✅ Compile-time safety for API contracts
- ✅ No more duplicate type definitions
- ✅ Zero type drift between layers
- ✅ Better IDE autocomplete

### Frontend Benefits (After Migration)
- 🔄 Compile-time API contract enforcement
- 🔄 Backend API changes caught at frontend compile-time
- 🔄 50% reduction in type maintenance
- 🔄 Impossible frontend/backend type mismatches
- 🔄 Single import path for all game types

---

## Example: How It Works

### Before (Duplicate Types)

**Backend** (be/types/items.ts):
```typescript
export interface Item {
  itemId: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  // ... 30+ properties
}
```

**Frontend** (ui/src/app/models/inventory.model.ts):
```typescript
export interface ItemDefinition {
  itemId: string;
  name: string;
  category: string;  // ❌ Type mismatch!
  rarity: string;    // ❌ Type mismatch!
  // ... slight variations
}
```

**Problem:** Manual sync required, type drift risk, no compile-time validation.

### After (Shared Types)

**Shared** (shared/types/items.ts):
```typescript
export interface Item {
  itemId: string;
  name: string;
  category: ItemCategory;  // ✅ Type-safe enum
  rarity: Rarity;          // ✅ Type-safe enum
  // ... single source of truth
}
```

**Backend Service** (be/services/itemService.ts):
```typescript
import { Item } from '@shared/types';

getItemDefinition(itemId: string): Item | undefined {
  return this.itemRegistry.get(itemId);
}
```

**Frontend Service** (ui/src/app/services/inventory.service.ts):
```typescript
import { Item } from '@shared/types';

getItemDefinition(itemId: string): Observable<Item> {
  return this.http.get<Item>(`${this.apiUrl}/definitions/${itemId}`);
}
```

**Result:** Compile-time guarantee that API returns exactly what frontend expects!

### Type Safety Example

**Backend changes Item.rarity type:**
```typescript
// Changed Rarity from string to enum
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
```

**Frontend instantly knows:**
```typescript
// Frontend compile error if treating rarity as free-form string
const rarity: string = item.rarity; // ❌ Error: Type 'Rarity' is not assignable to 'string'

// Must use type-safe approach
const rarity: Rarity = item.rarity; // ✅ Works!
```

---

## File Structure

```
ClearSkies/
├── shared/
│   └── types/
│       ├── combat.ts           # Combat system types
│       ├── common.ts           # Rarity, EquipmentSlot, SkillName, etc.
│       ├── crafting.ts         # Recipe, Vendor, ActiveCrafting
│       ├── guards.ts           # Type guard functions
│       ├── index.ts            # Barrel export
│       ├── items.ts            # Item, EquipmentItem, ResourceItem, etc.
│       ├── locations.ts        # Location, Activity, Facility
│       ├── models.ts           # API response models
│       ├── validation.ts       # Validation types
│       └── README.md
├── be/
│   ├── tsconfig.json           # ✅ Path mapping configured
│   ├── types/
│   │   ├── express.d.ts        # Express-specific (stays in be/)
│   │   └── index.ts            # Re-exports from @shared/types
│   ├── services/               # ✅ All use @shared/types
│   ├── controllers/            # ✅ All use @shared/types
│   └── models/                 # ✅ All use @shared/types
└── ui/
    ├── tsconfig.app.json       # ✅ Path mapping configured
    ├── src/app/
    │   ├── services/           # 🔄 Need to migrate imports
    │   ├── models/             # 🔄 Can remove duplicates after migration
    │   └── components/         # 🔄 Can use @shared/types if needed
    └── ...
```

---

## Troubleshooting

### Backend Build Issues

**Problem:** `File is not under 'rootDir'` error
**Solution:** ✅ Already fixed - removed `rootDir` from tsconfig.json

**Problem:** `Cannot find module '@shared/types'`
**Solution:** Check paths in tsconfig.json and ensure `../shared/**/*.ts` is in include array

### Frontend Build Issues (When You Migrate)

**Problem:** Angular can't resolve `@shared/types`
**Solution:** Ensure baseUrl and paths are in `ui/tsconfig.app.json`, not just `ui/tsconfig.json`

**Problem:** Type mismatches after migration
**Solution:** Backend uses different type names (Item vs ItemDefinition) - update frontend type references

**Problem:** Missing properties on shared types
**Solution:** Some frontend models have UI-specific fields - create extension interfaces

---

## Next Actions

### For You (Frontend Migration)

1. **Start with one service:** Pick `inventory.service.ts` as first migration target
2. **Update imports:** Change `from '../models/inventory.model'` to `from '@shared/types'`
3. **Rename types:** `ItemDefinition` → `Item` (to match backend)
4. **Test build:** `cd ui && ng build`
5. **Fix any errors:** Update type references as needed
6. **Repeat:** Do the same for other services
7. **Cleanup:** Remove duplicate model files once all services migrated

### Optional Enhancements

- Create `ui/src/app/models/ui-extensions.ts` for frontend-specific type extensions
- Add JSDoc comments to shared types for better IDE hints
- Create type utility functions in shared/types/utils.ts
- Set up shared constants alongside shared types

---

## Summary

**Backend Migration: COMPLETE ✅**
- 100% of backend now uses `@shared/types`
- All builds passing
- Single source of truth established

**Frontend Migration: READY 🔄**
- Configuration complete
- Ready to import from `@shared/types`
- Manual migration of service imports needed (2-4 hours)

**Result:** Once frontend migration is complete, you'll have true end-to-end type safety with zero duplication!
