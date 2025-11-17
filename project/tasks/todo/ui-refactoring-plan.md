# UI Refactoring Plan

**Created:** 2025-11-17
**Status:** In Progress
**Priority:** High

## Overview

Comprehensive refactoring of the Angular UI to improve code quality, remove dead code, enforce naming conventions, and decompose overly complex components.

## Analysis Summary

- **Total Components:** 36
- **Components >500 lines:** 5 (14%)
- **Components using signals:** 9 (25%)
- **Dead Services:** 1 (BankService - 130 lines)
- **Naming violations:** 5 components
- **Type safety issues:** 40+ `any` occurrences
- **Debug code:** 93 console.log statements

---

## Phase 1: Quick Wins (Dead Code & Naming) ✅ COMPLETE

### 1.1 Delete Dead Code ✅
- [x] **Delete BankService** - `ui/src/app/services/bank.service.ts`
  - Not imported or used anywhere
  - Superseded by StorageService
  - Safe to delete (130 lines removed)

- [x] **Remove test methods from production components:**
  - `attributes.component.ts` lines 60-71: Remove `testAddXP()` method
  - `skills.component.ts` lines 60-81: Remove `testAddExperience()` method

### 1.2 Fix Naming Convention Violations ✅
Rename 5 components to follow `.component.*` naming convention:

- [x] `quest-journal.ts` → `quest-journal.component.ts`
  - Updated imports in: game.component.ts
  - Updated templateUrl/styleUrl in component decorator

- [x] `quest-tracker.ts` → `quest-tracker.component.ts`
  - Updated imports in: game.component.ts
  - Updated templateUrl/styleUrl in component decorator
  - Added missing `standalone: true`

- [x] `world-map.ts` → `world-map.component.ts`
  - Updated imports in: game.component.ts
  - Updated templateUrl/styleUrl in component decorator

- [x] `buff-icon.ts` → `buff-icon.component.ts`
  - Updated imports in: combat.component.ts
  - Updated templateUrl/styleUrl in component decorator

- [x] `notification-display.ts` → `notification-display.component.ts`
  - Updated imports in: game.component.ts
  - Updated templateUrl/styleUrl in component decorator

**Completed Time:** ~1 hour
**Risk:** Low (mechanical changes with clear dependencies)
**Build Status:** ✅ Build successful (3.654 seconds)

---

## Phase 2: Type Safety Improvements ✅ COMPLETE

### 2.1 Replace `any` Types (40+ occurrences) ✅

**High-impact files:**
- [x] `combat.component.ts` - 7 occurrences ✅
  - Fixed timer interval type: `ReturnType<typeof setInterval> | null`
  - Fixed error handlers: changed `any` to `Error`
  - Fixed style methods: explicit return types with optional properties

- [x] `crafting.component.ts` - 17 occurrences ✅
  - Created `CraftingItemInstance` type alias for flexibility
  - Fixed all ingredient-related methods with `RecipeIngredient` type
  - Used non-null assertions for optional subcategory fields
  - Fixed error handlers: changed `any` to `Error`

- [x] `inventory.component.ts` - 6 occurrences ✅
  - ItemGroup interface: used `ItemDetails['definition']` for definition property
  - Fixed all error handlers: changed `any` to `Error` or specific error response types

- [x] `item-details-panel.component.ts` - 8 occurrences ✅
  - Created `CombatStats` interface with all required properties
  - Created `EffectData` interface for formatEffectValue method
  - Used bracket notation for index signature properties
  - Fixed getQualityKeys to accept `Record<string, any>`

- [x] `item-modifiers.component.ts` - 3 occurrences ✅
  - Changed `@Input() item` to `ItemInstance | any` (hybrid type)
  - Fixed method signatures for getAverageQuality and formatInlineText

- [x] `item-mini.component.ts` - 1 occurrence ✅
  - Changed to `ItemInstance | any` (hybrid type for ItemDetails compatibility)

- [x] `vendor.component.ts` - 1 occurrence ✅
  - Fixed calculateSellPrice with union type for vendorPrice property

- [x] `world-map.component.ts` - 2 occurrences ✅
  - Created NavigationLink and NavigationRequirements types from `@shared/types`
  - Fixed checkRequirements parameter type

**Strategy:** Used proper types from `@shared/types` and created specific interfaces where needed

### 2.2 Clean Up Debug Code
- [ ] Remove/replace 93 console.log statements across 20 files
  - Option A: Delete debug logs for production
  - Option B: Replace with proper logging service
  - High-count files: inventory (26), equipment (11), crafting (8), combat (7)

**Completed Time:** ~2 hours
**Risk:** Low (type improvements are backward compatible)
**Build Status:** ✅ Build successful (3.273 seconds)

---

## Phase 3: Component Decomposition

### 3.1 Refactor CraftingComponent (CRITICAL - 1,231 lines)

**Current Issues:**
- Violates single responsibility principle
- Handles recipe filtering, ingredient selection, crafting logic, UI state, and validation
- 8+ `any` types
- Mixed concerns: UI logic, business logic, and data transformation

**Decomposition Plan:**
- [ ] Create `RecipeListComponent`
  - Recipe display and filtering
  - Extract recipe filtering logic

- [ ] Create `IngredientSelectorComponent`
  - Ingredient selection UI
  - Instance selection logic

- [ ] Create `CraftingProgressComponent`
  - Active crafting display
  - Progress bar and completion handling

- [ ] Move business logic to `CraftingService`
  - Recipe validation
  - Ingredient checking
  - Crafting calculations

**Estimated Time:** 6-8 hours
**Risk:** Medium (complex state management, extensive testing required)

### 3.2 Refactor InventoryComponent (HIGH - 847 lines)

**Current Issues:**
- Handles both list and grouped view modes
- Complex filtering, sorting, and search logic
- Right-click context menu logic
- Drag-and-drop implementation
- Item operations (equip/use/drop)

**Decomposition Plan:**
- [ ] Create `InventoryListComponent`
  - List view display
  - Item row rendering

- [ ] Create `InventoryGroupedComponent`
  - Grouped view display
  - Group expansion/collapse logic

- [ ] Create `InventoryFilterBarComponent`
  - Filters and search UI
  - Extract filter state management

- [ ] Move view logic to presentation service
  - Sorting algorithms
  - Filtering logic
  - Search implementation

**Estimated Time:** 5-7 hours
**Risk:** Medium (drag-drop and context menu interactions need careful testing)

### 3.3 Refactor ItemDetailsPanelComponent (HIGH - 883 lines)

**Current Issues:**
- Large template with complex conditional rendering (457 lines HTML)
- 30+ formatting helper methods
- Effect display logic embedded in component

**Decomposition Plan:**
- [ ] Create `ItemEffectDisplayComponent`
  - Effect rendering logic
  - Stat comparison display

- [ ] Extract formatting to pipes/services
  - Create `EffectFormatPipe`
  - Create `StatFormatPipe`

- [ ] Split template into sub-templates/components
  - Basic info section
  - Stats section
  - Effects section
  - Comparison section

**Estimated Time:** 4-6 hours
**Risk:** Low-Medium (mostly UI refactoring)

### 3.4 Simplify Other Large Components

- [ ] **CombatComponent** (714 lines)
  - Extract timer logic to service/helper
  - Create `FloatingNumberComponent` for damage animations
  - Simplify computed signals

- [ ] **ChatComponent** (584 lines)
  - Extract `ChatCommandService` for command handling
  - Extract `ChatAutocompleteComponent` for suggestions
  - Simplify to pure message display/input

**Estimated Time:** 4-5 hours per component
**Risk:** Medium (combat timing logic is sensitive)

---

## Phase 4: Angular Signals Migration

### 4.1 Migrate Components to Signals (13 components)

**Location Sub-components:**
- [ ] location-facility-list.component.ts
- [ ] location-travel.component.ts
- [ ] location-activity-detail.component.ts
- [ ] location-facility-detail.component.ts
- [ ] activity-drop-table.component.ts

**Shared Components:**
- [ ] icon.component.ts
- [ ] item-mini.component.ts
- [ ] xp-mini.component.ts
- [ ] item-modifiers.component.ts
- [ ] ability-button.component.ts
- [ ] item-button.component.ts
- [ ] activity-log.component.ts
- [ ] confirm-dialog.component.ts

**Manual Section Components:**
- [ ] 5 manual section components

**Benefits:**
- Better reactivity and change detection
- Improved performance
- More functional approach
- Consistency with Angular 20 best practices

**Estimated Time:** 2-3 hours (batch migration)
**Risk:** Low (straightforward migration pattern)

---

## Phase 5: Code Quality Improvements

### 5.1 Extract Duplicate Logic

- [ ] **Rarity Class Mapping** (appears in multiple components)
  - Extract to shared pipe: `RarityClassPipe`
  - Used in: vendor, inventory, item-details-panel

- [ ] **Item Filtering Logic** (duplicated across components)
  - Extract to shared service: `ItemFilterService`
  - Used in: inventory, bank, crafting

- [ ] **Sorting Algorithms** (duplicated patterns)
  - Extract to shared utility: `ItemSortUtils`
  - Standardize sort functions

### 5.2 Move Business Logic to Services

- [ ] **CraftingComponent** - Move recipe validation to CraftingService
- [ ] **InventoryComponent** - Move item scoring algorithm to InventoryService
- [ ] **VendorComponent** - Move price calculation to VendorService
- [ ] **CombatComponent** - Move damage calculations to CombatService

### 5.3 Implement TODOs or Remove

- [ ] `world-map.ts` line 182: Implement requirement checking
- [ ] `world-map.ts` line 290: Implement requirements error display

### 5.4 Standardize Patterns

- [ ] Standardize on `inject()` pattern vs constructor injection
- [ ] Add "Component" suffix to class names (Equipment, Skills)

**Estimated Time:** 3-4 hours
**Risk:** Low (incremental improvements)

---

## Total Effort Estimate

- **Phase 1:** 1-2 hours ⚡ (Quick wins)
- **Phase 2:** 3-4 hours
- **Phase 3:** 19-26 hours (Major refactoring)
- **Phase 4:** 2-3 hours
- **Phase 5:** 3-4 hours

**Total:** 28-39 hours (~4-5 days of focused work)

---

## Testing Strategy

After each phase:
1. Run `ng build` to check for TypeScript errors
2. Visual testing in browser (http://localhost:4200)
3. Test affected features manually
4. Check for console errors
5. Verify Socket.io connections still work

**Critical test areas:**
- Inventory operations (equip/unequip/use/drop)
- Crafting flow (recipe selection, ingredient selection, crafting)
- Combat (abilities, items, restart)
- Chat (commands, autocomplete)
- Bank (deposit/withdraw)

---

## Success Metrics

- [ ] Zero dead code (BankService deleted)
- [ ] 100% naming convention compliance
- [ ] Zero `any` types in critical components
- [ ] All components <500 lines
- [ ] 75%+ components using signals
- [ ] Zero duplicate filtering/sorting logic
- [ ] Zero console.log statements in production code
- [ ] All business logic in services (not components)

---

## Rollback Plan

- Commit after each phase completion
- Use feature branches for major refactoring
- Keep original components until decomposed versions are tested
- Document breaking changes in commit messages

---

## Notes

- Location component already partially decomposed (good example to follow)
- Signals migration should follow Angular 20 best practices
- Consider creating style guide document after completion
- Update CLAUDE.md with new component structure
