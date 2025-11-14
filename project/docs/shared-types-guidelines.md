# Shared Types Development Guidelines

## Overview

The `shared/` directory contains TypeScript code that is shared between the frontend (Angular) and backend (Node.js). This directory acts as a **self-contained mini-package** that both projects depend on, but it must not depend on either of them.

## Directory Structure

```
shared/
├── constants/
│   └── item-constants.ts    # Type-safe constants (CATEGORY, SUBCATEGORY, RARITY, etc.)
└── types/
    ├── index.ts             # Central export file (single entry point)
    ├── common.ts            # Base types (Rarity, Stats, Skill, IconConfig, ItemInstance)
    ├── items.ts             # Item hierarchy (Item, EquipmentItem, WeaponItem, etc.)
    ├── combat.ts            # Combat system (Monster, Ability, ActiveCombat)
    ├── combat-enums.ts      # Combat enumerations
    ├── locations.ts         # Locations (Location, Facility, Activity, DropTable)
    ├── crafting.ts          # Crafting (Recipe, Vendor, ActiveCrafting)
    ├── guards.ts            # Type guard functions (isWeaponItem, isEquipmentItem)
    └── models.ts            # Frontend model types
```

## Critical Rules

### ✅ DO:

1. **Keep shared code self-contained**
   - Everything in `shared/` should only import from within `shared/`
   - Never import from `be/` or `ui/` directories

2. **Use relative imports within shared**
   ```typescript
   // ✅ Correct
   import { CATEGORY } from '../constants/item-constants';
   import { Item } from './items';
   ```

3. **Export everything through `shared/types/index.ts`**
   - This is the single entry point for consumers
   - Both backend and frontend import via `@shared/types`

4. **Move shared constants to `shared/constants/`**
   - If both frontend and backend need it, it belongs in shared
   - Don't duplicate constants across projects

5. **Use relative paths for intra-shared imports**
   - TypeScript compiles these correctly regardless of output location

### ❌ DON'T:

1. **Import from `be/` or `ui/` directories**
   ```typescript
   // ❌ Wrong - breaks at runtime after compilation
   import { CATEGORY } from '../../be/data/constants/item-constants';
   ```

2. **Use absolute paths that aren't in shared**
   - Paths like `../../be/...` break when TypeScript compiles to JavaScript
   - The compiled output structure is different from the source structure

3. **Put backend/frontend-specific logic in shared**
   - Keep shared code truly generic
   - No MongoDB models, Angular components, etc.

4. **Forget to export new types from `index.ts`**
   - Always add new exports to the central index file

## Common Patterns

### Adding New Shared Types

```typescript
// ✅ shared/types/some-new-type.ts
import { CATEGORY } from '../constants/item-constants';  // Within shared
import { Item } from './items';  // Within shared

export interface NewType {
  item: Item;
  category: string;
}

export function someFunction(item: Item): boolean {
  return item.category === CATEGORY.EQUIPMENT;
}
```

Then export in `shared/types/index.ts`:
```typescript
export * from './some-new-type';
```

### Adding New Shared Constants

```typescript
// ✅ shared/constants/new-constants.ts
export const NEW_CONSTANT = {
  VALUE_1: 'value1',
  VALUE_2: 'value2',
} as const;
```

Export in `shared/types/index.ts`:
```typescript
export * from '../constants/new-constants';
```

### Using Shared Types in Backend

```typescript
// ✅ be/services/someService.ts
import { Item, Monster, CATEGORY, isWeaponItem } from '@shared/types';

function processItem(item: Item) {
  if (isWeaponItem(item)) {
    // Type narrowed to WeaponItem
    console.log(item.properties.damageRoll);
  }
}
```

### Using Shared Types in Frontend

```typescript
// ✅ ui/src/app/services/some.service.ts
import { Item, Monster, CATEGORY, isWeaponItem } from '@shared/types';

export class SomeService {
  processItem(item: Item) {
    if (isWeaponItem(item)) {
      // Type narrowed to WeaponItem
      console.log(item.properties.damageRoll);
    }
  }
}
```

## Compilation Process

### Backend Compilation

The backend `tsconfig.json` is configured to:
- `rootDir: "../"` - Start from project root
- `outDir: "./dist"` - Output to `be/dist/`
- `include: ["../shared/**/*.ts"]` - Include shared files

This compiles:
- `shared/types/index.ts` → `be/dist/shared/types/index.js`
- `shared/constants/item-constants.ts` → `be/dist/shared/constants/item-constants.js`

### Path Alias Resolution

Runtime path resolution is configured in `be/index.ts`:
```typescript
import { register } from 'tsconfig-paths';

register({
  baseUrl: __dirname,
  paths: {
    '@shared/types': ['../shared/types/index'],
    '@shared/types/*': ['../shared/types/*'],
    '@shared/constants/*': ['../shared/constants/*'],
    '@shared/*': ['../shared/*']
  }
});
```

This allows Node.js to resolve `require('@shared/types')` to the compiled files in `dist/shared/`.

## Historical Context

### The Original Problem (November 2024)

**Issue**: `shared/types/guards.ts` imported from `../../be/data/constants/item-constants`

**Why it broke**:
1. TypeScript compiled the relative import as-is into JavaScript
2. At runtime, `dist/shared/types/guards.js` tried to load `../../be/data/constants/item-constants`
3. This path didn't exist relative to the compiled location
4. Error: `Cannot find module '../../be/data/constants/item-constants'`

**The Fix**:
1. Moved `item-constants.ts` from `be/data/constants/` → `shared/constants/`
2. Updated `shared/types/guards.ts` to use `../constants/item-constants`
3. Created re-export at old location for backward compatibility
4. Added constants export to `shared/types/index.ts`
5. Configured runtime path resolution in `be/index.ts`

## Troubleshooting

### Error: "Cannot find module '@shared/types'"

**Cause**: Runtime path resolution not configured properly

**Fix**: Ensure `be/index.ts` has the `register()` call before any imports that use `@shared/types`

### Error: "Cannot find module '../../be/...'"

**Cause**: Shared code is importing from outside the shared directory

**Fix**: Move the imported code to `shared/` or use a different approach

### TypeScript can't find shared types

**Cause**: Path aliases not configured in tsconfig.json

**Fix**: Ensure both `be/tsconfig.json` and `ui/tsconfig.json` have:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/types": ["../shared/types/index"]
    }
  }
}
```

## Best Practices Summary

1. **Self-contained**: Shared code only imports from within `shared/`
2. **Single entry point**: Export everything through `shared/types/index.ts`
3. **Relative imports**: Use `../` for intra-shared imports
4. **Generic code only**: No project-specific dependencies
5. **Path aliases**: Use `@shared/types` from consuming code
6. **Backward compatibility**: Keep re-exports when moving files

## Related Documentation

- [TypeScript Type System](../../CLAUDE.md#typescript-type-system) - Main documentation
- [Item Constants System](../../be/data/constants/README.md) - Type-safe constants reference
