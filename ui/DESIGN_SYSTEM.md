# ClearSkies Design System

This document describes the design system for ClearSkies, a Material Design-inspired token-based styling approach using CSS custom properties (variables).

## Overview

The design system is defined in `src/design-tokens.scss` and provides a comprehensive set of reusable design tokens that ensure consistency across the entire application.

## Philosophy

- **Consistency**: Use design tokens instead of hard-coded values
- **Maintainability**: Change once, update everywhere
- **Scalability**: Easy to add new components with consistent styling
- **Semantic naming**: Variables describe their purpose, not just values
- **Medieval Fantasy Theme**: Dark blues, purples, and gold accents

## Usage

### Importing Design Tokens

The design tokens are automatically imported via `styles.scss`, so they're available globally:

```scss
// In any component.scss file, you can directly use:
.my-component {
  background: var(--color-bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-card);
}
```

## Design Token Categories

### 1. Colors

#### Primary Colors (Medieval Fantasy Theme)
```scss
--color-primary: #e94560         // Main accent color (red/pink)
--color-primary-dark: #c73651    // Darker variant
--color-primary-light: #ff6b6b   // Lighter variant
```

#### Secondary Colors
```scss
--color-secondary: #ffd700       // Gold
--color-secondary-dark: #d4af37  // Darker gold
--color-secondary-light: #ffed4e // Lighter gold
```

#### Accent Colors
```scss
--color-accent-blue: #4ecdc4
--color-accent-purple: #667eea
```

#### Background Colors
```scss
--color-bg-primary: #1a1a2e     // Main background
--color-bg-secondary: #16213e   // Cards, panels
--color-bg-tertiary: #0f3460    // Deeper elements
--color-bg-elevated: #2a2a3e    // Raised surfaces
```

#### Text Colors
```scss
--color-text-primary: #ffffff    // Main text
--color-text-secondary: #eeeeee  // Secondary text
--color-text-muted: #aaaaaa      // Muted text
--color-text-disabled: #666666   // Disabled state
```

#### Status Colors
```scss
--color-success: #4ecdc4
--color-warning: #f0a500
--color-error: #ff4444
```

#### Game-Specific Colors
```scss
--color-health: #e94560
--color-mana: #4e54c8
--color-experience: #ffd700
--color-gold: #ffd700
```

**Example:**
```scss
.health-bar {
  background: var(--color-health);
  color: var(--color-text-primary);
}
```

### 2. Spacing System (4px base unit)

The spacing system uses a 4px base unit for consistency:

```scss
--spacing-xs: 4px
--spacing-s: 8px
--spacing-m: 12px
--spacing-l: 16px
--spacing-xl: 20px
--spacing-2xl: 24px
--spacing-3xl: 32px
--spacing-4xl: 40px
--spacing-5xl: 48px
```

#### Semantic Spacing
```scss
--spacing-component-padding: var(--spacing-xl)
--spacing-section-gap: var(--spacing-3xl)
--spacing-card-padding: var(--spacing-xl)
```

**Example:**
```scss
.card {
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
  gap: var(--spacing-m);
}
```

### 3. Typography

#### Font Families
```scss
--font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
--font-monospace: 'Courier New', Courier, monospace
```

#### Font Sizes
```scss
--font-size-s: 11px
--font-size-m: 12px
--font-size-base: 14px
--font-size-l: 16px
--font-size-xl: 18px
--font-size-2xl: 20px
--font-size-3xl: 24px
--font-size-4xl: 28px
--font-size-5xl: 32px
```

#### Font Weights
```scss
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

#### Line Heights & Letter Spacing
```scss
--line-height-tight: 1.2
--line-height-normal: 1.5
--line-height-relaxed: 1.6
--line-height-loose: 2

--letter-spacing-wide: 0.5px
--letter-spacing-wider: 1px
```

**Example:**
```scss
h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.label {
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}
```

### 4. Border Radius

```scss
--radius-s: 5px
--radius-m: 8px
--radius-l: 10px
--radius-xl: 12px
--radius-full: 9999px

// Semantic variants
--radius-button: var(--radius-s)
--radius-card: var(--radius-m)
--radius-panel: var(--radius-l)
--radius-modal: var(--radius-xl)
```

**Example:**
```scss
.button {
  border-radius: var(--radius-button);
}

.card {
  border-radius: var(--radius-card);
}

.progress-bar {
  border-radius: var(--radius-full); // Fully rounded
}
```

### 5. Borders

```scss
--border-width-thin: 1px
--border-width-medium: 2px
--border-width-thick: 3px

// Pre-defined border combinations
--border-default: var(--border-width-medium) solid var(--color-surface-border)
--border-light: var(--border-width-thin) solid var(--color-surface-border-light)
--border-primary: var(--border-width-medium) solid var(--color-primary)
```

**Example:**
```scss
.card {
  border: var(--border-default);

  &:hover {
    border: var(--border-primary);
  }
}
```

### 6. Shadows

```scss
--shadow-s: 0 2px 4px rgba(0, 0, 0, 0.2)
--shadow-m: 0 4px 6px rgba(0, 0, 0, 0.3)
--shadow-l: 0 8px 12px rgba(0, 0, 0, 0.4)
--shadow-xl: 0 12px 20px rgba(0, 0, 0, 0.5)

// Glow effects
--shadow-glow-primary: 0 0 10px rgba(233, 69, 96, 0.5)
--shadow-glow-secondary: 0 0 10px rgba(255, 215, 0, 0.5)
--shadow-glow-accent: 0 0 10px rgba(78, 205, 196, 0.5)
```

**Example:**
```scss
.card {
  box-shadow: var(--shadow-m);

  &:hover {
    box-shadow: var(--shadow-l);
  }
}

.health-bar {
  box-shadow: var(--shadow-glow-primary);
}
```

### 7. Transitions & Animations

```scss
// Durations
--duration-instant: 100ms
--duration-fast: 200ms
--duration-normal: 300ms
--duration-slow: 500ms

// Easing functions
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

// Presets
--transition-fast: var(--duration-fast) var(--ease-out)
--transition-normal: var(--duration-normal) var(--ease-in-out)
--transition-slow: var(--duration-slow) var(--ease-in-out)
```

**Example:**
```scss
.button {
  transition: background var(--transition-normal);

  &:hover {
    background: var(--color-primary-dark);
  }
}

.modal {
  transition: transform var(--transition-slow);
}
```

### 8. Gradients

Pre-defined gradients for common use cases:

```scss
--gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)
--gradient-secondary: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%)
--gradient-surface: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)
--gradient-card: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)

// Game bars
--gradient-health: linear-gradient(90deg, var(--color-health) 0%, var(--color-primary-light) 100%)
--gradient-mana: linear-gradient(90deg, var(--color-mana) 0%, #8f94fb 100%)
--gradient-experience: linear-gradient(90deg, var(--color-experience) 0%, var(--color-secondary-light) 100%)
```

**Example:**
```scss
.header {
  background: var(--gradient-surface);
}

.level-badge {
  background: var(--gradient-primary);
}

.health-bar {
  background: var(--gradient-health);
}
```

### 9. Z-Index Layers

Consistent layering system:

```scss
--z-base: 0
--z-dropdown: 100
--z-sticky: 200
--z-fixed: 300
--z-modal-backdrop: 400
--z-modal: 500
--z-popover: 600
--z-tooltip: 700
```

**Example:**
```scss
.dropdown {
  z-index: var(--z-dropdown);
}

.modal-backdrop {
  z-index: var(--z-modal-backdrop);
}

.modal {
  z-index: var(--z-modal);
}
```

### 10. Component Sizing

```scss
// Heights
--height-input: 40px
--height-button: 40px
--height-button-small: 32px
--height-button-large: 48px
--height-progress-bar: 24px
--height-progress-bar-small: 20px

// Icon sizes
--icon-size-s: 24px
--icon-size-m: 32px
--icon-size-l: 40px
--icon-size-xl: 48px

// Layout
--sidebar-width-left: 280px
--sidebar-width-right: 320px
--container-max-width: 1200px
```

**Example:**
```scss
.button {
  height: var(--height-button);

  &.small {
    height: var(--height-button-small);
  }
}

.skill-icon {
  width: var(--icon-size-xl);
  height: var(--icon-size-xl);
}
```

## Utility Classes

Pre-built utility classes are available for common use cases:

```scss
// Text colors
.text-primary    // White text
.text-secondary  // Light gray text
.text-muted      // Muted gray text
.text-error      // Red error text
.text-success    // Green success text

// Font weights
.font-regular
.font-medium
.font-semibold
.font-bold

// Spacing
.m-0, .p-0
.mt-s, .mt-m, .mt-l
.mb-s, .mb-m, .mb-l

// Layout
.flex
.flex-column
.flex-center
.gap-s, .gap-m, .gap-l
```

## Best Practices

### 1. Always Use Design Tokens

❌ **Don't:**
```scss
.card {
  padding: 20px;
  background: #16213e;
  border-radius: 8px;
  color: #eee;
}
```

✅ **Do:**
```scss
.card {
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-card);
  color: var(--color-text-secondary);
}
```

### 2. Use Semantic Tokens When Available

❌ **Don't:**
```scss
.button {
  border-radius: var(--radius-s);
}
```

✅ **Do:**
```scss
.button {
  border-radius: var(--radius-button);
}
```

### 3. Stick to the Spacing Scale

❌ **Don't:**
```scss
.element {
  margin: 15px; // Not in scale
  padding: 18px; // Not in scale
}
```

✅ **Do:**
```scss
.element {
  margin: var(--spacing-xl);  // 20px
  padding: var(--spacing-l);  // 16px
}
```

### 4. Use Gradients for Consistency

❌ **Don't:**
```scss
.header {
  background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
}
```

✅ **Do:**
```scss
.header {
  background: var(--gradient-surface);
}
```

### 5. Leverage Transition Presets

❌ **Don't:**
```scss
.button {
  transition: all 0.3s ease-in-out;
}
```

✅ **Do:**
```scss
.button {
  transition: background var(--transition-normal);
}
```

## Extending the Design System

When adding new tokens:

1. **Follow the naming convention**: `--category-descriptor-variant`
2. **Use existing values when possible**: Reference other tokens
3. **Document your additions**: Add to this guide
4. **Keep it semantic**: Name describes purpose, not value

**Example of adding a new component token:**

```scss
// In design-tokens.scss
:root {
  // ... existing tokens ...

  /* Quest System */
  --color-quest-active: var(--color-secondary);
  --color-quest-complete: var(--color-success);
  --quest-card-padding: var(--spacing-xl);
  --quest-badge-radius: var(--radius-m);
}
```

## Migration Guide

To migrate existing component styles to use design tokens:

1. Find all hard-coded color values → Replace with `--color-*`
2. Find spacing values (px) → Replace with `--spacing-*`
3. Find font-size values → Replace with `--font-size-*`
4. Find border-radius → Replace with `--radius-*`
5. Find transitions/animations → Replace with token presets
6. Find box-shadows → Replace with `--shadow-*`

## Color Reference

Quick reference for common color usage:

| Use Case | Token |
|----------|-------|
| Page background | `--color-bg-primary` |
| Card/panel background | `--color-bg-secondary` |
| Input/button background | `--color-bg-tertiary` |
| Primary action | `--color-primary` |
| Highlight/gold accent | `--color-secondary` |
| Body text | `--color-text-secondary` |
| Headings | `--color-primary` or `--color-secondary` |
| Muted/helper text | `--color-text-muted` |
| Links | `--color-accent-blue` |
| Success state | `--color-success` |
| Error state | `--color-error` |
| Warning state | `--color-warning` |

## Resources

- [Material Design System](https://material.io/design/introduction)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- Design tokens file: `ui/src/design-tokens.scss`
- Global styles: `ui/src/styles.scss`

---

**Last Updated**: January 2025
**Version**: 1.0.0
