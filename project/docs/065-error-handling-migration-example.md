# Error Handling Migration Example

This document shows how to migrate existing controllers to use the new standardized error handling system.

## Overview

The new error handling system provides:
- **Type-safe error classes** with appropriate HTTP status codes
- **Consistent error response format** across all endpoints
- **Automatic error logging** with request context
- **Development-friendly stack traces** and metadata
- **Async error handling** with wrapper utility

## Error Classes Available

```typescript
import {
  AppError,              // Base class (custom errors)
  BadRequestError,       // 400 - Invalid request data
  UnauthorizedError,     // 401 - Authentication required
  ForbiddenError,        // 403 - Insufficient permissions
  NotFoundError,         // 404 - Resource not found
  ConflictError,         // 409 - Resource conflict (e.g., duplicate)
  ValidationError,       // 422 - Validation failed
  InternalServerError,   // 500 - Unexpected server error
  asyncHandler           // Async route wrapper
} from '../utils/errors';
```

## Migration Pattern

### Before (Old Pattern)

```typescript
// ❌ Old error handling - inconsistent responses, manual status codes

export const getItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error: any) {
    console.error('Error getting item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item',
      error: error.message
    });
  }
};
```

### After (New Pattern)

```typescript
// ✅ New error handling - standardized errors, automatic handling

import { asyncHandler, BadRequestError, NotFoundError } from '../utils/errors';

export const getItem = asyncHandler(async (req: Request, res: Response) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError('Item ID is required');
  }

  const item = await Item.findById(itemId);

  if (!item) {
    throw new NotFoundError('Item not found', { itemId });
  }

  res.json({
    success: true,
    data: item
  });
});
```

## Key Differences

### 1. No Try-Catch Blocks
- **Before**: Manual try-catch in every route
- **After**: Use `asyncHandler` wrapper - automatically catches errors

### 2. Throw Instead of Return
- **Before**: `return res.status(400).json({...})`
- **After**: `throw new BadRequestError('message')`

### 3. Consistent Error Responses
- **Before**: Different response formats per endpoint
- **After**: Centralized middleware formats all errors consistently

### 4. Metadata Support
- **Before**: No structured error context
- **After**: Optional metadata object for debugging

```typescript
throw new NotFoundError('User not found', { userId, searchedEmail: email });
```

### 5. Automatic Logging
- **Before**: Manual console.error calls
- **After**: Centralized error handler logs with request context

## Common Scenarios

### Validation Errors

```typescript
// Before
if (!req.body.username || !req.body.password) {
  return res.status(400).json({
    success: false,
    message: 'Username and password required'
  });
}

// After
if (!req.body.username || !req.body.password) {
  throw new ValidationError('Username and password required', {
    received: Object.keys(req.body)
  });
}
```

### Resource Not Found

```typescript
// Before
const player = await Player.findById(req.user._id);
if (!player) {
  return res.status(404).json({
    success: false,
    message: 'Player not found'
  });
}

// After
const player = await Player.findById(req.user._id);
if (!player) {
  throw new NotFoundError('Player not found', { userId: req.user._id });
}
```

### Authorization Errors

```typescript
// Before
if (player.gold < itemPrice) {
  return res.status(400).json({
    success: false,
    message: 'Insufficient gold'
  });
}

// After
if (player.gold < itemPrice) {
  throw new BadRequestError('Insufficient gold', {
    required: itemPrice,
    available: player.gold
  });
}
```

### Duplicate Resource Conflicts

```typescript
// Before
const existingUser = await User.findOne({ username });
if (existingUser) {
  return res.status(409).json({
    success: false,
    message: 'Username already exists'
  });
}

// After
const existingUser = await User.findOne({ username });
if (existingUser) {
  throw new ConflictError('Username already exists', { username });
}
```

### Custom Error Cases

```typescript
// Before
if (player.level < requiredLevel) {
  return res.status(400).json({
    success: false,
    message: `Requires level ${requiredLevel}`
  });
}

// After
if (player.level < requiredLevel) {
  throw new BadRequestError(`Requires level ${requiredLevel}`, {
    playerLevel: player.level,
    requiredLevel
  });
}
```

## Error Response Format

All errors now return consistent JSON structure:

```json
{
  "error": {
    "message": "Item not found",
    "statusCode": 404,
    "metadata": {
      "itemId": "abc123"
    },
    "stack": "Error: Item not found\n    at ..."
  }
}
```

**Note**: `metadata` and `stack` only appear in development mode.

## Migration Checklist

When migrating a controller:

1. ✅ Add `asyncHandler` import from `../utils/errors`
2. ✅ Wrap route handlers with `asyncHandler()`
3. ✅ Remove manual try-catch blocks
4. ✅ Replace `res.status(X).json({...})` error responses with `throw new XError()`
5. ✅ Add metadata objects where helpful for debugging
6. ✅ Remove manual `console.error()` calls (middleware handles logging)
7. ✅ Test endpoints to verify error responses
8. ✅ Build backend to ensure TypeScript compilation succeeds

## Benefits

- **Less boilerplate**: No try-catch in every route
- **Consistent responses**: All errors formatted the same way
- **Better debugging**: Automatic logging with request context
- **Type safety**: Compile-time checks for error classes
- **Cleaner code**: Focus on business logic, not error handling
- **Easier testing**: Mock error classes instead of response objects

## Example Full Controller Migration

### Before: inventoryController.js

```typescript
export const getInventory = async (req: Request, res: Response) => {
  try {
    const player = await Player.findById(req.user._id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    res.json({
      success: true,
      data: player.inventory
    });
  } catch (error: any) {
    console.error('Error getting inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory',
      error: error.message
    });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const player = await Player.findById(req.user._id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }

    const { itemId, quantity } = req.body;

    if (!itemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and quantity required'
      });
    }

    const itemDef = itemService.getItemDefinition(itemId);

    if (!itemDef) {
      return res.status(404).json({
        success: false,
        message: 'Item definition not found'
      });
    }

    // ... rest of logic

    await player.save();

    res.json({
      success: true,
      data: { item, inventory: player.inventory }
    });
  } catch (error: any) {
    console.error('Error adding item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
};
```

### After: inventoryController.ts (Migrated)

```typescript
import { asyncHandler, NotFoundError, BadRequestError } from '../utils/errors';
import playerInventoryService from '../services/playerInventoryService';

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const player = await Player.findById(req.user._id);

  if (!player) {
    throw new NotFoundError('Player not found', { userId: req.user._id });
  }

  res.json({
    success: true,
    data: player.inventory
  });
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const player = await Player.findById(req.user._id);

  if (!player) {
    throw new NotFoundError('Player not found', { userId: req.user._id });
  }

  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) {
    throw new BadRequestError('Item ID and quantity required', {
      received: { itemId, quantity }
    });
  }

  const itemDef = itemService.getItemDefinition(itemId);

  if (!itemDef) {
    throw new NotFoundError('Item definition not found', { itemId });
  }

  // ... rest of logic (no try-catch needed!)

  await player.save();

  res.json({
    success: true,
    data: { item, inventory: player.inventory }
  });
});
```

## Comparison Summary

| Aspect | Before | After |
|--------|--------|-------|
| Lines of code | ~60 lines | ~35 lines (42% reduction) |
| Try-catch blocks | 2 | 0 |
| Error responses | 8 manual responses | 4 thrown errors |
| Error logging | 2 console.error | 0 (automatic) |
| Response format | Inconsistent | Consistent |
| Type safety | No | Yes |
| Metadata support | No | Yes |

---

**Migration Status**: Error handling system is now active. Controllers can be migrated gradually - old and new patterns work together.

**Next Steps**: Optionally migrate existing controllers to use new error classes for consistency and reduced boilerplate.
