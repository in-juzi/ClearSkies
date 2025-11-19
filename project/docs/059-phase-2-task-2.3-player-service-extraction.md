# Phase 2 Task 2.3: Extract Player Model Methods - Implementation Guide

## Status: Services Created, Migration Pending

### Summary

Three specialized services have been created to extract player-related business logic from the Player model:
- **PlayerInventoryService** - Inventory and equipment operations
- **PlayerCombatService** - Combat-related operations
- **PlayerStorageService** - Storage container operations

These services are ready to use but require a dedicated migration session to update all 31+ call sites across the codebase.

## Created Services

### 1. PlayerInventoryService (be/services/playerInventoryService.ts)

**Methods**:
- `addItem(player, itemInstance)` - Add item with stacking and weight validation
- `removeItem(player, instanceId, quantity)` - Remove items from inventory
- `getItem(player, instanceId)` - Get single item
- `getItemsByItemId(player, itemId)` - Get all items matching itemId
- `getInventorySize(player)` - Total inventory size
- `getInventoryValue(player)` - Total value of all items
- `hasInventoryItem(player, itemId, minQuantity)` - Check item availability
- `getInventoryItemQuantity(player, itemId)` - Get total quantity
- `equipItem(player, instanceId, slotName)` - Equip item to slot
- `unequipItem(player, slotName)` - Unequip item from slot
- `getEquippedItems(player)` - Get all equipped items
- `hasEquippedSubtype(player, subtype)` - Check equipped item type
- `isSlotAvailable(player, slotName)` - Check slot availability
- `addEquipmentSlot(player, slotName)` - Add new equipment slot

**Key Features**:
- Weight-based carrying capacity validation
- Stacking logic using `itemService.canStack()`
- Equipment slot management
- Maintains all existing business logic from Player model

### 2. PlayerCombatService (be/services/playerCombatService.ts)

**Methods**:
- `takeDamage(player, amount)` - Apply damage, returns true if player died
- `heal(player, amount)` - Heal player up to maxHP
- `useMana(player, amount)` - Consume mana
- `restoreMana(player, amount)` - Restore mana up to maxMP
- `useConsumableItem(player, itemInstance, itemDefinition)` - Use potion/food
- `isInCombat(player)` - Check combat state
- `addCombatLog(player, message, type, damageValue, target)` - Add combat log entry
- `clearCombat(player)` - Clear combat state
- `isAbilityOnCooldown(player, abilityId)` - Check ability cooldown
- `setAbilityCooldown(player, abilityId, cooldownTurns)` - Set cooldown
- `getAbilityCooldownRemaining(player, abilityId)` - Get remaining cooldown
- `getActiveCombatSkill(player)` - Determine active combat skill from equipment

**Key Features**:
- HP/MP bounds checking (0 to max)
- Combat log management (max 50 entries)
- Ability cooldown tracking
- Consumable item effects (health/mana/buffs)
- Combat skill determination based on equipped weapon

### 3. PlayerStorageService (be/services/playerStorageService.ts)

**Methods**:
- `getContainer(player, containerId)` - Get container by ID
- `getContainerItems(player, containerId)` - Get all items in container
- `depositToContainer(player, containerId, instanceId, quantity)` - Deposit with stacking
- `withdrawFromContainer(player, containerId, instanceId, quantity)` - Withdraw with weight check
- `getContainerStats(player, containerId)` - Get capacity/used/available
- `createContainer(player, containerId, containerType, name, capacity)` - Create new container
- `getAllContainers(player)` - Get all containers
- `getContainersByType(player, containerType)` - Filter by type

**Key Features**:
- Stacking logic for container items
- Weight capacity validation on withdrawal
- Cannot deposit equipped items
- Supports multiple container types (bank, housing, guild)

## Migration Plan

### Step 1: Update Service Layer (8 files)
Replace direct `player.methodName()` calls with service calls in:
- be/services/combatService.ts (takeDamage, heal, useMana, addCombatLog)
- be/services/recipeService.ts (addItem, removeItem)
- be/services/locationService.ts (addItem)
- be/services/questService.ts (addItem)
- be/services/storageService.ts (getContainer, depositToContainer, withdrawFromContainer)
- be/services/vendorService.ts (addItem, removeItem)
- be/services/propertyService.ts (if any player method calls)
- be/services/constructionService.ts (if any player method calls)

**Pattern**:
```typescript
// Before:
player.addItem(itemInstance);

// After:
import playerInventoryService from './playerInventoryService';
playerInventoryService.addItem(player, itemInstance);
```

### Step 2: Update Socket Handlers (5 files)
- be/sockets/activityHandler.ts (addItem calls)
- be/sockets/craftingHandler.ts (addItem, removeItem calls)
- be/sockets/combatHandler.ts (takeDamage, heal, useMana, useConsumableItem)
- be/sockets/storageHandler.ts (depositToContainer, withdrawFromContainer)
- be/sockets/constructionHandler.ts (if any player method calls)

### Step 3: Update Controllers (5 files)
- be/controllers/inventoryController.ts (equipItem, unequipItem, addItem, removeItem)
- be/controllers/combatController.ts (if any direct player method calls)
- be/controllers/storageController.ts (getContainer, depositToContainer, withdrawFromContainer)
- be/controllers/locationController.ts (if any direct player method calls)
- be/controllers/housingController.ts (if any player method calls)

### Step 4: Update Player Model (Delegation Layer)
Once all external call sites are migrated, update Player.ts to delegate to services:

```typescript
// At top of file, after schema definition (before methods)
import playerInventoryService from '../services/playerInventoryService';
import playerCombatService from '../services/playerCombatService';
import playerStorageService from '../services/playerStorageService';

// Update methods to delegate (backward compatibility)
playerSchema.methods.addItem = function(this: IPlayer, itemInstance: any): any {
  return playerInventoryService.addItem(this, itemInstance);
};

playerSchema.methods.removeItem = function(
  this: IPlayer,
  instanceId: string,
  quantity?: number | null
): InventoryItem {
  return playerInventoryService.removeItem(this, instanceId, quantity);
};

// ... repeat for all methods
```

### Step 5: TypeScript Build Verification
After each step:
```bash
cd be && npm run build
```

Verify no compilation errors.

### Step 6: Testing (Future Session)
- Manual testing of inventory operations
- Manual testing of combat mechanics
- Manual testing of storage system
- Verify backward compatibility maintained

## Benefits After Migration

1. **Single Responsibility** - Player model becomes data schema only, services handle business logic
2. **Easier Testing** - Services can be unit tested without Mongoose mocks
3. **Better Organization** - Related operations grouped by domain (inventory, combat, storage)
4. **Reduced Coupling** - Services can evolve independently
5. **Clearer Dependencies** - Explicit service imports instead of hidden model methods

## Estimated Effort

- **Step 1-3** (Update call sites): 2-3 hours
- **Step 4** (Delegate in model): 1 hour
- **Step 5** (Build verification): 15 minutes
- **Total**: ~4 hours (matches original estimate)

## Notes

- This is a **non-breaking** refactor - services maintain exact same behavior
- Migration can be done gradually (file by file)
- Player model methods remain for backward compatibility during migration
- Services use same error messages and validation logic
- Weight checks and stacking logic preserved exactly

## Next Steps

When ready to complete this task:
1. Start with Step 1 (service layer - easiest to test)
2. Move to Step 2 (socket handlers - real-time operations)
3. Then Step 3 (controllers - HTTP endpoints)
4. Finally Step 4 (delegate in model for backward compat)
5. Run full build and manual testing

This task should be done in a dedicated session with full focus on migration and testing.
