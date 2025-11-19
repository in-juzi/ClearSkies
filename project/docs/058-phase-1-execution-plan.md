# Phase 1: Critical Fixes - Detailed Execution Plan

## Document Overview
**Phase**: 1 of 4
**Status**: Ready for Implementation
**Estimated Effort**: 10-12 hours
**Priority**: Critical
**Goal**: Fix memory leaks, remove dead code, resolve circular dependencies

---

## Overview

Phase 1 addresses the most critical issues identified in the backend refactoring audit:
1. Memory leaks from uncleaned socket timers
2. Dead code bloat (deprecated endpoints)
3. Duplicated reward calculation logic
4. Circular dependencies preventing clean architecture
5. Business logic in controllers instead of services

**Success Criteria:**
- ✅ Zero memory leaks after 100+ connect/disconnect cycles
- ✅ ~400 lines of dead code removed
- ✅ Reward calculation centralized to single location
- ✅ No circular dependency warnings
- ✅ Equipment stats calculation in proper service layer

---

## Task Breakdown

### Task 1.1: Remove Deprecated Inventory Endpoints
**Estimated Time**: 2 hours
**Priority**: High
**Risk**: Low (frontend already migrated)

#### Step 1: Verify Frontend Doesn't Use Endpoints (15 min)
```bash
# Search for deprecated endpoint usage in frontend
cd ui/src
grep -r "api/inventory/item-definitions" .
grep -r "api/inventory/item-definition/" .
grep -r "ItemDataService" . | wc -l  # Should show usage count
```

**Expected Result**: No matches for old endpoints, multiple matches for ItemDataService

#### Step 2: Remove Deprecated Endpoints from Controller (30 min)
**File**: `be/controllers/inventoryController.ts`

**Remove Lines 598-616** - `getItemDefinitions()`:
```typescript
// DELETE THIS ENTIRE BLOCK:
/**
 * @route GET /api/inventory/item-definitions
 * @deprecated Frontend now uses ItemDataService
 */
router.get('/item-definitions', async (req, res) => {
  try {
    const definitions = itemService.getAllItemDefinitions();
    res.json(definitions);
  } catch (error) {
    console.error('Error fetching item definitions:', error);
    res.status(500).json({ message: 'Failed to fetch item definitions' });
  }
});
```

**Remove Lines 623-638** - `getItemDefinition()`:
```typescript
// DELETE THIS ENTIRE BLOCK:
/**
 * @route GET /api/inventory/item-definition/:itemId
 * @deprecated Frontend now uses ItemDataService
 */
router.get('/item-definition/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const definition = itemService.getItemDefinition(itemId);

    if (!definition) {
      return res.status(404).json({ message: 'Item definition not found' });
    }

    res.json(definition);
  } catch (error) {
    console.error('Error fetching item definition:', error);
    res.status(500).json({ message: 'Failed to fetch item definition' });
  }
});
```

#### Step 3: Remove Deprecated Response Fields (15 min)
**File**: `be/controllers/inventoryController.ts`

**Line 238** - Remove `inventoryCapacity` field:
```typescript
// BEFORE:
return res.json({
  inventory: plainInventory,
  equipment: plainEquipment,
  inventoryCapacity: player.carryingCapacity, // DEPRECATED
  carryingCapacity: player.carryingCapacity,
  currentWeight: player.currentWeight,
  equipmentStats
});

// AFTER:
return res.json({
  inventory: plainInventory,
  equipment: plainEquipment,
  carryingCapacity: player.carryingCapacity,
  currentWeight: player.currentWeight,
  equipmentStats
});
```

**Line 241** - Remove `size` field:
```typescript
// BEFORE:
return res.json({
  inventory: plainInventory,
  equipment: plainEquipment,
  size: inventory.length, // DEPRECATED
  carryingCapacity: player.carryingCapacity,
  currentWeight: player.currentWeight,
  equipmentStats
});

// AFTER:
return res.json({
  inventory: plainInventory,
  equipment: plainEquipment,
  carryingCapacity: player.carryingCapacity,
  currentWeight: player.currentWeight,
  equipmentStats
});
```

#### Step 4: Update Route Registrations (15 min)
**File**: `be/routes/inventory.js`

Remove route registrations if they exist:
```javascript
// Search for and remove:
router.get('/item-definitions', inventoryController.getItemDefinitions);
router.get('/item-definition/:itemId', inventoryController.getItemDefinition);
```

#### Step 5: Test Changes (30 min)
```bash
# Start backend
cd be && npm run dev

# Test in browser or Postman:
# 1. Login and get JWT token
# 2. GET /api/inventory - Should work, verify response structure
# 3. GET /api/inventory/item-definitions - Should 404
# 4. Check frontend still loads inventory correctly

# Check frontend loads
cd ui && npm run dev
# Login, check inventory displays correctly
```

**Verification Checklist:**
- [ ] Backend starts without errors
- [ ] GET /api/inventory returns correct structure
- [ ] Deprecated endpoints return 404
- [ ] Frontend inventory component loads
- [ ] Frontend equipment component loads
- [ ] No console errors in browser

---

### Task 1.2: Fix Socket Memory Leaks
**Estimated Time**: 2 hours
**Priority**: Critical
**Risk**: Medium (requires careful testing)

#### Step 1: Add Disconnect Handler to activityHandler.ts (30 min)
**File**: `be/sockets/activityHandler.ts`

**Add global timers map at top** (if not exists):
```typescript
// Near line 5-10, after imports
const activityTimers = new Map<string, NodeJS.Timeout>();
```

**Add disconnect handler** (add after all event handlers, around line 300):
```typescript
/**
 * Clean up activity timer on socket disconnect
 */
socket.on('disconnect', () => {
  try {
    const userId = (socket as any).userId;
    if (!userId) return;

    // Clear any active activity timer for this player
    if (activityTimers.has(userId)) {
      const timer = activityTimers.get(userId);
      clearTimeout(timer);
      activityTimers.delete(userId);

      console.log(`[Activity] Cleared timer for disconnected player ${userId}`);
    }
  } catch (error) {
    console.error('[Activity] Error cleaning up on disconnect:', error);
  }
});
```

**Update timer storage** in `scheduleActivityCompletion()`:
```typescript
// Find where timer is created (around line 120-130)
// BEFORE:
const timer = setTimeout(async () => {
  // ... completion logic ...
}, duration);

// AFTER:
const timer = setTimeout(async () => {
  // ... completion logic ...

  // Clean up timer reference after completion
  activityTimers.delete(player._id.toString());
}, duration);

// Store timer in map
activityTimers.set(player._id.toString(), timer);
```

#### Step 2: Add Disconnect Handler to craftingHandler.ts (30 min)
**File**: `be/sockets/craftingHandler.ts`

**Add global timers map**:
```typescript
// Near line 5-10, after imports
const craftingTimers = new Map<string, NodeJS.Timeout>();
```

**Add disconnect handler** (around line 300):
```typescript
/**
 * Clean up crafting timer on socket disconnect
 */
socket.on('disconnect', () => {
  try {
    const userId = (socket as any).userId;
    if (!userId) return;

    // Clear any active crafting timer for this player
    if (craftingTimers.has(userId)) {
      const timer = craftingTimers.get(userId);
      clearTimeout(timer);
      craftingTimers.delete(userId);

      console.log(`[Crafting] Cleared timer for disconnected player ${userId}`);
    }
  } catch (error) {
    console.error('[Crafting] Error cleaning up on disconnect:', error);
  }
});
```

**Update timer storage** in `scheduleCraftingCompletion()`:
```typescript
// Find where timer is created (around line 120-130)
// AFTER creating timer:
craftingTimers.set(player._id.toString(), timer);

// Inside completion callback, before resolving:
craftingTimers.delete(player._id.toString());
```

#### Step 3: Test Memory Leak Fix (45 min)
```bash
# Terminal 1: Start backend with memory monitoring
cd be && node --expose-gc --max-old-space-size=512 index.ts

# Terminal 2: Memory test script
cd be && node utils/test-memory-leaks.js
```

**Create test script** `be/utils/test-memory-leaks.js`:
```javascript
const io = require('socket.io-client');

async function testMemoryLeaks() {
  const baseMemory = process.memoryUsage().heapUsed;
  console.log(`Starting memory: ${(baseMemory / 1024 / 1024).toFixed(2)} MB`);

  for (let i = 0; i < 100; i++) {
    // Connect client
    const socket = io('http://localhost:3000', {
      auth: { token: 'YOUR_JWT_TOKEN_HERE' }
    });

    // Start activity
    socket.emit('activity:start', { activityId: 'kennik-oak-tree-woodcutting' });

    // Wait 1 second then disconnect
    await new Promise(resolve => setTimeout(resolve, 1000));
    socket.disconnect();

    if (i % 10 === 0) {
      global.gc(); // Force garbage collection
      const currentMemory = process.memoryUsage().heapUsed;
      const memoryDiff = ((currentMemory - baseMemory) / 1024 / 1024).toFixed(2);
      console.log(`Cycle ${i}: Memory diff: ${memoryDiff} MB`);
    }
  }

  console.log('Memory leak test complete');
}

testMemoryLeaks();
```

**Success Criteria:**
- Memory increase <10MB after 100 cycles
- Console shows "Cleared timer for disconnected player" messages
- No "MaxListenersExceededWarning" errors

---

### Task 1.3: Centralize Reward Calculation
**Estimated Time**: 4 hours
**Priority**: Critical
**Risk**: High (complex business logic)

#### Step 1: Create Canonical Method in locationService.ts (90 min)
**File**: `be/services/locationService.ts`

**Add new method** (around line 350, after `calculateActivityRewards()`):
```typescript
/**
 * Process complete activity workflow with all rewards
 * This is the single source of truth for activity completion
 *
 * @param player - Player completing the activity
 * @param activity - Activity definition
 * @param location - Location where activity occurred
 * @returns Reward details (XP, loot, quest progress)
 */
async processActivityCompletion(
  player: IPlayer,
  activity: Activity,
  location: Location
): Promise<{
  xpRewards: { skill: any; attribute: any };
  lootItems: any[];
  questProgress: any[];
}> {
  // 1. Calculate scaled XP based on player level
  const skillId = Object.keys(activity.rewards.experience)[0];
  const baseXP = activity.rewards.experience[skillId];
  const playerSkillLevel = player.skills.get(skillId)?.level || 1;
  const scaledXP = this.calculateScaledXP(
    baseXP,
    playerSkillLevel,
    activity.requirements?.skills?.[skillId] || 1
  );

  console.log(`[Location] Activity ${activity.activityId} completion - Base XP: ${baseXP}, Scaled XP: ${scaledXP}`);

  // 2. Award skill XP (automatically awards 50% to linked attribute)
  const xpRewards = await player.addSkillExperience(skillId, scaledXP);
  await player.save();

  console.log(`[Location] Awarded ${scaledXP} XP to ${skillId}, ${xpRewards.attribute.experience} to ${xpRewards.attribute.name}`);

  // 3. Process drop tables to generate loot
  const lootItems = await this.calculateActivityRewards(
    activity.rewards.dropTables || [],
    player
  );

  console.log(`[Location] Generated ${lootItems.length} loot items`);

  // 4. Add items to player inventory
  for (const item of lootItems) {
    await player.addItem(item);
  }
  await player.save();

  // 5. Update quest progress (lazy load to avoid circular dependency)
  const questService = require('./questService');
  const questProgress = await questService.updateQuestProgress(player, 'GATHER', {
    activityId: activity.activityId,
    locationId: location.locationId,
    items: lootItems.map(item => ({
      itemId: item.itemId,
      quantity: item.quantity
    }))
  });

  if (questProgress.length > 0) {
    console.log(`[Location] Updated ${questProgress.length} quest objectives`);
  }

  return {
    xpRewards,
    lootItems,
    questProgress
  };
}
```

#### Step 2: Refactor activityHandler.ts to Use Service (60 min)
**File**: `be/sockets/activityHandler.ts`

**Find `scheduleActivityCompletion()` function** (around line 17-130)

**Replace lines 42-117** (reward calculation logic) with service call:
```typescript
// BEFORE (75 lines of reward logic):
// const skillId = Object.keys(activity.rewards.experience)[0];
// const baseXP = activity.rewards.experience[skillId];
// ... lots of XP calculation ...
// ... lots of item generation ...
// ... lots of quest updates ...

// AFTER (single service call):
const { xpRewards, lootItems, questProgress } =
  await locationService.processActivityCompletion(player, activity, location);

// Convert Maps to plain objects for socket emission
const plainLoot = lootItems.map(item => {
  const plain = item.toObject ? item.toObject() : item;
  if (plain.qualities instanceof Map) {
    plain.qualities = Object.fromEntries(plain.qualities);
  }
  if (plain.traits instanceof Map) {
    plain.traits = Object.fromEntries(plain.traits);
  }
  return plain;
});

// Emit completion event
socket.emit('activity:completed', {
  activity: {
    activityId: activity.activityId,
    name: activity.name
  },
  xpRewards: {
    skill: {
      name: xpRewards.skill.name,
      level: xpRewards.skill.level,
      experience: xpRewards.skill.experience,
      experienceGained: xpRewards.skill.experienceGained
    },
    attribute: {
      name: xpRewards.attribute.name,
      level: xpRewards.attribute.level,
      experience: xpRewards.attribute.experience,
      experienceGained: xpRewards.attribute.experienceGained
    }
  },
  loot: plainLoot,
  questProgress
});

// Broadcast to player's room for multi-client sync
io.to(`player:${player._id}`).emit('player:updated', {
  skills: Object.fromEntries(player.skills),
  attributes: Object.fromEntries(player.attributes),
  inventory: player.inventory.map(/* convert Maps */)
});

console.log(`[Activity] Completed ${activity.activityId} for player ${player._id}`);
```

**Lines saved**: ~75 lines removed from handler

#### Step 3: Remove Reward Logic from locationController.ts (30 min)
**File**: `be/controllers/locationController.ts`

**Find POST /complete endpoint** (around lines 615-636)

**Add deprecation warning**:
```typescript
/**
 * @route POST /api/locations/activities/complete
 * @deprecated Use Socket.io 'activity:completed' event instead
 * @description Legacy HTTP endpoint for backward compatibility
 */
router.post('/activities/complete', authenticateJWT, async (req, res) => {
  console.warn('[Location] DEPRECATED: HTTP activity completion called, use Socket.io instead');

  try {
    // Simplified implementation - just redirect to socket handler logic
    // OR remove entirely if frontend doesn't use HTTP

    return res.status(410).json({
      message: 'HTTP activity completion deprecated. Use Socket.io events.',
      migration: 'Connect via Socket.io and emit "activity:start" event'
    });
  } catch (error) {
    console.error('[Location] Error in deprecated completion endpoint:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
```

**Alternative**: If endpoint is completely unused, remove entire block (lines 615-636)

#### Step 4: Test Reward Calculation (60 min)
```bash
# Start backend
cd be && npm run dev

# Test various activities:
# 1. Gathering (oak logs)
# 2. Mining (copper ore)
# 3. Fishing (cod)
# 4. Combat (goblin slaying)

# Verify for each:
# - XP awarded correctly (skill + attribute)
# - Loot generated from drop tables
# - Items added to inventory
# - Quest progress updated
# - No duplicate rewards
# - Memory stays stable
```

**Verification Script** `be/utils/test-activity-rewards.js`:
```javascript
// Test script to verify rewards are consistent
const mongoose = require('mongoose');
const Player = require('../models/Player');
const locationService = require('../services/locationService');

async function testRewards() {
  await mongoose.connect(process.env.MONGODB_URI);

  const player = await Player.findOne({ userId: 'TEST_USER_ID' });
  const activity = locationService.getActivity('kennik-oak-tree-woodcutting');
  const location = locationService.getLocation('kennik');

  const before = {
    woodcuttingXP: player.skills.get('woodcutting').experience,
    strengthXP: player.attributes.get('strength').experience,
    inventorySize: player.inventory.length
  };

  // Process completion
  const result = await locationService.processActivityCompletion(
    player,
    activity,
    location
  );

  const after = {
    woodcuttingXP: player.skills.get('woodcutting').experience,
    strengthXP: player.attributes.get('strength').experience,
    inventorySize: player.inventory.length
  };

  console.log('XP Gained:', {
    woodcutting: after.woodcuttingXP - before.woodcuttingXP,
    strength: after.strengthXP - before.strengthXP
  });

  console.log('Items Gained:', after.inventorySize - before.inventorySize);
  console.log('Loot:', result.lootItems.map(i => i.itemId));
  console.log('Quest Progress:', result.questProgress);

  await mongoose.disconnect();
}

testRewards();
```

---

### Task 1.4: Fix Circular Dependencies
**Estimated Time**: 2 hours
**Priority**: High
**Risk**: Medium

#### Step 1: Analyze Current Circular Dependency (15 min)
**Files**: `be/services/locationService.ts`, `be/services/combatService.ts`

**Identify the circular require**:
```bash
# Search for require statements
grep -n "require.*combatService" be/services/locationService.ts
grep -n "require.*locationService" be/services/combatService.ts
```

**Expected finding**: locationService.ts line 134 has:
```typescript
const combatService = require('./combatService');
```

#### Step 2: Implement Event Emitter Pattern (60 min)
**Create new file**: `be/services/gameEvents.ts`

```typescript
/**
 * Central event emitter for game system communication
 * Prevents circular dependencies between services
 */
import { EventEmitter } from 'events';
import { IPlayer } from '../models/Player';

// Event type definitions
export interface GameEvents {
  // Activity events
  'activity:completed': (data: {
    player: IPlayer;
    activityId: string;
    xpGained: number;
    loot: any[];
  }) => void;

  // Combat events
  'combat:victory': (data: {
    player: IPlayer;
    monsterId: string;
    xpGained: number;
    loot: any[];
  }) => void;

  'combat:defeat': (data: {
    player: IPlayer;
    monsterId: string;
  }) => void;

  // Crafting events
  'crafting:completed': (data: {
    player: IPlayer;
    recipeId: string;
    outputItem: any;
  }) => void;

  // Quest events
  'quest:objectiveCompleted': (data: {
    player: IPlayer;
    questId: string;
    objectiveId: string;
  }) => void;
}

class GameEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20); // Increase if needed
  }

  // Type-safe emit
  emitGameEvent<K extends keyof GameEvents>(
    event: K,
    data: Parameters<GameEvents[K]>[0]
  ): boolean {
    return this.emit(event, data);
  }

  // Type-safe listener
  onGameEvent<K extends keyof GameEvents>(
    event: K,
    listener: GameEvents[K]
  ): this {
    return this.on(event, listener);
  }
}

export const gameEvents = new GameEventEmitter();
```

#### Step 3: Update locationService.ts to Emit Events (20 min)
**File**: `be/services/locationService.ts`

**Remove circular require** (line 134):
```typescript
// REMOVE THIS:
const combatService = require('./combatService');
```

**Add event emitter import** (top of file):
```typescript
import { gameEvents } from './gameEvents';
```

**Replace combat service call** (around line 134):
```typescript
// BEFORE:
const combatService = require('./combatService');
await combatService.updateCombatStats(player);

// AFTER:
gameEvents.emitGameEvent('activity:completed', {
  player,
  activityId: activity.activityId,
  xpGained: scaledXP,
  loot: lootItems
});
```

#### Step 4: Update combatService.ts to Listen for Events (20 min)
**File**: `be/services/combatService.ts`

**Add event listener** (near top of file, after imports):
```typescript
import { gameEvents } from './gameEvents';

// Listen for activity completions that might affect combat stats
gameEvents.onGameEvent('activity:completed', async ({ player, activityId, xpGained, loot }) => {
  // Update combat-related stats if player is in combat
  if (player.activeCombat) {
    console.log(`[Combat] Activity completed during combat, recalculating stats`);
    // Recalculate stats if needed
    // This is where combat-specific logic would go
  }
});

gameEvents.onGameEvent('crafting:completed', async ({ player, outputItem }) => {
  // Handle equipment crafted during combat (edge case)
  if (player.activeCombat) {
    console.log(`[Combat] Item crafted during combat: ${outputItem.itemId}`);
  }
});
```

#### Step 5: Verify No Circular Dependencies (10 min)
```bash
# Install dependency check tool
npm install -g madge

# Check for circular dependencies
cd be
madge --circular --extensions ts,js services/

# Should show zero circular dependencies
```

#### Step 6: Test Event Flow (15 min)
```bash
# Start backend with verbose logging
cd be && npm run dev

# Complete an activity, check logs for:
# 1. "[Location] Activity completion..."
# 2. Event emission log
# 3. "[Combat] Activity completed during combat..." (if in combat)

# Verify no "circular dependency" warnings
```

---

### Task 1.5: Extract calculateEquipmentStats to Service
**Estimated Time**: 2 hours
**Priority**: High
**Risk**: Medium

#### Step 1: Create New EquipmentService (45 min)
**Create file**: `be/services/equipmentService.ts`

```typescript
/**
 * Equipment Service
 * Handles equipment stat calculations and equipment-related operations
 */
import { IPlayer } from '../models/Player';
import itemService from './itemService';
import { EquipmentItem, WeaponItem, ArmorItem, isWeaponItem, isArmorItem } from '@shared/types';

export interface EquipmentStats {
  // Weapon stats
  totalDamage: number;
  weaponSpeed: number | null;
  damageType: string | null;
  damageRoll: string | null;
  attackRange: number | null;

  // Armor stats
  totalArmor: number;
  totalEvasion: number;

  // Tool stats
  woodcuttingPower: number;
  miningPower: number;
  fishingPower: number;
  gatheringPower: number;

  // Item counts
  totalItems: number;
  weaponCount: number;
  armorCount: number;
  toolCount: number;
}

class EquipmentService {
  /**
   * Calculate total equipment stats from all equipped items
   * @param player - Player with equipped items
   * @returns Aggregated equipment stats
   */
  calculateEquipmentStats(player: IPlayer): EquipmentStats {
    const stats: EquipmentStats = {
      totalDamage: 0,
      weaponSpeed: null,
      damageType: null,
      damageRoll: null,
      attackRange: null,
      totalArmor: 0,
      totalEvasion: 0,
      woodcuttingPower: 0,
      miningPower: 0,
      fishingPower: 0,
      gatheringPower: 0,
      totalItems: 0,
      weaponCount: 0,
      armorCount: 0,
      toolCount: 0
    };

    // Get equipped items
    const equippedItems = this.getEquippedItemsWithDefinitions(player);
    stats.totalItems = equippedItems.length;

    for (const { instance, definition } of equippedItems) {
      if (!definition) continue;

      // Weapon stats
      if (isWeaponItem(definition)) {
        stats.weaponCount++;
        stats.totalDamage += definition.properties.damageBonus || 0;

        // Store weapon speed (use mainHand weapon)
        if (instance.equipped && player.equipmentSlots.get('mainHand') === instance.instanceId) {
          stats.weaponSpeed = definition.properties.weaponSpeed || null;
          stats.damageType = definition.properties.damageType || null;
          stats.damageRoll = definition.properties.damageRoll || null;
          stats.attackRange = definition.properties.attackRange || null;
        }
      }

      // Armor stats
      if (isArmorItem(definition)) {
        stats.armorCount++;
        stats.totalArmor += definition.properties.armor || 0;
        stats.totalEvasion += definition.properties.evasion || 0;
      }

      // Tool stats
      if (definition.category === 'equipment' && definition.subcategories.includes('tool')) {
        stats.toolCount++;

        if (definition.subcategories.includes('woodcutting-axe')) {
          stats.woodcuttingPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('pickaxe')) {
          stats.miningPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('fishing-rod')) {
          stats.fishingPower += definition.properties.toolPower || 0;
        }
        if (definition.subcategories.includes('gathering-tool')) {
          stats.gatheringPower += definition.properties.toolPower || 0;
        }
      }
    }

    return stats;
  }

  /**
   * Get all equipped items with their definitions
   * @param player - Player instance
   * @returns Array of equipped items with definitions
   */
  getEquippedItemsWithDefinitions(player: IPlayer): Array<{
    slot: string;
    instance: any;
    definition: EquipmentItem | null;
  }> {
    const equippedItems: Array<{ slot: string; instance: any; definition: EquipmentItem | null }> = [];

    for (const [slot, instanceId] of player.equipmentSlots.entries()) {
      if (!instanceId) continue;

      const instance = player.inventory.find(item => item.instanceId === instanceId);
      if (!instance) continue;

      const definition = itemService.getItemDefinition(instance.itemId) as EquipmentItem;
      equippedItems.push({ slot, instance, definition });
    }

    return equippedItems;
  }

  /**
   * Get equipped items by slot
   * @param player - Player instance
   * @param slot - Equipment slot name
   * @returns Equipped item or null
   */
  getEquippedItemInSlot(player: IPlayer, slot: string): { instance: any; definition: EquipmentItem | null } | null {
    const instanceId = player.equipmentSlots.get(slot);
    if (!instanceId) return null;

    const instance = player.inventory.find(item => item.instanceId === instanceId);
    if (!instance) return null;

    const definition = itemService.getItemDefinition(instance.itemId) as EquipmentItem;
    return { instance, definition };
  }
}

export default new EquipmentService();
```

#### Step 2: Update inventoryController.ts to Use Service (30 min)
**File**: `be/controllers/inventoryController.ts`

**Add import** (top of file):
```typescript
import equipmentService from '../services/equipmentService';
```

**Replace lines 63-203** with service call:
```typescript
// BEFORE (140 lines of calculation logic):
const equipmentStats = {
  totalDamage: 0,
  // ... lots of stat initialization ...
};

for (const [slot, instanceId] of player.equipmentSlots.entries()) {
  // ... lots of stat calculation ...
}

// AFTER (1 line):
const equipmentStats = equipmentService.calculateEquipmentStats(player);
```

**Lines saved**: ~140 lines removed from controller

#### Step 3: Update Other Consumers (30 min)
**File**: `be/services/combatService.ts`

**Find equipment stat calculation** (if any) and replace with service call:
```typescript
import equipmentService from './equipmentService';

// Wherever equipment stats are calculated:
const equipmentStats = equipmentService.calculateEquipmentStats(player);
const totalArmor = equipmentStats.totalArmor;
const totalDamage = equipmentStats.totalDamage;
```

#### Step 4: Test Equipment Stats (15 min)
```bash
# Start backend
cd be && npm run dev

# Test scenarios:
# 1. GET /api/inventory - verify equipmentStats in response
# 2. Equip weapon - verify totalDamage increases
# 3. Equip armor - verify totalArmor increases
# 4. Unequip items - verify stats decrease
# 5. Check combat damage calculations use correct stats
```

---

## Testing Checklist

### Comprehensive Phase 1 Testing (2 hours)

#### Pre-Testing Setup:
```bash
# 1. Backup database
mongodump --db clearskies --out backups/phase1-pre-test

# 2. Start backend with logging
cd be && npm run dev

# 3. Start frontend
cd ui && npm run dev

# 4. Open browser console (F12)
```

#### Test Suite:

**1. Dead Code Removal** (15 min)
- [ ] GET /api/inventory/item-definitions returns 404
- [ ] GET /api/inventory/item-definition/oak_log returns 404
- [ ] GET /api/inventory returns correct structure (no inventoryCapacity, no size)
- [ ] Frontend inventory loads without errors
- [ ] Frontend equipment panel loads without errors

**2. Memory Leak Fix** (30 min)
- [ ] Connect, start activity, disconnect - check server logs for cleanup
- [ ] Repeat 20 times, check memory usage (should stay stable)
- [ ] Connect, start crafting, disconnect - check cleanup
- [ ] Start activity, let complete normally - no warnings
- [ ] Check `activityTimers` and `craftingTimers` maps stay small

**3. Centralized Rewards** (45 min)
- [ ] Complete oak tree woodcutting - verify XP and loot
- [ ] Complete copper mining - verify XP and loot
- [ ] Complete fishing - verify XP and loot
- [ ] Complete combat - verify XP and loot
- [ ] Check quest progress updates correctly
- [ ] Verify no duplicate rewards
- [ ] Check all rewards shown in frontend UI
- [ ] Verify skill XP + attribute XP correct ratio (50%)

**4. Circular Dependencies** (15 min)
- [ ] Run `madge --circular services/` - should show 0 circular deps
- [ ] Backend starts without warnings
- [ ] Complete activity - verify event emitted and received
- [ ] Check logs show event flow correctly

**5. Equipment Stats Service** (15 min)
- [ ] GET /api/inventory shows correct equipmentStats
- [ ] Equip bronze helmet - totalArmor increases
- [ ] Equip iron sword - totalDamage increases
- [ ] Unequip sword - totalDamage decreases
- [ ] Equip woodcutting axe - woodcuttingPower shows in stats
- [ ] Combat uses correct equipment stats for damage

---

## Deployment Plan

### Pre-Deployment:
1. ✅ All tests pass
2. ✅ Code review complete
3. ✅ Database backup created
4. ✅ Rollback plan documented

### Deployment Steps:
```bash
# 1. On EC2 server
cd ClearSkies
git pull origin main

# 2. Install dependencies (if needed)
cd be && npm install

# 3. Build backend
npm run build

# 4. Run migrations (if any)
npm run migrate

# 5. Restart backend with PM2
pm2 restart clearskies-backend

# 6. Monitor logs
pm2 logs clearskies-backend --lines 100

# 7. Check for errors
# Wait 2-3 minutes, verify no crashes

# 8. Test production
# Open https://clearskies.juzi.dev
# Login, test inventory, activities, crafting
```

### Post-Deployment Monitoring:
- Monitor error logs for 24 hours
- Check memory usage hourly for first 6 hours
- Verify no user complaints
- Track performance metrics

### Rollback Plan (if needed):
```bash
# 1. Revert git commit
git revert HEAD
git push origin main

# 2. Restore database backup
mongorestore --db clearskies backups/phase1-pre-test/clearskies

# 3. Rebuild and restart
npm run build
pm2 restart clearskies-backend
```

---

## Success Criteria

Phase 1 is complete when:
- ✅ All deprecated endpoints removed (~400 lines)
- ✅ Memory stays stable after 100+ socket disconnections
- ✅ Reward calculation in single location (locationService)
- ✅ Zero circular dependency warnings
- ✅ Equipment stats calculated in service layer
- ✅ All tests pass
- ✅ Production deployment successful
- ✅ No regressions reported

---

## Documentation Updates

After completing Phase 1, update:

1. **CLAUDE.md**:
   - Update "Critical Code Locations" section
   - Add equipmentService.ts reference
   - Update locationService.ts documentation
   - Note deprecated endpoints removed

2. **Create completion document**: `project/docs/059-phase-1-completion-report.md`
   - Lines of code removed
   - Performance improvements measured
   - Issues encountered and solutions
   - Lessons learned

3. **Update master plan**: Mark Phase 1 as complete in `057-backend-refactoring-master-plan.md`

---

## Next Steps After Phase 1

1. Review Phase 1 completion report
2. Measure performance improvements
3. Gather feedback from testing
4. Create Phase 2 detailed execution plan
5. Begin Phase 2 implementation (estimated 2-3 weeks after Phase 1)

---

**Document Status**: ✅ Complete - Ready for Implementation
**Estimated Start Date**: TBD
**Estimated Completion Date**: TBD (10-12 hours after start)
