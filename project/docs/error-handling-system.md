# Error Handling System

## Overview

The ClearSkies backend includes a comprehensive error handling system designed to catch JSON serialization issues (particularly circular references from Mongoose schemas) early in development.

## Components

### 1. Response Validator Middleware (`be/middleware/responseValidator.js`)

**Purpose**: Automatically validates all API responses can be serialized to JSON before sending to clients.

**Activation**: Only runs in development mode (`NODE_ENV=development` or `NODE_ENV=dev`)

**How it works**:
- Intercepts all `res.json()` calls
- Tests serialization before sending response
- If circular reference detected, returns 500 error with detailed diagnostics
- Logs full analysis to console for debugging

**Usage**: Already integrated in `be/index.js` - no manual setup needed.

### 2. JSON Safe Utility (`be/utils/jsonSafe.js`)

**Purpose**: Provides utilities for safe JSON operations with Mongoose objects.

#### Functions

**`jsonSafe(obj, label)`**
```javascript
const { jsonSafe } = require('../utils/jsonSafe');

// Validate object can be serialized
const data = { ... };
jsonSafe(data, 'myEndpoint response'); // Throws with detailed analysis if circular refs found
```

**`sanitize(obj)`**
```javascript
const { sanitize } = require('../utils/jsonSafe');

// Deep clone and remove Mongoose references
const cleanData = sanitize(playerData);
res.json(cleanData);
```

**`safeStringify(obj, space)`**
```javascript
const { safeStringify } = require('../utils/jsonSafe');

// Stringify with automatic Mongoose Map handling
const json = safeStringify(data, 2); // 2 spaces indentation
```

**`mongooseReplacer(key, value)`**
```javascript
// Use as JSON.stringify replacer
JSON.stringify(data, mongooseReplacer);
```

## Common Issues & Solutions

### Circular Reference in Mongoose Maps

**Problem**: Mongoose Maps (like `qualities` and `traits` in inventory items) have circular schema references.

**Solution**: Convert to plain objects before stringifying:
```javascript
// Bad
const str = JSON.stringify(item.qualities);

// Good
const str = JSON.stringify(item.qualities.toObject());

// Or use the utility
const str = safeStringify(item);
```

### Item Instances After `player.addItem()`

**Problem**: After adding an item to player inventory, the item instance becomes a Mongoose document with circular refs.

**Solution**: Extract needed values BEFORE adding to inventory:
```javascript
// Bad
const item = itemService.createItemInstance(...);
await player.addItem(item);
itemsAdded.push({ instanceId: item.instanceId }); // Circular ref!

// Good
const item = itemService.createItemInstance(...);
const instanceId = item.instanceId; // Extract value first
await player.addItem(item);
itemsAdded.push({ instanceId }); // Uses plain string
```

### Returning Player/User Documents Directly

**Problem**: Mongoose documents contain circular references in their schema.

**Solution**: Either use `.lean()` or extract specific fields:
```javascript
// Bad
res.json({ player });

// Good - lean query
const player = await Player.findOne(...).lean();
res.json({ player });

// Good - specific fields
res.json({
  playerId: player._id,
  name: player.characterName,
  level: player.level
});
```

## Error Analysis Example

When a circular reference is detected, you'll see detailed console output:

```
========================================
[JSON Error] Circular reference detected in: POST /api/locations/activities/complete
========================================
Object keys: message, rewards, activityRestarted, newActivity

Testing each property for circular references:
  ✓ message: OK
  ✓ rewards: OK
  ✓ activityRestarted: OK
  ✗ newActivity: CIRCULAR REFERENCE DETECTED
    Type: Object
    Keys: activityId, name, description, type, duration...
========================================
```

This tells you exactly which property has the issue.

## Best Practices

1. **Always use the Edit tool first** when modifying files (see CLAUDE.md)
2. **Test in development mode** to catch issues early via response validator
3. **Use `.lean()` queries** when you don't need Mongoose methods
4. **Convert Maps early** using `.toObject()` when working with qualities/traits
5. **Extract values before Mongoose operations** that modify objects (like `addItem`)
6. **Use `sanitize()` utility** when in doubt about response data

## When to Use Each Utility

| Scenario | Utility |
|----------|---------|
| Validating before sending response | `jsonSafe(data, 'endpoint')` |
| Deep cloning Mongoose data | `sanitize(data)` |
| Manual stringification | `safeStringify(data)` |
| Custom JSON.stringify | `mongooseReplacer` |
| Testing serialization | Response validator (automatic) |

## Future Improvements

Consider implementing:
- Response DTOs (Data Transfer Objects) for critical endpoints
- TypeScript for compile-time type safety
- Unit tests for serialization validation
- Production-safe error responses (don't leak schema info)
