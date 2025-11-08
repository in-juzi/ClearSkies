# Design System Quick Start

## TL;DR

We now have a comprehensive design system using CSS variables. **Always use design tokens instead of hard-coded values.**

## Quick Examples

### Colors
```scss
// ❌ Don't
background: #16213e;
color: #eee;

// ✅ Do
background: var(--color-bg-secondary);
color: var(--color-text-secondary);
```

### Spacing
```scss
// ❌ Don't
padding: 20px;
gap: 10px;

// ✅ Do
padding: var(--spacing-xl);
gap: var(--spacing-m);
```

### Typography
```scss
// ❌ Don't
font-size: 24px;
font-weight: 600;

// ✅ Do
font-size: var(--font-size-3xl);
font-weight: var(--font-weight-semibold);
```

### Borders & Radius
```scss
// ❌ Don't
border: 2px solid #4a4a6a;
border-radius: 8px;

// ✅ Do
border: var(--border-default);
border-radius: var(--radius-card);
```

### Shadows
```scss
// ❌ Don't
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

// ✅ Do
box-shadow: var(--shadow-m);
```

### Transitions
```scss
// ❌ Don't
transition: all 0.3s ease-in-out;

// ✅ Do
transition: background var(--transition-normal);
```

### Gradients
```scss
// ❌ Don't
background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);

// ✅ Do
background: var(--gradient-surface);
```

## Common Patterns

### Card Component
```scss
.card {
  background: var(--color-bg-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-card);
  border: var(--border-default);
  box-shadow: var(--shadow-m);

  &:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-l);
  }
}
```

### Button Component
```scss
.button {
  padding: var(--spacing-s) var(--spacing-xl);
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--radius-button);
  font-weight: var(--font-weight-semibold);
  transition: background var(--transition-normal);
  cursor: pointer;

  &:hover {
    background: var(--color-primary-dark);
  }
}
```

### Progress Bar
```scss
.progress-container {
  width: 100%;
  height: var(--height-progress-bar);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background: var(--gradient-experience);
    transition: width var(--transition-normal);
    box-shadow: var(--shadow-glow-secondary);
  }
}
```

### Panel/Section Header
```scss
.section-header {
  background: var(--gradient-surface);
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-bottom: var(--border-width-medium) solid var(--color-primary);

  h2 {
    color: var(--color-secondary);
    font-size: var(--font-size-4xl);
    margin: 0;
  }
}
```

## Spacing Scale Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 4px | Tiny gaps, tight spacing |
| `--spacing-s` | 8px | Small gaps, button padding |
| `--spacing-m` | 12px | Medium gaps, grid gaps |
| `--spacing-l` | 16px | Standard spacing |
| `--spacing-xl` | 20px | **Most common** - Card padding, component spacing |
| `--spacing-2xl` | 24px | Large gaps, section spacing |
| `--spacing-3xl` | 32px | Extra large gaps, page sections |
| `--spacing-4xl` | 40px | Major sections |
| `--spacing-5xl` | 48px | Page-level spacing |

## Color Usage Guide

| Use Case | Token |
|----------|-------|
| Page background | `--color-bg-primary` |
| Card background | `--color-bg-secondary` |
| Input/deeper elements | `--color-bg-tertiary` |
| Primary buttons/accents | `--color-primary` |
| Gold highlights | `--color-secondary` |
| Body text | `--color-text-secondary` |
| Headings | `--color-primary` or `--color-secondary` |
| Muted/helper text | `--color-text-muted` |
| Success | `--color-success` |
| Error | `--color-error` |
| Warning | `--color-warning` |

## Files

- **Token definitions**: `ui/src/design-tokens.scss`
- **Global import**: `ui/src/styles.scss`
- **Full documentation**: `ui/DESIGN_SYSTEM.md`
- **Example migration**: `ui/src/app/components/game/game.component.scss`

## Tips

1. **Use semantic tokens when available**: `--radius-button` instead of `--radius-s`
2. **Stick to the spacing scale**: Don't use arbitrary values like `15px` or `18px`
3. **Use gradients for consistency**: Pre-defined gradients ensure consistent look
4. **Combine related properties**: Use spacing tokens for padding, margin, and gap
5. **Transition specific properties**: Transition `background` or `transform`, not `all`

## Next Steps

1. Gradually migrate existing components to use design tokens
2. Add new tokens to `design-tokens.scss` as needed
3. Keep documentation updated with new patterns
4. Use the game component as a reference for best practices
