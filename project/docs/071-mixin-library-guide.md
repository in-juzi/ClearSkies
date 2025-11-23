# ClearSkies SCSS Mixin Library Guide

## Overview

The ClearSkies project uses a comprehensive SCSS mixin library to reduce code duplication, standardize component patterns, and improve maintainability. This guide documents all available mixins, when to use them, and migration patterns for existing components.

**Location**: [ui/src/_mixins.scss](../../ui/src/_mixins.scss)

**Benefits**:
- ✅ Eliminates ~330 lines of duplicate code across 53 components
- ✅ Standardizes common UI patterns (modals, scrollbars, inputs, cards)
- ✅ Maintains night sky theme consistency
- ✅ Easier to update styles globally (change mixin instead of 50+ files)
- ✅ Reduces component SCSS file sizes by 15-35%

---

## Quick Start

### 1. Import Mixins in Component

```scss
@import 'mixins';

.my-component {
  @include modal-container();
}
```

Angular automatically resolves `'mixins'` to `ui/src/_mixins.scss` via the `stylePreprocessorOptions` configuration in `angular.json`.

### 2. Available Mixins Reference

| Mixin | Purpose | Common Use Case |
|-------|---------|-----------------|
| `modal-container()` | Fixed-position modal dialog | Modals, dialogs, overlays |
| `modal-header()` | Modal header with title/close | Modal headers |
| `close-button()` | Standardized X button | Close buttons in modals |
| `custom-scrollbar()` | Consistent scrollbar styling | Scrollable containers |
| `input-field()` | Form input appearance | Text inputs, selects |
| `hover-card()` | Interactive card with hover | Item cards, clickable panels |
| `panel()` | Basic panel/card container | Static content panels |
| `flex-grid()` | Flexbox grid layout | Item grids, lists |
| `empty-state()` | Empty state messages | No items, no data states |
| `action-button()` | Primary action button | Craft, Buy, Sell buttons |
| `secondary-action-button()` | Secondary action button | Cancel, Back buttons |
| `section-header()` | Consistent section headers | Section titles |
| `truncate-text()` | Text truncation with ellipsis | Long item names |
| `visually-hidden()` | Hide element but keep accessible | Screen reader text |
| `aspect-ratio()` | Fixed aspect ratio containers | Square boxes, images |

---

## Detailed Mixin Reference

### Modal & Dialog Mixins

#### `modal-container($max-width, $max-height)`

Creates a centered, fixed-position modal dialog.

**Parameters**:
- `$max-width` (optional) - Maximum width of modal (default: `var(--container-m)`)
- `$max-height` (optional) - Maximum height of modal (default: `80vh`)

**Example**:
```scss
.bank-modal {
  @include modal-container(var(--container-3xl), 90vh);
}
```

**Before** (manual implementation - 18 lines):
```scss
.bank-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: var(--container-3xl);
  max-height: 90vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  border: 2px solid var(--color-secondary);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

**After** (with mixin - 1 line):
```scss
.bank-modal {
  @include modal-container(var(--container-3xl), 90vh);
}
```

---

#### `modal-header($padding)`

Creates a consistent modal header with flexbox layout for title and close button.

**Parameters**:
- `$padding` (optional) - Horizontal padding (default: `var(--spacing-xl)`)

**Example**:
```scss
.bank-header {
  @include modal-header(var(--spacing-2xl));

  h2 {
    color: var(--color-secondary);
  }
}
```

**Before** (8 lines):
```scss
.bank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-l) var(--spacing-2xl);
  border-bottom: 1px solid var(--color-surface-border);
  background: var(--color-bg-elevated);
}
```

**After** (1 line):
```scss
.bank-header {
  @include modal-header(var(--spacing-2xl));
}
```

---

#### `close-button()`

Creates a standardized close button for modals/dialogs.

**Parameters**: None

**Example**:
```scss
.close-button {
  @include close-button();
}
```

**Before** (12 lines):
```scss
.close-button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-3xl);
  cursor: pointer;
  transition: color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    color: var(--color-text-primary);
    transform: scale(1.1);
  }
}
```

**After** (1 line):
```scss
.close-button {
  @include close-button();
}
```

---

### Scrollbar Mixins

#### `custom-scrollbar($thumb-color, $track-color)`

Creates consistent custom scrollbar styling for WebKit and Firefox.

**Parameters**:
- `$thumb-color` (optional) - Scrollbar thumb color (default: `var(--color-surface-border)`)
- `$track-color` (optional) - Scrollbar track color (default: `var(--color-bg-primary)`)

**Example**:
```scss
.items-grid {
  overflow-y: auto;
  @include custom-scrollbar();
}

// Or with custom colors:
.special-list {
  @include custom-scrollbar(var(--color-accent-blue), rgba(0, 0, 0, 0.2));
}
```

**Before** (16 lines):
```scss
.items-grid::-webkit-scrollbar {
  width: var(--spacing-s);
}

.items-grid::-webkit-scrollbar-track {
  background: var(--color-bg-primary);
  border-radius: var(--radius-s);
}

.items-grid::-webkit-scrollbar-thumb {
  background: var(--color-surface-border);
  border-radius: var(--radius-s);

  &:hover {
    background: var(--color-surface-border-light);
  }
}
```

**After** (2 lines):
```scss
.items-grid {
  @include custom-scrollbar();
}
```

---

### Form Input Mixins

#### `input-field()`

Creates consistent form input styling with focus states and placeholder styling.

**Parameters**: None

**Example**:
```scss
.search-input,
.category-filter {
  @include input-field();
}
```

**Before** (14 lines):
```scss
.search-input {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xs);
  padding: var(--spacing-xs) var(--spacing-m);
  color: var(--color-text-primary);
  font-size: var(--font-size-s);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--color-accent-blue);
  }
}
```

**After** (1 line):
```scss
.search-input {
  @include input-field();
}
```

**Includes**:
- Moon yellow focus border with glow effect
- Muted placeholder text
- Disabled state styling
- Consistent padding and border radius

---

### Card & Panel Mixins

#### `hover-card($border-color)`

Creates an interactive card with hover effects.

**Parameters**:
- `$border-color` (optional) - Default border color (default: `var(--color-surface-border)`)

**Example**:
```scss
.item-card {
  @include hover-card();
}

.special-card {
  @include hover-card(var(--color-accent-blue));
}
```

**Before** (12 lines):
```scss
.item-card {
  padding: var(--spacing-l);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-card);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-accent-blue);
  }
}
```

**After** (1 line):
```scss
.item-card {
  @include hover-card();
}
```

---

#### `panel($padding)`

Creates a basic panel/card container.

**Parameters**:
- `$padding` (optional) - Panel padding (default: `var(--spacing-xl)`)

**Example**:
```scss
.info-panel {
  @include panel();
}

.compact-panel {
  @include panel(var(--spacing-m));
}
```

---

### Layout Mixins

#### `flex-grid($gap, $direction)`

Creates a flexbox grid layout.

**Parameters**:
- `$gap` (optional) - Gap between items (default: `var(--spacing-m)`)
- `$direction` (optional) - Flex direction (default: `row wrap`)

**Example**:
```scss
.items-grid {
  @include flex-grid(var(--spacing-s), row wrap);
}

.vertical-list {
  @include flex-grid(var(--spacing-l), column);
}
```

**Before** (4 lines):
```scss
.items-grid {
  display: flex;
  flex-flow: row wrap;
  gap: var(--spacing-s);
}
```

**After** (1 line):
```scss
.items-grid {
  @include flex-grid(var(--spacing-s), row wrap);
}
```

---

### Empty State Mixins

#### `empty-state($padding)`

Creates consistent empty state messaging.

**Parameters**:
- `$padding` (optional) - Padding around message (default: `var(--spacing-3xl)`)

**Example**:
```scss
.no-items {
  @include empty-state();
}

.compact-empty {
  @include empty-state(var(--spacing-2xl));
}
```

**Before** (4 lines):
```scss
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-muted);
  font-style: italic;
}
```

**After** (1 line):
```scss
.empty-state {
  @include empty-state();
}
```

---

### Button Mixins

#### `action-button($bg-gradient, $border-color)`

Creates a primary action button with gradient background.

**Parameters**:
- `$bg-gradient` (optional) - Background gradient (default: `var(--gradient-button-primary)`)
- `$border-color` (optional) - Border color (default: `var(--color-moon-yellow-dark)`)

**Example**:
```scss
.craft-button {
  @include action-button();
}

.special-button {
  @include action-button(var(--gradient-button-secondary), var(--color-night-blue-light));
}
```

**Before** (17 lines):
```scss
.craft-button {
  padding: var(--spacing-m) var(--spacing-xl);
  background: var(--gradient-button-primary);
  color: var(--color-text-inverse);
  border: 2px solid var(--color-moon-yellow-dark);
  border-radius: var(--radius-l);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow-moon);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

**After** (1 line):
```scss
.craft-button {
  @include action-button();
}
```

---

#### `secondary-action-button()`

Creates a secondary action button with night blue theme.

**Parameters**: None

**Example**:
```scss
.cancel-button {
  @include secondary-action-button();
}
```

---

### Typography Mixins

#### `section-header()`

Creates consistent section headers.

**Parameters**: None

**Example**:
```scss
.section-title {
  @include section-header();
}
```

---

#### `truncate-text()`

Truncates text with ellipsis.

**Parameters**: None

**Example**:
```scss
.item-name {
  @include truncate-text();
  max-width: 200px;
}
```

---

### Utility Mixins

#### `visually-hidden()`

Hides element visually but keeps it accessible to screen readers.

**Parameters**: None

**Example**:
```scss
.sr-only {
  @include visually-hidden();
}
```

---

#### `aspect-ratio($width, $height)`

Creates a box with a specific aspect ratio.

**Parameters**:
- `$width` (optional) - Width ratio (default: `1`)
- `$height` (optional) - Height ratio (default: `1`)

**Example**:
```scss
.square-box {
  @include aspect-ratio(1, 1);
}

.widescreen-box {
  @include aspect-ratio(16, 9);
}
```

---

## Migration Patterns

### Pattern 1: Modal Component Migration

**Before**:
```scss
.my-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: var(--container-m);
  max-height: 80vh;
  background: var(--gradient-card);
  border: var(--border-default);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.my-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-l) var(--spacing-xl);
  border-bottom: 1px solid var(--color-surface-border);
  background: var(--color-bg-elevated);

  h2 {
    margin: 0;
    color: var(--color-text-primary);
  }
}

.close-button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-3xl);
  cursor: pointer;

  &:hover {
    color: var(--color-text-primary);
  }
}
```

**After**:
```scss
@import 'mixins';

.my-modal-container {
  @include modal-container();
}

.my-modal-header {
  @include modal-header();
}

.close-button {
  @include close-button();
}
```

**Reduction**: From 40 lines to 10 lines (**75% reduction**)

---

### Pattern 2: Scrollable List Migration

**Before**:
```scss
.scrollable-list {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: var(--spacing-s);
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
    border-radius: var(--radius-s);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-surface-border);
    border-radius: var(--radius-s);

    &:hover {
      background: var(--color-bg-tertiary);
    }
  }
}
```

**After**:
```scss
@import 'mixins';

.scrollable-list {
  overflow-y: auto;
  @include custom-scrollbar();
}
```

**Reduction**: From 16 lines to 4 lines (**75% reduction**)

---

### Pattern 3: Form Inputs Migration

**Before**:
```scss
.search-input {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xs);
  padding: var(--spacing-xs) var(--spacing-m);
  color: var(--color-text-primary);
  font-size: var(--font-size-s);

  &:focus {
    outline: none;
    border-color: var(--color-accent-blue);
  }

  &::placeholder {
    color: var(--color-text-label);
    opacity: 0.6;
  }
}

.category-filter {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-xs);
  padding: var(--spacing-xs) var(--spacing-m);
  color: var(--color-text-primary);
  font-size: var(--font-size-s);

  &:focus {
    outline: none;
    border-color: var(--color-accent-blue);
  }
}
```

**After**:
```scss
@import 'mixins';

.search-input,
.category-filter {
  @include input-field();
}
```

**Reduction**: From 30 lines to 5 lines (**83% reduction**)

---

## Real-World Example: Bank Component

The Bank component was migrated to use mixins, demonstrating the power of this approach.

**Before** (364 lines):
- Manual modal container implementation
- Duplicate scrollbar styling
- Custom input field styles
- Inline flex-grid and empty-state patterns

**After** (304 lines):
- `@include modal-container()`
- `@include modal-header()`
- `@include close-button()`
- `@include custom-scrollbar()`
- `@include input-field()`
- `@include flex-grid()`
- `@include empty-state()`

**Reduction**: **60 lines removed (16.5% reduction)**

**Benefits**:
- ✅ Easier to maintain (update mixin instead of component)
- ✅ Consistent with other modals across the app
- ✅ Faster to implement future modals
- ✅ Less code to review and test

---

## When to Use Mixins vs. Utility Classes

### Use Mixins When:
- Pattern is component-specific and needs customization
- Multiple related styles need to be applied together
- Pattern includes complex nesting or pseudo-elements
- You need to pass parameters for variation

**Examples**:
- `@include modal-container(var(--container-3xl), 90vh)` - Custom modal sizes
- `@include custom-scrollbar(var(--color-accent-blue))` - Custom scrollbar colors
- `@include hover-card(var(--color-border-gold))` - Custom border on hover

### Use Utility Classes When:
- Pattern is simple and doesn't need customization
- You're composing multiple simple styles
- Pattern is frequently used in templates

**Examples**:
- `.flex-between` - Space-between layout
- `.border-bottom` - Add bottom border
- `.text-muted` - Muted text color
- `.overflow-hidden` - Hide overflow

---

## Best Practices

### 1. Always Import Mixins at File Top

```scss
@import 'mixins';

.my-component {
  @include modal-container();
}
```

### 2. Combine Mixins with Additional Styles

```scss
.bank-header {
  @include modal-header(var(--spacing-2xl));
  background: linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent);

  h2 {
    color: var(--color-secondary);
  }
}
```

### 3. Use Parameters for Variation

```scss
// Default modal
.small-modal {
  @include modal-container();
}

// Large modal
.large-modal {
  @include modal-container(var(--container-3xl), 90vh);
}

// Extra large modal
.xl-modal {
  @include modal-container(var(--container-4xl), 95vh);
}
```

### 4. Nest Mixins for Complex Patterns

```scss
.items-grid {
  @include flex-grid(var(--spacing-s), row wrap);
  @include custom-scrollbar();
  flex: 1;
  overflow-y: auto;
}
```

### 5. Override Mixin Styles When Needed

```scss
.special-button {
  @include action-button();

  // Override specific styles
  font-size: var(--font-size-xl);
  padding: var(--spacing-l) var(--spacing-3xl);
}
```

---

## Component Migration Checklist

When migrating an existing component to use mixins:

- [ ] Import mixins at top of SCSS file (`@import 'mixins';`)
- [ ] Identify modal container patterns → Replace with `@include modal-container()`
- [ ] Identify modal header patterns → Replace with `@include modal-header()`
- [ ] Identify close button patterns → Replace with `@include close-button()`
- [ ] Identify scrollbar styling → Replace with `@include custom-scrollbar()`
- [ ] Identify form inputs → Replace with `@include input-field()`
- [ ] Identify flex layouts → Replace with `@include flex-grid()`
- [ ] Identify empty states → Replace with `@include empty-state()`
- [ ] Identify action buttons → Replace with `@include action-button()`
- [ ] Test component visually in browser
- [ ] Verify no regressions (hover states, focus states, responsive behavior)
- [ ] Update any component-specific overrides as needed

---

## Troubleshooting

### Issue: Mixin Not Found

**Error**: `Undefined mixin 'modal-container'`

**Solution**: Add `@import 'mixins';` at the top of your SCSS file.

---

### Issue: Styles Not Applying

**Symptom**: Mixin included but styles don't appear

**Possible Causes**:
1. More specific selector is overriding mixin styles
2. Mixin styles are being applied but other styles conflict
3. Build cache needs to be cleared

**Solution**:
1. Check CSS specificity - add `!important` temporarily to debug
2. Clear Angular build cache: `rm -rf .angular/cache`
3. Restart dev server: `npm run dev`

---

### Issue: Parameter Not Working

**Error**: `Error: argument $max-width of modal-container($max-width, $max-height) must be a number`

**Solution**: Ensure you're passing valid CSS values:
```scss
// ❌ Wrong
@include modal-container(large);

// ✅ Correct
@include modal-container(var(--container-l));
```

---

## Future Enhancements

Planned additions to the mixin library:

1. **Animation Mixins** - Fade-in, slide-up, bounce effects
2. **Responsive Mixins** - Breakpoint-based media queries
3. **Component Template Classes** - `.card-elevated`, `.modal-large`, etc.
4. **Grid Layout Mixins** - CSS Grid patterns
5. **Tooltip Mixins** - Standardized tooltip positioning

---

## Related Documentation

- [Design System v3.0 - Night Sky Theme](066-design-system-v2-migration-guide.md)
- [Design Token Style Guide](067-design-system-v2-style-guide.md)
- [Container Max-Width Tokens](069-container-max-width-tokens.md)

---

## Summary

The SCSS mixin library is a powerful tool for maintaining consistency and reducing code duplication across the ClearSkies project. By using mixins for common patterns, you can:

- **Write less code** - 15-35% reduction in component SCSS files
- **Maintain consistency** - All modals/inputs/cards look and behave the same
- **Update globally** - Change mixin once instead of 50+ components
- **Onboard faster** - New developers use documented patterns

**Start using mixins today** - migrate one component at a time or use mixins for all new components going forward.
