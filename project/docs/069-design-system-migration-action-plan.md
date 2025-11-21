# Design System v2.0 - Migration Action Plan

## Audit Results Summary

**Total Issues Found:** 1,397
- **Hardcoded Colors:** 180 (purple gradients, gold hex codes, damage colors)
- **Hardcoded Spacing:** 1,185 (rem/px values instead of tokens)
- **Undefined Tokens:** 22 (using tokens that don't exist)
- **Hardcoded Gradients:** 10 (purple/gold gradients not using tokens)

## Top Priority Files (High Visual Impact)

Based on audit results, these files have the most critical issues:

### 1. Combat Component (46 color issues)
**File:** `ui/src/app/components/game/combat/combat.component.scss`

**Issues:**
- Damage float colors: `#ef4444`, `#fbbf24`, `#4ade80`, `#3b82f6`
- Ability border colors (hardcoded blues, grays, greens)
- Multiple hardcoded gradients

**Estimated Time:** 30 minutes
**Impact:** High (visible during every combat encounter)

### 2. Inventory Component (18 color issues)
**File:** `ui/src/app/components/game/inventory/inventory.component.scss`

**Issues:**
- Purple slider gradient: `linear-gradient(135deg, #8b5cf6, #7c3aed)`
- Purple borders: `#a78bfa`, `#c4b5fd`

**Estimated Time:** 15 minutes
**Impact:** High (always visible in game UI)

### 3. Ability Button Component (38 color issues)
**File:** `ui/src/app/components/shared/ability-button/ability-button.component.scss`

**Issues:**
- Multiple hardcoded ability gradients (red, green, purple, teal)
- Hardcoded cost colors
- Cooldown state colors

**Estimated Time:** 45 minutes
**Impact:** High (used throughout combat system)

### 4. Game Component (4 color issues)
**File:** `ui/src/app/components/game/game.component.scss`

**Issues:**
- Quest journal gold border: `#ffd700` (repeated 4 times)

**Estimated Time:** 5 minutes
**Impact:** Medium (quest tracker always visible)

### 5. Bank Component (10 color issues)
**File:** `ui/src/app/components/game/bank/bank.component.scss`

**Issues:**
- Action button gradients (hardcoded gold)
- Status indicators (hardcoded greens, yellows, reds)

**Estimated Time:** 15 minutes
**Impact:** Medium (visible when using bank)

## Quick Wins (Low Effort, High Impact)

### Easy Fixes (< 10 minutes each)

1. **Game Component** - Quest journal gold (4 instances → 1 token)
2. **World Map Component** - Quest marker gold (1 instance)
3. **Location Facility Detail** - Gold text (1 instance)
4. **Inventory Grouped/List View** - Red/green borders (4 instances)

**Total Time:** ~30 minutes
**Total Issues Fixed:** ~10

## Phase 1: Critical Visual Issues (2-3 hours)

Focus on fixing hardcoded colors that break the medieval fantasy aesthetic:

| Component | Issues | Priority | Est. Time |
|-----------|--------|----------|-----------|
| Combat | 46 colors | 🔴 Critical | 30 min |
| Inventory | 18 colors | 🔴 Critical | 15 min |
| Ability Button | 38 colors | 🔴 Critical | 45 min |
| Game (quest journal) | 4 colors | 🟡 High | 5 min |
| Bank | 10 colors | 🟡 High | 15 min |
| Item Details Panel Actions | 12 colors | 🟡 High | 10 min |
| Crafting Progress | 6 colors | 🟢 Medium | 10 min |

**Phase 1 Total:** ~130 issues fixed, ~2.5 hours

## Phase 2: Spacing Standardization (4-6 hours)

Convert hardcoded rem/px values to design tokens:

**Strategy:** Use find-and-replace patterns:
- `1rem` → `var(--spacing-l)` (16px)
- `1.5rem` → `var(--spacing-2xl)` (24px)
- `0.75rem` → `var(--spacing-m)` (12px)
- `0.5rem` → `var(--spacing-s)` (8px)
- `2rem` → `var(--spacing-3xl)` (32px)

**Files with Most Spacing Issues:**
1. Combat Component: ~300 instances
2. Various game components: ~200 instances each
3. Shared components: ~100 instances each

**Approach:**
- Group similar components (combat, inventory, crafting)
- Use automated find-and-replace with manual verification
- Test each component group in browser before proceeding

## Phase 3: Undefined Tokens (15 minutes)

Fix references to non-existent tokens:

### Undefined Token: `--color-accent-gold`
**Files:** game.component.scss
**Fix:** Replace with `--color-gold`

### Undefined Token: `--color-border-primary`
**Files:** chat.component.scss
**Fix:** Replace with `--border-bronze` or `--border-default`

### Undefined Token: `--color-border` (without suffix)
**Files:** ability-button.component.scss
**Fix:** Replace with `--border-default`

## Testing Strategy

### After Each Component Migration

1. **Visual Test:**
   ```
   npm run dev (if not already running)
   Navigate to component in browser
   Verify colors match medieval theme
   Check hover/active states
   ```

2. **Code Validation:**
   ```bash
   node project/utils/audit-design-tokens.js
   ```

3. **Browser Console Check:**
   - Open DevTools
   - Look for CSS warnings about undefined variables
   - Verify no `undefined` or fallback values

### Regression Testing Checklist

After completing each phase:
- [ ] All rarity colors still work (common gray → legendary orange)
- [ ] Health/mana bars display correctly
- [ ] Damage numbers show with correct colors
- [ ] Quest tracker displays properly
- [ ] Inventory drag-and-drop works
- [ ] Bank interactions functional
- [ ] Combat abilities styled correctly
- [ ] Modals and tooltips readable

## Automated Migration Helper

### Quick Find-and-Replace Patterns

**Purple Gradients:**
```scss
// Find:
linear-gradient\(135deg, #8b5cf6.*?#7c3aed.*?\)

// Replace:
var(--gradient-bronze)
```

**Gold Gradients:**
```scss
// Find:
linear-gradient\(135deg, #ffd700.*?#ffed4e.*?\)

// Replace:
var(--gradient-gold)
```

**Damage Colors:**
```scss
// Find: color: #ef4444;
// Replace: color: var(--color-damage);

// Find: color: #fbbf24;
// Replace: color: var(--color-damage-crit);

// Find: color: #4ade80;
// Replace: color: var(--color-heal);

// Find: color: #3b82f6;
// Replace: color: var(--color-mana-restore);
```

## Rollout Plan

### Week 1: Critical Fixes
- [ ] Phase 1: Fix all hardcoded colors (2-3 hours)
- [ ] Test all game components visually
- [ ] Fix any regressions immediately

### Week 2: Spacing Standardization
- [ ] Phase 2: Convert rem/px to tokens (4-6 hours)
- [ ] Batch test by component group
- [ ] Fix undefined tokens (Phase 3)

### Week 3: Polish & Validation
- [ ] Final audit run (should show 0 issues)
- [ ] Full regression testing
- [ ] Update screenshots/documentation

## Success Metrics

### Before Migration
- 1,397 design token issues
- Inconsistent purple/blue aesthetic
- Hardcoded values scattered across 50+ files

### After Migration (Goals)
- **0 hardcoded colors** (all use tokens)
- **0 hardcoded spacing** (all use tokens)
- **0 undefined tokens** (all references valid)
- Cohesive medieval fantasy visual theme
- Easy to adjust colors/spacing globally

## Risk Mitigation

### Potential Issues

1. **Breaking hover states**
   - Mitigation: Test all interactive elements after migration
   - Rollback: Keep git history clean for easy reverts

2. **Rarity colors accidentally changed**
   - Mitigation: Don't modify rarity color definitions
   - Validation: Check items of each rarity tier

3. **Reduced contrast/readability**
   - Mitigation: Use DevTools contrast checker
   - Requirement: Maintain WCAG AA compliance

4. **Spacing feels different**
   - Mitigation: Match px values exactly with token equivalents
   - Validation: Screenshot before/after comparison

## Git Strategy

### Commit Structure

**Option A: One Big Migration** (Not Recommended)
- Single commit with all changes
- Harder to review, harder to rollback

**Option B: Phased Commits** (Recommended)
```bash
# Commit 1: New design tokens
git commit -m "feat: add Design System v2.0 tokens (medieval fantasy theme)"

# Commit 2: Critical color fixes
git commit -m "fix: migrate combat/inventory/abilities to v2 design tokens"

# Commit 3: Additional components
git commit -m "fix: migrate bank/crafting/location to v2 design tokens"

# Commit 4: Spacing standardization
git commit -m "refactor: standardize spacing with design tokens"

# Commit 5: Cleanup
git commit -m "fix: resolve undefined token references"
```

## Next Steps

1. **Immediate:**
   - [ ] Review this action plan
   - [ ] Decide on migration timeline
   - [ ] Create git branch: `feature/design-system-v2`

2. **Before Starting:**
   - [ ] Ensure both frontend and backend are running
   - [ ] Take screenshots of all major components (before state)
   - [ ] Commit all current work (clean working directory)

3. **Start Migration:**
   - [ ] Begin with Quick Wins (30 minutes)
   - [ ] Proceed to Phase 1 Critical Fixes
   - [ ] Test thoroughly before Phase 2

4. **After Completion:**
   - [ ] Run final audit (verify 0 issues)
   - [ ] Take screenshots (after state)
   - [ ] Create before/after comparison document
   - [ ] Merge to main with `/checkpoint`

---

**Ready to transform ClearSkies into a cohesive medieval fantasy experience!** 🏰
