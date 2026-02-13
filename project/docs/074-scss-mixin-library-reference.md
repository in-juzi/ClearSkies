# SCSS Mixin Library Reference

## Overview

Reusable SCSS mixins that eliminate code duplication and standardize common UI patterns across 53 components.

**Location**: [ui/src/_mixins.scss](../../ui/src/_mixins.scss)

**Benefits**:
- ✅ Eliminates ~330 lines of duplicate code across components
- ✅ Reduces component SCSS file sizes by 15-35%
- ✅ Standardizes modals, scrollbars, inputs, cards, buttons
- ✅ Easier global updates (change mixin instead of 50+ files)

## Quick Reference

```scss
@import 'mixins';

// Modal/Dialog
.my-modal { @include modal-container(var(--container-m), 80vh); }
.modal-header { @include modal-header(); }
.close-button { @include close-button(); }

// Scrollbar
.scrollable-list { @include custom-scrollbar(); }

// Forms
.search-input { @include input-field(); }

// Cards
.item-card { @include hover-card(); }
.info-panel { @include panel(); }

// Layout
.items-grid { @include flex-grid(var(--spacing-s), row wrap); }

// Empty States
.no-items { @include empty-state(); }

// Buttons
.craft-button { @include action-button(); }
.cancel-button { @include secondary-action-button(); }
```

## Available Mixins

| Mixin | Purpose | Lines Saved |
|-------|---------|-------------|
| `modal-container()` | Fixed-position modal dialog | ~18 lines |
| `modal-header()` | Modal header with title/close | ~8 lines |
| `close-button()` | Standardized X button | ~12 lines |
| `custom-scrollbar()` | Consistent scrollbar styling | ~16 lines |
| `input-field()` | Form input appearance | ~14 lines |
| `hover-card()` | Interactive card with hover | ~12 lines |
| `panel()` | Basic panel/card container | ~6 lines |
| `flex-grid()` | Flexbox grid layout | ~4 lines |
| `empty-state()` | Empty state messages | ~4 lines |
| `action-button()` | Primary action button | ~17 lines |
| `secondary-action-button()` | Secondary action button | ~17 lines |
| `section-header()` | Consistent section headers | ~5 lines |
| `truncate-text()` | Text truncation with ellipsis | ~3 lines |
| `visually-hidden()` | Hide but keep accessible | ~8 lines |
| `aspect-ratio()` | Fixed aspect ratio containers | ~10 lines |

## Detailed Mixin Documentation

### Modal Container
```scss
@mixin modal-container($max-width: var(--container-l), $max-height: 90vh)
```
Creates a fixed-position, centered modal dialog with backdrop blur.

**Parameters**:
- `$max-width` - Maximum width (default: `var(--container-l)`)
- `$max-height` - Maximum height (default: `90vh`)

**Usage**:
```scss
.bank-modal {
  @include modal-container(var(--container-3xl), 90vh);
}
```

### Modal Header
```scss
@mixin modal-header($padding-x: var(--spacing-l))
```
Standard modal header with flex layout, border, and background.

**Parameters**:
- `$padding-x` - Horizontal padding (default: `var(--spacing-l)`)

**Usage**:
```scss
.modal-header {
  @include modal-header(var(--spacing-2xl));
}
```

### Close Button
```scss
@mixin close-button()
```
Standardized X button for modals with hover effects.

**Usage**:
```scss
.close-button {
  @include close-button();
}
```

### Custom Scrollbar
```scss
@mixin custom-scrollbar($thumb-color: var(--color-accent-blue))
```
Consistent scrollbar styling across browsers.

**Parameters**:
- `$thumb-color` - Scrollbar thumb color (default: `var(--color-accent-blue)`)

**Usage**:
```scss
.scrollable-list {
  @include custom-scrollbar(var(--color-accent-moon));
}
```

### Input Field
```scss
@mixin input-field()
```
Form input appearance with focus states and transitions.

**Usage**:
```scss
.search-input {
  @include input-field();
}
```

### Hover Card
```scss
@mixin hover-card()
```
Interactive card with hover effects and cursor pointer.

**Usage**:
```scss
.item-card {
  @include hover-card();
}
```

### Panel
```scss
@mixin panel()
```
Basic panel/card container with background, border, and padding.

**Usage**:
```scss
.info-panel {
  @include panel();
}
```

### Flex Grid
```scss
@mixin flex-grid($gap: var(--spacing-m), $flex-flow: row wrap)
```
Flexbox grid layout with configurable gap and flow.

**Parameters**:
- `$gap` - Grid gap spacing (default: `var(--spacing-m)`)
- `$flex-flow` - Flex direction and wrap (default: `row wrap`)

**Usage**:
```scss
.items-grid {
  @include flex-grid(var(--spacing-s), row wrap);
}
```

### Empty State
```scss
@mixin empty-state()
```
Centered empty state messages with muted text.

**Usage**:
```scss
.no-items {
  @include empty-state();
}
```

### Action Button
```scss
@mixin action-button()
```
Primary action button with gradient background and hover effects.

**Usage**:
```scss
.craft-button {
  @include action-button();
}
```

### Secondary Action Button
```scss
@mixin secondary-action-button()
```
Secondary action button with outlined style.

**Usage**:
```scss
.cancel-button {
  @include secondary-action-button();
}
```

### Section Header
```scss
@mixin section-header()
```
Consistent section headers with bottom border.

**Usage**:
```scss
h3 {
  @include section-header();
}
```

### Truncate Text
```scss
@mixin truncate-text()
```
Single-line text truncation with ellipsis.

**Usage**:
```scss
.item-name {
  @include truncate-text();
}
```

### Visually Hidden
```scss
@mixin visually-hidden()
```
Hide element visually but keep accessible for screen readers.

**Usage**:
```scss
.sr-only {
  @include visually-hidden();
}
```

### Aspect Ratio
```scss
@mixin aspect-ratio($width, $height)
```
Fixed aspect ratio container.

**Parameters**:
- `$width` - Width ratio
- `$height` - Height ratio

**Usage**:
```scss
.video-container {
  @include aspect-ratio(16, 9);
}
```

## Migration Example

### Before (Bank component - 364 lines)
```scss
.bank-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: var(--container-3xl);
  max-height: 90vh;
  background: var(--gradient-card);
  border: var(--border-default);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-l) var(--spacing-2xl);
  border-bottom: 1px solid var(--color-surface-border);
  background: var(--color-bg-elevated);
}

.close-button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-4xl);
  cursor: pointer;

  &:hover {
    color: var(--color-text-primary);
  }
}
```

### After (Bank component - 304 lines, 16.5% reduction)
```scss
@import 'mixins';

.bank-modal {
  @include modal-container(var(--container-3xl), 90vh);
}

.bank-header {
  @include modal-header(var(--spacing-2xl));
}

.close-button {
  @include close-button();
}
```

## When to Use Mixins vs. Utility Classes

### Use Mixins When
- Pattern needs customization (parameters)
- Multiple related styles applied together
- Complex nesting or pseudo-elements

### Use Utility Classes When
- Simple, non-customizable patterns
- Frequently used in templates
- Composing multiple simple styles

### Examples

```scss
// Mixins (customizable)
@include modal-container(var(--container-3xl), 90vh);
@include custom-scrollbar(var(--color-accent-blue));

// Utility Classes (fixed patterns)
.flex-between
.border-bottom
.text-muted
.overflow-hidden
```

## Migration Checklist

When migrating a component:
- [ ] Import mixins: `@import 'mixins';`
- [ ] Replace modal containers → `@include modal-container()`
- [ ] Replace modal headers → `@include modal-header()`
- [ ] Replace close buttons → `@include close-button()`
- [ ] Replace scrollbars → `@include custom-scrollbar()`
- [ ] Replace form inputs → `@include input-field()`
- [ ] Replace flex grids → `@include flex-grid()`
- [ ] Replace empty states → `@include empty-state()`
- [ ] Replace action buttons → `@include action-button()`
- [ ] Test visually in browser
- [ ] Verify no regressions

## See Also

- [073-design-system-reference.md](073-design-system-reference.md) - Design token system
- [066-design-system-v2-migration-guide.md](066-design-system-v2-migration-guide.md) - Component migration guide
- [ui/src/_mixins.scss](../../ui/src/_mixins.scss) - Mixin source code
