# Container Max-Width Tokens - Design System Enhancement

**Date**: 2025-01-21
**Status**: Complete

## Problem

During the design system v2.0 migration, valid pixel-based `max-width` values were incorrectly replaced with non-existent spacing tokens (`--spacing-6xl` through `--spacing-11xl`). The spacing scale only goes up to `--spacing-5xl: 48px`, so any references to higher spacing tokens were invalid and would fail silently.

### Examples of Issues:
- `max-width: var(--spacing-10xl)` → Undefined token (spacing scale ends at 5xl)
- `max-width: var(--spacing-8xl)` → Undefined token
- `@media (max-width: var(--spacing-11xl))` → Invalid breakpoint syntax

## Solution

### 1. Created Container Max-Width Tokens

Added semantic container tokens to [design-tokens.scss](../../ui/src/design-tokens.scss):

```scss
/* ========================================
   CONTAINER MAX-WIDTHS
   ======================================== */

--container-xs: 300px;   /* Small buttons, compact UI elements */
--container-s: 400px;    /* Login forms, small modals */
--container-m: 500px;    /* Standard modals, dialogs */
--container-l: 600px;    /* Medium breakpoint, larger modals */
--container-xl: 800px;   /* Wide modals, equipment grids */
--container-2xl: 1000px; /* Large content areas */
--container-3xl: 1200px; /* Bank, game containers, main content */
```

### 2. Fixed All Affected Components

**Total files fixed**: 19 component SCSS files

| Token Used | Correct Token | Value | Use Case |
|------------|---------------|-------|----------|
| `--spacing-7xl` | `--container-xs` | 300px | Small buttons, new encounter button |
| `--spacing-8xl` | `--container-s` | 400px | Login/register forms, small modals |
| `--spacing-9xl` | `--container-m` | 500px | Standard modals, item details |
| `--spacing-10xl` | `--container-3xl` | 1200px | Bank, game containers, manual |
| `--spacing-11xl` | `--breakpoint-tablet` | 768px | Media queries |

**Components Updated**:
- Authentication: login, register, game-loading
- Game UI: bank, combat, equipment, inventory, quest-journal
- Containers: game (map/quest modals), manual
- Shared: confirm-dialog, item-details-panel, notification-display, quantity-dialog
- Media Queries: ability-button, item-button (switched to --breakpoint-tablet)

### 3. Enhanced Audit Script

Updated [audit-design-tokens.js](../../project/utils/audit-design-tokens.js) to prevent future issues:

**New Checks Added**:
1. **Invalid Spacing on Width Properties**
   - Detects `max-width`, `min-width`, `width` using `--spacing-6xl+`
   - Regex: `/(max-width|min-width|width):\s*var\(--spacing-([6-9]xl|1[0-9]xl)\)/g`
   - Suggests using `--container-*` tokens instead

2. **Media Queries Using Spacing Tokens**
   - Detects `@media` queries using any `--spacing-*` token
   - Regex: `/@media\s*\([^)]*var\(--spacing-[^)]+\)[^)]*\)/g`
   - Suggests using `--breakpoint-*` tokens instead

**Script Output Enhancement**:
```
SUMMARY:
  Invalid spacing on width:   14 issues
  Media queries with spacing: 0 issues

========================================
  INVALID SPACING TOKENS ON WIDTH PROPERTIES
========================================

❌ Spacing tokens max out at --spacing-5xl (48px).
   Using --spacing-6xl+ is invalid and will fail.
   For width constraints, use --container-* tokens instead.

📄 game/equipment/equipment.component.scss
   Line 29: max-width: var(--spacing-8xl)
   Property: max-width
   Invalid token: --spacing-8xl
   Context: max-width: var(--spacing-8xl);
   💡 Use --container-* tokens for width constraints
```

## Design Philosophy

### When to Use Each Token Set

**Spacing Tokens (`--spacing-*`)**: For padding, margin, gap
- Range: 2px - 48px (xxs to 5xl)
- Use for: Component internal spacing, padding, gaps
- Example: `padding: var(--spacing-l); gap: var(--spacing-m);`

**Container Tokens (`--container-*`)**: For width constraints
- Range: 300px - 1200px (xs to 3xl)
- Use for: Modal widths, form containers, content max-widths
- Example: `max-width: var(--container-m);`

**Breakpoint Tokens (`--breakpoint-*`)**: For responsive design
- Values: 480px, 768px, 1024px, 1440px
- Use for: Media queries, responsive layouts
- Example: `@media (max-width: var(--breakpoint-tablet)) { ... }`

## Benefits

✅ **Semantic Token Names**: `--container-m` is more descriptive than `--spacing-9xl`
✅ **Prevents Future Mistakes**: Audit script catches invalid token usage
✅ **Self-Documenting**: Token names clearly indicate their purpose
✅ **Type Safety**: Design tokens are validated at build time
✅ **Consistent Sizing**: All modals and containers use standardized widths

## Remaining Work

The audit script detected **14 additional issues** using invalid spacing tokens for `min-width` properties and `grid-template-columns`:

- `game/attributes/attributes.component.scss`: `min-width: var(--spacing-7xl)`
- `game/crafting/recipe-list/recipe-list.component.scss`: `min-width: var(--spacing-7xl)`
- `game/inventory/inventory-header/inventory-header.component.scss`: `min-width: var(--spacing-6xl)`
- `game/skills/skills.component.scss`: `min-width: var(--spacing-7xl)`
- `game/world-map/world-map.component.scss`: `min-width: var(--spacing-7xl)` (2 instances)
- Various components: `grid-template-columns` using `--spacing-7xl`

**Recommendation**: Address these in a follow-up pass, as they were not part of the original max-width issue but are related problems.

## Testing

Run the audit script to verify no max-width issues remain:

```bash
cd project/utils && node audit-design-tokens.js
```

Expected result for max-width:
```
Invalid spacing on width:   0 issues (for max-width only)
Media queries with spacing: 0 issues
```

## Related Documentation

- [Design System v2.0 Migration Guide](./066-design-system-v2-migration-guide.md)
- [Design System v2.0 Style Guide](./067-design-system-v2-style-guide.md)
- [Design System v2.0 Summary](./068-design-system-v2-summary.md)
