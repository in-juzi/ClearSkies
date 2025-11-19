# Backend Refactoring Master Plan

## Document Overview
**Created**: 2025-01-18
**Status**: Planning Phase
**Estimated Total Effort**: 40-60 hours across 4 phases
**Expected Impact**: 20-40% performance improvement, significantly improved maintainability

---

## Executive Summary

Comprehensive analysis of the ClearSkies backend identified **73 improvement opportunities** across 11 controllers, 11 services, 7 socket handlers, and 5 models. This master plan organizes these improvements into 4 phased releases to minimize risk while maximizing value delivery.

**Key Metrics:**
- **Lines to Remove**: ~400 (deprecated endpoints, duplicate code)
- **Lines to Refactor**: ~1,500 (consolidations, extractions)
- **Performance Improvement**: 20-40% (caching, batching, indexing)
- **Maintainability**: Significantly improved (reduced complexity, better separation of concerns)

---

## Phase 1: Critical Fixes (Priority 1)
**Estimated Effort**: 10-12 hours
**Goal**: Fix memory leaks, remove dead code, resolve circular dependencies

### 1.1 Remove Deprecated Endpoints (~2 hours)
**Files**: `be/controllers/inventoryController.ts`

#### Dead Code Removal:
- **Lines 598-616**: Remove `getItemDefinitions()` endpoint
- **Lines 623-638**: Remove `getItemDefinition()` endpoint
- **Lines 238, 241**: Remove deprecated response fields (`inventoryCapacity`, `size`)
- **Route cleanup**: Remove registrations in `be/routes/inventory.js`

#### Verification Required:
- ✅ Search frontend for usage: `api/inventory/item-definitions`
- ✅ Search frontend for usage: `api/inventory/item-definition/`
- ✅ Confirm ItemDataService is used instead

#### Migration:
- Create migration to remove deprecated fields from existing player documents

---

### 1.2 Fix Socket Memory Leaks (~2 hours)
**Files**: `be/sockets/activityHandler.ts`, `be/sockets/craftingHandler.ts`

#### Issue:
Global timer maps never cleanup on socket disconnection, causing memory leaks for long-running server processes.

#### Implementation:
```typescript
// Add disconnect handler to both files
socket.on('disconnect', () => {
  // Clear activity timer
  const playerId = (socket as any).userId;
  if (activityTimers.has(playerId)) {
    clearTimeout(activityTimers.get(playerId));
    activityTimers.delete(playerId);
  }

  // Clear crafting timer
  if (craftingTimers.has(playerId)) {
    clearTimeout(craftingTimers.get(playerId));
    craftingTimers.delete(playerId);
  }
});
```

#### Testing:
- Connect client, start activity, disconnect
- Verify timer cleared and map entry removed
- Monitor memory usage over multiple connect/disconnect cycles

---

### 1.3 Centralize Reward Calculation (~4 hours)
**Files**: `be/services/locationService.ts`, `be/sockets/activityHandler.ts`, `be/sockets/craftingHandler.ts`, `be/controllers/locationController.ts`

#### Issue:
Critical business logic duplicated in 4 places:
- `activityHandler.ts` lines 42-117 (75 lines)
- `craftingHandler.ts` lines 42-85 (43 lines)
- `locationController.ts` lines 615-636 (21 lines)
- `combatHandler.ts` (reward logic scattered)

#### Implementation:
Create canonical reward processing in `locationService.ts`:

```typescript
/**
 * Process activity completion with all rewards
 * @returns {Object} { xpRewards, lootItems, questProgress }
 */
async processActivityCompletion(
  player: IPlayer,
  activity: Activity,
  location: Location
): Promise<{
  xpRewards: { skill: any, attribute: any },
  lootItems: any[],
  questProgress: any[]
}> {
  // 1. Calculate scaled XP
  const scaledXP = this.calculateScaledXP(activity, player);

  // 2. Award skill XP (returns { skill, attribute })
  const xpRewards = await player.addSkillExperience(
    activity.rewards.experience.skillId,
    scaledXP
  );

  // 3. Process drop tables
  const lootItems = await this.calculateActivityRewards(
    activity.rewards.dropTables,
    player
  );

  // 4. Add items to inventory
  for (const item of lootItems) {
    await player.addItem(item);
  }

  // 5. Update quest progress
  const questService = require('./questService');
  const questProgress = await questService.updateQuestProgress(
    player,
    'GATHER',
    { activityId: activity.activityId, items: lootItems }
  );

  return { xpRewards, lootItems, questProgress };
}
```

#### Refactor Socket Handlers:
Replace 75+ lines in each handler with single service call:

```typescript
// activityHandler.ts
const { xpRewards, lootItems, questProgress } =
  await locationService.processActivityCompletion(player, activity, location);

socket.emit('activity:completed', {
  xpRewards,
  loot: lootItems.map(/* convert Maps */),
  questProgress
});
```

#### Remove from Controllers:
- Delete reward logic from `locationController.ts` lines 615-636
- Controllers should redirect to socket handlers for activity completion

---

### 1.4 Fix Circular Dependencies (~2 hours)
**Files**: `be/services/locationService.ts`, `be/services/combatService.ts`

#### Issue:
`locationService` line 134 uses `require('./combatService')` inside method, creating tight coupling.

#### Solution Options:

**Option A: Event Emitter Pattern (Recommended)**
```typescript
// In locationService.ts
import EventEmitter from 'events';
export const locationEvents = new EventEmitter();

// Instead of calling combatService directly:
locationEvents.emit('combat:activityCompleted', { player, activity, rewards });

// In combatService.ts
import { locationEvents } from './locationService';

locationEvents.on('combat:activityCompleted', async ({ player, activity, rewards }) => {
  // Handle combat-related updates
});
```

**Option B: Dependency Injection**
```typescript
// Pass combatService as parameter where needed
async function processCompletion(player, activity, combatService) {
  if (combatService && needsCombatUpdate) {
    await combatService.updateCombatStats(player);
  }
}
```

**Option C: Extract Shared Logic**
```typescript
// Create new service: be/services/playerStatsService.ts
// Both locationService and combatService depend on playerStatsService
// Eliminates circular dependency by centralizing shared logic
```

#### Recommendation:
Use **Option A (Event Emitter)** for loose coupling and future extensibility (quest system already uses this pattern).

---

### 1.5 Extract calculateEquipmentStats to Service (~2 hours)
**Files**: `be/controllers/inventoryController.ts` → `be/services/equipmentService.ts`

#### Issue:
140 lines of business logic in controller (lines 63-203).

#### Implementation:
Create new service:

```typescript
// be/services/equipmentService.ts
import { IPlayer } from '../models/Player';
import { EquipmentStats } from '@shared/types';

class EquipmentService {
  /**
   * Calculate total equipment stats from all equipped items
   */
  calculateEquipmentStats(player: IPlayer): EquipmentStats {
    const stats = {
      totalArmor: 0,
      totalEvasion: 0,
      totalDamage: 0,
      weaponSpeed: 0,
      damageType: null,
      // ... all 15+ stat fields
    };

    // Extract logic from inventoryController lines 63-203
    // ... calculation logic ...

    return stats;
  }

  /**
   * Get all equipped items with definitions
   */
  getEquippedItemsWithDefinitions(player: IPlayer): Array<{
    slot: string,
    instance: any,
    definition: any
  }> {
    // Extract from inventoryController
  }
}

export default new EquipmentService();
```

#### Update Controller:
```typescript
// inventoryController.ts line 63
const equipmentStats = equipmentService.calculateEquipmentStats(player);
```

#### Update Other Consumers:
- `combatService.ts` can now use equipmentService instead of duplicating logic

---

## Phase 2: High Impact Refactors (Priority 2)
**Estimated Effort**: 12-15 hours
**Goal**: Consolidate duplicated logic, add caching, improve performance

### 2.1 Consolidate Ingredient Consumption Logic (~3 hours)
**Files**: `be/services/recipeService.ts`, `be/controllers/craftingController.ts`, `be/sockets/craftingHandler.ts`

#### Issue:
80 lines of ingredient selection/consumption logic duplicated between HTTP and WebSocket handlers.

#### Implementation:
```typescript
// recipeService.ts
async consumeIngredients(
  player: IPlayer,
  recipe: Recipe,
  selectedIngredients: Map<string, string[]>
): Promise<{ consumed: any[], remaining: Map<string, number> }> {
  const consumed = [];
  const remaining = new Map();

  for (const ingredient of recipe.ingredients) {
    // Extract logic from craftingController lines 212-291
    // Handle itemId vs subcategory
    // Handle instance selection
    // Remove items from inventory
    // Track quantities
  }

  return { consumed, remaining };
}

async processCrafting(
  player: IPlayer,
  recipe: Recipe,
  selectedIngredients: Map<string, string[]>
): Promise<{
  outputItem: any,
  xpRewards: any,
  consumed: any[]
}> {
  // 1. Validate requirements (existing method)
  // 2. Consume ingredients (new method above)
  // 3. Calculate quality/traits
  // 4. Create output item
  // 5. Award XP
  // 6. Update quests

  return { outputItem, xpRewards, consumed };
}
```

#### Remove Duplication:
- `craftingHandler.ts`: Replace lines 13-179 with `recipeService.processCrafting()`
- `craftingController.ts`: Same replacement (or remove file if unused)

---

### 2.2 Cache Effect Evaluations (~4 hours)
**Files**: `be/services/effectEvaluator.ts`

#### Issue:
`evaluatePlayerEffects()` called multiple times per combat turn without caching (lines 28-69).

#### Implementation:
```typescript
// Add caching layer
class EffectEvaluatorCache {
  private cache = new Map<string, { result: any, timestamp: number }>();
  private TTL = 5000; // 5 second TTL

  get(playerId: string, context: string): any | null {
    const key = `${playerId}:${context}`;
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.result;
    }

    this.cache.delete(key);
    return null;
  }

  set(playerId: string, context: string, result: any): void {
    const key = `${playerId}:${context}`;
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  invalidate(playerId: string): void {
    // Clear all entries for this player
    for (const key of this.cache.keys()) {
      if (key.startsWith(playerId)) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new EffectEvaluatorCache();

// In evaluatePlayerEffects():
export function evaluatePlayerEffects(player, context, ...args) {
  const cached = cache.get(player._id.toString(), context);
  if (cached) return cached;

  const result = /* existing calculation */;
  cache.set(player._id.toString(), context, result);
  return result;
}
```

#### Cache Invalidation:
Invalidate when equipment changes:
```typescript
// inventoryController.ts - in equipItem() and unequipItem()
import { invalidateEffectCache } from '../services/effectEvaluator';

await player.equipItem(instanceId, slotName);
invalidateEffectCache(player._id.toString());
```

---

### 2.3 Extract Player Model Methods to Services (~4 hours)
**Files**: `be/models/Player.ts` → New service files

#### Issue:
Player model has 30+ methods, violating single responsibility (god object antipattern).

#### Implementation:
Create specialized services:

**PlayerInventoryService:**
```typescript
// be/services/playerInventoryService.ts
class PlayerInventoryService {
  addItem(player: IPlayer, itemInstance: any): Promise<void>
  removeItem(player: IPlayer, instanceId: string, quantity: number): Promise<void>
  equipItem(player: IPlayer, instanceId: string, slot: string): Promise<void>
  unequipItem(player: IPlayer, slot: string): Promise<void>
  hasInventoryItem(player: IPlayer, itemId: string, quantity: number): boolean
  getEquippedItems(player: IPlayer): any[]
}
```

**PlayerCombatService:**
```typescript
// be/services/playerCombatService.ts
class PlayerCombatService {
  takeDamage(player: IPlayer, amount: number): Promise<void>
  heal(player: IPlayer, amount: number): Promise<void>
  useMana(player: IPlayer, amount: number): Promise<boolean>
  restoreMana(player: IPlayer, amount: number): Promise<void>
  isInCombat(player: IPlayer): boolean
  addCombatLog(player: IPlayer, message: string): void
}
```

**PlayerQuestService:**
```typescript
// be/services/playerQuestService.ts
class PlayerQuestService {
  getActiveQuests(player: IPlayer): any[]
  acceptQuest(player: IPlayer, questId: string): Promise<void>
  abandonQuest(player: IPlayer, questId: string): Promise<void>
  completeQuestObjective(player: IPlayer, questId: string, objectiveId: string): Promise<void>
}
```

#### Migration Strategy:
1. Create service methods that wrap existing Player methods
2. Update all controllers/handlers to use services
3. Mark Player methods as deprecated
4. Remove Player methods in future release (Phase 4)

---

### 2.4 Batch Item Definition Lookups (~2 hours)
**Files**: `be/controllers/locationController.ts` lines 639-670

#### Issue:
N+1 query pattern - for each item, calls `getItemDefinition()`:

```typescript
// Current (inefficient):
for (const item of lootItems) {
  const def = itemService.getItemDefinition(item.itemId); // Called N times
}
```

#### Implementation:
```typescript
// Optimized:
const itemIds = [...new Set(lootItems.map(item => item.itemId))];
const definitions = itemService.getItemDefinitions(itemIds); // Batch fetch
const defMap = new Map(definitions.map(def => [def.itemId, def]));

for (const item of lootItems) {
  const def = defMap.get(item.itemId); // O(1) lookup
}
```

Add batch method to itemService:
```typescript
// itemService.ts
getItemDefinitions(itemIds: string[]): Item[] {
  return itemIds.map(id => this.getItemDefinition(id)).filter(Boolean);
}
```

---

### 2.5 Create Shared Mongoose Utilities (~1 hour)
**Files**: `shared/utils/mongoose-helpers.ts`

#### Issue:
`convertMapsToObjects()` duplicated in 15+ files.

#### Implementation:
```typescript
// shared/utils/mongoose-helpers.ts
export function convertMapsToObjects(obj: any): any {
  if (!obj) return obj;

  const result = { ...obj };

  for (const key in result) {
    if (result[key] instanceof Map) {
      result[key] = Object.fromEntries(result[key]);
    }
  }

  return result;
}

export function convertItemForClient(item: any): any {
  const plainItem = item.toObject ? item.toObject() : item;

  if (plainItem.qualities instanceof Map) {
    plainItem.qualities = Object.fromEntries(plainItem.qualities);
  }

  if (plainItem.traits instanceof Map) {
    plainItem.traits = Object.fromEntries(plainItem.traits);
  }

  return plainItem;
}
```

#### Update All Files:
Replace local helper functions with import:
```typescript
import { convertMapsToObjects, convertItemForClient } from '@shared/utils/mongoose-helpers';
```

---

## Phase 3: Medium Priority Improvements (Priority 3)
**Estimated Effort**: 10-12 hours
**Goal**: Simplify complex functions, improve type safety, create abstractions

### 3.1 Simplify Complex Functions (~3 hours)

#### combatService.ts - calculateCombatStat() (90 lines)
**Current**: Lines 233-323 are monolithic and hard to test
**Refactor**:
```typescript
// Break into smaller functions:
function getBaseStat(statName: string, player: IPlayer): number
function getPassiveBonus(statName: string, player: IPlayer): number
function getEquipmentBonus(statName: string, player: IPlayer): number
function getBuffBonus(statName: string, combat: ActiveCombat): number

function calculateCombatStat(statName: string, player: IPlayer, combat: ActiveCombat): number {
  const base = getBaseStat(statName, player);
  const passive = getPassiveBonus(statName, player);
  const equipment = getEquipmentBonus(statName, player);
  const buffs = getBuffBonus(statName, combat);

  return base + passive + equipment + buffs;
}
```

#### recipeService.ts - validateRecipeRequirements() (111 lines)
**Current**: Lines 32-143 are too complex
**Refactor**:
```typescript
function validateSkillLevel(recipe: Recipe, player: IPlayer): ValidationResult
function validateIngredient(ingredient: Ingredient, player: IPlayer): ValidationResult
function validateSelectedInstances(ingredient: Ingredient, selectedIds: string[], player: IPlayer): ValidationResult

function validateRecipeRequirements(recipe: Recipe, player: IPlayer, selected: Map): ValidationResult {
  // Orchestrate smaller validation functions
  const skillCheck = validateSkillLevel(recipe, player);
  if (!skillCheck.valid) return skillCheck;

  for (const ingredient of recipe.ingredients) {
    const ingredientCheck = validateIngredient(ingredient, player);
    if (!ingredientCheck.valid) return ingredientCheck;

    if (selected.has(ingredient.itemId)) {
      const instanceCheck = validateSelectedInstances(/* ... */);
      if (!instanceCheck.valid) return instanceCheck;
    }
  }

  return { valid: true };
}
```

---

### 3.2 Improve Type Safety (~2 hours)

#### Replace `as any` casts in socket handlers:
```typescript
// Before:
const userId = (req as any).user._id;
const player = (socket as any).player;

// After:
interface AuthenticatedRequest extends Request {
  user: IUser;
}

interface AuthenticatedSocket extends Socket {
  userId: string;
  player: IPlayer;
}

const userId = (req as AuthenticatedRequest).user._id;
const player = (socket as AuthenticatedSocket).player;
```

#### Create type definitions file:
```typescript
// be/types/express.d.ts
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
```

---

### 3.3 Create Service Abstractions (~4 hours)

#### RewardProcessor Service:
```typescript
// be/services/rewardProcessor.ts
class RewardProcessor {
  async processRewards(
    player: IPlayer,
    rewards: {
      xp?: { skillId: string, amount: number },
      items?: any[],
      gold?: number
    }
  ): Promise<{
    xpRewards: any,
    itemsAdded: any[],
    goldAdded: number
  }> {
    // Centralized reward processing
    // Used by activities, combat, crafting, quests
  }
}
```

#### TimerManager Service:
```typescript
// be/services/timerManager.ts
class TimerManager {
  private timers = new Map<string, NodeJS.Timeout>();

  schedule(key: string, callback: () => void, delay: number): void {
    this.clear(key);
    const timer = setTimeout(callback, delay);
    this.timers.set(key, timer);
  }

  clear(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  clearAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
  }
}

// Usage in activityHandler.ts:
const timerManager = new TimerManager();
timerManager.schedule(`activity:${playerId}`, callback, duration);

socket.on('disconnect', () => {
  timerManager.clear(`activity:${playerId}`);
});
```

---

### 3.4 Implement Structured Logging (~2 hours)

#### Install Winston:
```bash
npm install winston
```

#### Create Logger Service:
```typescript
// be/services/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
```

#### Replace console.* throughout codebase:
```typescript
// Before:
console.log('Activity started', activityId);
console.error('Failed to equip item:', error);

// After:
import logger from '../services/logger';

logger.info('Activity started', { activityId, playerId });
logger.error('Failed to equip item', { error, instanceId, slotName });
```

---

## Phase 4: Technical Debt & Polish (Priority 4)
**Estimated Effort**: 8-10 hours
**Goal**: Clean up remaining issues, improve documentation, prepare for testing

### 4.1 Verify and Remove Deprecated HTTP Endpoints (~2 hours)

#### Frontend Verification Script:
```bash
# Search for HTTP crafting endpoint usage
grep -r "api/crafting" ui/src/

# Search for HTTP storage endpoint usage
grep -r "api/storage" ui/src/ | grep -v "storage.service"

# Search for HTTP combat endpoint usage
grep -r "api/combat" ui/src/ | grep -v "combat.service"
```

#### Candidates for Removal:
- `be/controllers/craftingController.ts` (entire file - 410 lines)
- `be/controllers/storageController.ts` (entire file - 179 lines)
- `be/routes/crafting.js` (entire file)
- `be/routes/storage.ts` (entire file)

#### Keep if Frontend Uses:
If verification shows usage, add deprecation warnings instead:
```typescript
// craftingController.ts
logger.warn('Deprecated endpoint called', {
  endpoint: '/api/crafting/start',
  message: 'Use WebSocket crafting:start event instead'
});
```

---

### 4.2 Standardize Error Handling (~2 hours)

#### Create Error Handling Middleware:
```typescript
// be/middleware/errorHandler.ts
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?._id
  });

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
```

#### Apply to All Controllers:
```typescript
// Before:
router.post('/equip', async (req, res) => {
  try {
    // ... logic ...
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// After:
import { asyncHandler } from '../middleware/errorHandler';

router.post('/equip', asyncHandler(async (req, res) => {
  // ... logic ...
  // Errors automatically caught and handled
}));
```

---

### 4.3 Complete TODOs and Code Comments (~1 hour)

#### Guild Storage Permissions (storageHandler.ts line 214):
```typescript
// TODO: Add guild storage permissions
// Implementation:
function canAccessContainer(player: IPlayer, containerId: string): boolean {
  if (containerId === 'bank') return true; // Personal bank

  if (containerId.startsWith('guild:')) {
    const guildId = containerId.split(':')[1];
    return player.guildId === guildId && player.guildPermissions.includes('ACCESS_STORAGE');
  }

  if (containerId.startsWith('house:')) {
    const propertyId = containerId.split(':')[1];
    return player.properties.includes(propertyId);
  }

  return false;
}
```

#### Other TODOs:
Search and address:
```bash
grep -r "TODO" be/services/
grep -r "FIXME" be/controllers/
grep -r "HACK" be/
```

---

### 4.4 Add JSDoc Documentation (~2 hours)

#### Priority Functions to Document:
```typescript
/**
 * Calculate combat stat with all modifiers
 * @param statName - Name of stat (armor, damage, evasion, etc.)
 * @param player - Player instance with equipment and attributes
 * @param combat - Active combat state with buffs/debuffs
 * @returns Final calculated stat value
 * @example
 * const armor = calculateCombatStat('armor', player, combat);
 * // Returns: 150 (50 base + 50 equipment + 50 buffs)
 */
function calculateCombatStat(statName: string, player: IPlayer, combat: ActiveCombat): number
```

#### Documentation Targets:
- Complex algorithms (effect evaluator, combat calculations)
- Public service methods (all exported functions)
- Critical business logic (reward processing, XP scaling)

---

### 4.5 Extract Magic Numbers to Constants (~1 hour)

#### Create Configuration File:
```typescript
// be/config/game-constants.ts
export const GAME_CONSTANTS = {
  // Timers
  EFFECT_CACHE_TTL_MS: 5000,
  PASSIVE_CACHE_TTL_MS: 10000,

  // XP
  SKILL_TO_ATTRIBUTE_XP_RATIO: 0.5,
  MIN_ACTIVITY_XP: 1,

  // Combat
  CRIT_MULTIPLIER: 2.0,
  ARMOR_SCALING_FACTOR: 1000,
  EVASION_CAP: 0.75,

  // Inventory
  DEFAULT_BANK_CAPACITY: 200,
  MAX_INVENTORY_WEIGHT: 200, // kg

  // Crafting
  QUALITY_BONUS_PER_10_LEVELS: 1,
  MAX_SKILL_QUALITY_BONUS: 2,

  // Drop Tables
  DROP_QUALITY_BONUS_MULTIPLIER: 1.0,

  // Rate Limiting
  MAX_CHAT_MESSAGES_PER_10_SEC: 5
} as const;
```

#### Replace Throughout Codebase:
```typescript
// Before:
if (critRoll < critChance) {
  damage *= 2.0; // Magic number
}

// After:
import { GAME_CONSTANTS } from '../config/game-constants';

if (critRoll < critChance) {
  damage *= GAME_CONSTANTS.CRIT_MULTIPLIER;
}
```

---

### 4.6 Database Indexing Review (~1 hour)

#### Verify Indexes Exist:
```javascript
// Check in MongoDB shell or migration
db.players.getIndexes();

// Should include:
// { userId: 1 }  - for fast player lookup
// { 'inventory.instanceId': 1 }  - for item queries
// { currentLocation: 1 }  - for location filtering
// { 'activeQuests.questId': 1 }  - for quest queries
```

#### Create Migration if Needed:
```javascript
// be/migrations/024-add-player-indexes.js
async function up(db) {
  await db.collection('players').createIndex({ userId: 1 }, { unique: true });
  await db.collection('players').createIndex({ currentLocation: 1 });
  await db.collection('players').createIndex({ 'inventory.instanceId': 1 });
  await db.collection('players').createIndex({ 'activeQuests.questId': 1 });
}

async function down(db) {
  await db.collection('players').dropIndex({ userId: 1 });
  await db.collection('players').dropIndex({ currentLocation: 1 });
  await db.collection('players').dropIndex({ 'inventory.instanceId': 1 });
  await db.collection('players').dropIndex({ 'activeQuests.questId': 1 });
}
```

---

## Cross-Phase Considerations

### Testing Strategy
- Unit tests will be added in separate project (per project requirements)
- Manual testing after each phase:
  - Start activity, wait for completion, verify rewards
  - Craft item, verify ingredients consumed correctly
  - Equip/unequip items, verify stats update
  - Connect/disconnect, verify no memory leaks
  - Check logs for errors

### Deployment Strategy
- Each phase should be deployable independently
- Create feature branches: `refactor/phase-1`, `refactor/phase-2`, etc.
- Test on local/dev environment before production
- Deploy during low-traffic periods
- Monitor error logs closely after deployment

### Documentation Updates
- Update CLAUDE.md after each phase
- Document breaking changes in migration guides
- Update API documentation if endpoints change
- Create architectural diagrams for new abstractions

### Risk Mitigation
- **Backup database** before each phase
- Keep deprecated code for 1 release cycle (mark as deprecated, remove in next phase)
- Maintain backward compatibility where possible
- Have rollback plan ready (git revert, database restore)

---

## Success Metrics

### Phase 1 Success Criteria:
- ✅ No memory leaks after 100+ connect/disconnect cycles
- ✅ Deprecated endpoints removed, frontend still works
- ✅ Reward calculation in single location (locationService)
- ✅ No circular dependency warnings
- ✅ Equipment stats calculation in service, not controller

### Phase 2 Success Criteria:
- ✅ Effect evaluation cache hit rate >80%
- ✅ Ingredient consumption code in single location
- ✅ Player model has <15 methods (down from 30+)
- ✅ No N+1 query patterns in controllers

### Phase 3 Success Criteria:
- ✅ No functions >50 lines (down from 100+ line functions)
- ✅ Zero `as any` casts in socket handlers
- ✅ Structured logging in all services
- ✅ Timer management centralized

### Phase 4 Success Criteria:
- ✅ All HTTP endpoints verified (removed or deprecated)
- ✅ Zero TODO/FIXME comments in critical paths
- ✅ All public methods have JSDoc
- ✅ Database indexes verified
- ✅ Zero magic numbers in calculations

---

## Timeline Estimate

| Phase | Effort | Dependencies | Suggested Schedule |
|-------|--------|--------------|-------------------|
| Phase 1 | 10-12 hours | None | Week 1 |
| Phase 2 | 12-15 hours | Phase 1 complete | Week 2-3 |
| Phase 3 | 10-12 hours | Phase 2 complete | Week 4 |
| Phase 4 | 8-10 hours | Phase 3 complete | Week 5 |
| **Total** | **40-49 hours** | | **5 weeks** |

**Note**: Timeline assumes 8-10 hours/week dedicated to refactoring alongside feature development.

---

## Next Steps

1. ✅ Review and approve this master plan
2. ✅ Create Phase 1 detailed execution plan (separate document)
3. ⬜ Begin Phase 1 implementation
4. ⬜ Test Phase 1 changes
5. ⬜ Deploy Phase 1 to production
6. ⬜ Repeat for subsequent phases

---

## Appendix: Quick Reference

### Files with Most Duplication:
1. `activityHandler.ts` + `craftingHandler.ts` (reward logic)
2. `inventoryController.ts` + `combatService.ts` (equipment stats)
3. 15+ files (Map to Object conversion)

### Files with Highest Complexity:
1. `combatService.ts` (1000+ lines, 90-line functions)
2. `Player.ts` (500+ lines, 30+ methods)
3. `effectEvaluator.ts` (600+ lines, nested loops)
4. `inventoryController.ts` (930 lines, mixed concerns)

### Performance Hot Paths:
1. Effect evaluation (combat stats)
2. Item definition lookups
3. Reward calculation
4. Equipment stat calculation

### Memory Leak Risks:
1. Socket timer cleanup (activityHandler, craftingHandler)
2. Effect cache (no TTL originally)
3. Passive cache (no invalidation)

---

**Document Status**: ✅ Complete - Ready for Phase 1 Planning
