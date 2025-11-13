# Backend Type Definitions

This directory contains TypeScript type definitions for the ClearSkies game backend.

## Frontend Usage

To use these types in your Angular frontend, you have two options:

### Option 1: Direct Import (Recommended for Development)

Add a path mapping in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@backend-types": ["../be/types/index.ts"]
    }
  }
}
```

Then import types:

```typescript
import { PlayerModel, UserModel, InventoryItemModel } from '@backend-types';
```

### Option 2: Copy Compiled Types

After running `npm run build` in the backend, copy the compiled `.d.ts` files:

```bash
cp be/dist/types/*.d.ts ui/src/app/types/backend/
```

Then import:

```typescript
import { PlayerModel, UserModel } from 'app/types/backend/models';
```

## Available Model Types

### User Types
- `UserModel` - User account information
- `AuthResponse` - Login/register response shape
- `PlayerProfileResponse` - Profile endpoint response

### Player Types
- `PlayerModel` - Complete player data
- `InventoryItemModel` - Inventory item instance
- `PlayerStatsModel` - Player health/mana/stats
- `ActiveCombatModel` - Active combat state
- `CombatStatsModel` - Combat statistics tracking
- `InventoryResponse` - Inventory endpoint response
- `EquippedItemsResponse` - Equipment endpoint response

### Chat Types
- `ChatMessageModel` - Chat message structure
- `ChatChannel` - Available chat channels

## Type Safety Benefits

Using these shared types ensures:
- ✅ Frontend and backend stay in sync
- ✅ Compile-time errors for API mismatches
- ✅ IntelliSense/autocomplete in Angular services
- ✅ Refactoring safety across full stack

## Example: Angular Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerModel, InventoryResponse } from '@backend-types';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient) {}

  getInventory(): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>('/api/inventory');
  }

  getPlayer(): Observable<PlayerModel> {
    return this.http.get<PlayerModel>('/api/player');
  }
}
```

## Keeping Types in Sync

When backend models change:
1. TypeScript compilation will fail if types are incompatible
2. Update frontend code to match new types
3. Rebuild both backend and frontend

This creates a **contract** between frontend and backend, catching breaking changes at compile time instead of runtime.
