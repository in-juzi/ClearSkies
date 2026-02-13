# Design System Reference

## Overview

ClearSkies uses a comprehensive design token system with 600+ tokens for consistent night sky aesthetic across all 53 components.

## Visual Theme Evolution

- **v1.0**: Generic purple/blue modern web app aesthetic
- **v2.0**: Medieval fantasy theme with bronze/gold/warm browns
- **v3.0**: Night sky theme with deep blues and moon yellow accents (CURRENT)

## Color Palette

### Primary Colors
- **Deep Navy/Midnight Blue** (`--color-bg-primary/secondary/tertiary`) - Background surfaces creating night sky atmosphere
- **Moon Yellow** (`--color-accent-moon`) - Primary accent for buttons, highlights, and interactive elements
- **Twilight/Sky Blues** (`--color-accent-twilight`, `--color-sky-*`) - Secondary accents for depth and variation
- **Starlit Effects** - Subtle glows and highlights simulating starlight

### Design Philosophy
- Immersive night sky atmosphere (deep blues, celestial theme)
- Moon yellow for intentional highlights (not overused)
- Starlit aesthetic with subtle glows
- Clean, readable hierarchy with strong contrast
- Fantasy game aesthetic with celestial/cosmic theme

## Key Files

- **Design Tokens**: [ui/src/design-tokens.scss](../../ui/src/design-tokens.scss) - 600+ tokens
- **Migration Guide**: [066-design-system-v2-migration-guide.md](066-design-system-v2-migration-guide.md)
- **Style Guide**: [067-design-system-v2-style-guide.md](067-design-system-v2-style-guide.md)
- **Summary**: [068-design-system-v2-summary.md](068-design-system-v2-summary.md)
- **Container Tokens**: [069-container-max-width-tokens.md](069-container-max-width-tokens.md)
- **Audit Script**: [project/utils/audit-design-tokens.js](../utils/audit-design-tokens.js)

## Token Categories

1. **Colors** (40+ with variants): Night sky palette (navy, midnight blue, twilight blue, moon yellow)
2. **Spacing** (10 levels): 4px base unit (xxs to 5xl) - for padding, margin, gap
3. **Container Max-Widths** (7 levels): 300px to 1200px (xs to 3xl) - for width constraints
4. **Typography** (10 sizes, 4 weights, 3 line heights): Complete type scale
5. **Shadows** (5 elevations + glow effects): Standard shadows + moon/starlit/twilight glows
6. **Gradients** (use sparingly): Moon yellow, twilight blue, health, mana, XP
7. **Component Tokens**: Buttons, cards, inputs, modals, scrollbar
8. **Utility Classes** (30+ classes): Flex layout, spacing shortcuts, borders, state, overflow

## Utility Classes

Pre-built CSS classes for common patterns in templates:

### Flex Layout
- `.flex-between`, `.flex-start`, `.flex-end` - Flexbox alignment
- `.flex-column-gap`, `.flex-row-gap` - Flex with spacing

### Spacing Shortcuts
- `.p-card`, `.p-section` - Padding presets
- `.mb-section`, `.mt-section` - Margin presets

### Borders
- `.border-bottom`, `.border-top`, `.border-default` - Border utilities
- `.border-radius-card`, `.border-radius-button` - Border radius presets

### State
- `.disabled-state`, `.loading-state` - Interaction states
- `.clickable`, `.no-select` - Cursor and selection

### Overflow
- `.overflow-hidden`, `.overflow-auto`, `.overflow-y-auto` - Overflow control

## Common Patterns

### Backgrounds
```scss
background: var(--color-bg-secondary);
```

### Borders
```scss
border: var(--border-primary);
border-radius: var(--radius-card);
```

### Spacing
```scss
padding: var(--card-padding);
gap: var(--spacing-l);
margin-bottom: var(--spacing-section-gap);
```

### Width Constraints
```scss
// Use container tokens for max-width, not spacing tokens
max-width: var(--container-m);  // 500px - standard modals
max-width: var(--container-3xl); // 1200px - large content areas
```

### Typography
```scss
color: var(--color-text-primary);
font-size: var(--font-size-base);
font-weight: var(--font-weight-medium);
```

### Shadows & Effects
```scss
box-shadow: var(--card-shadow);

&:hover {
  box-shadow: var(--shadow-glow-moon);
}
```

### Gradients (use sparingly)
```scss
// YES: Primary buttons, health/mana/XP bars
background: var(--gradient-button-primary);

// NO: Every surface, standard borders, background panels
```

## Usage Guidelines

### Moon Yellow (Primary Accent - Use Intentionally)
- Primary buttons and CTAs
- Important highlights and notifications
- Currency/gold displays
- Quest rewards and achievements
- Interactive element hover states
- Special item highlights

### Twilight/Sky Blues (Secondary Accents)
- Secondary buttons and actions
- Informational highlights
- Skill/attribute indicators
- Mana/magic-related elements
- Depth and variation in UI

### Starlight (Tertiary Accents)
- `--color-text-accent-secondary` - Text highlights replacing legacy purple
- `--color-border-secondary-accent` - Border accents for secondary elements
- `--color-border-secondary-accent-dark` - Darker border variant
- System messages and informational elements
- VS text and combat log system messages
- Reward headers and emphasized headings

### NOT for
- Every heading (maintain contrast)
- Default borders (use subtle blues)
- Standard text (keep readable with whites/grays)

## Migration Status

- ✅ 53 components migrated to night sky theme (v3.0)
- ✅ Zero hardcoded colors or spacing
- ✅ Consistent celestial/night sky aesthetic
- ✅ All components use updated design tokens
- ✅ Medieval fantasy theme (v2.0) replaced with immersive night atmosphere
- ✅ All component buttons migrated to design token classes (.button-primary/secondary/tertiary/danger)
- ✅ 1000+ lines of duplicate button styles removed (replaced with 4 reusable token classes)
- ✅ Secondary accent tokens added (starlight color for legacy purple replacements)
- ✅ Zero legacy purple references (all migrated to semantic tokens)

## Validation

Run audit script to detect issues:

```bash
cd project/utils && node audit-design-tokens.js
```

**Detects**:
- Hardcoded hex colors (`#8b5cf6`, `#ffd700`)
- Hardcoded spacing (`1rem`, `20px`)
- Undefined tokens (`var(--color-accent-gold)`)
- Legacy purple/gold gradients

**Output**: Summary of issues with file-by-file breakdown, line numbers, and migration priority ranking.

## See Also

- [066-design-system-v2-migration-guide.md](066-design-system-v2-migration-guide.md) - Step-by-step component migration
- [067-design-system-v2-style-guide.md](067-design-system-v2-style-guide.md) - Visual reference and usage
- [068-design-system-v2-summary.md](068-design-system-v2-summary.md) - Quick onboarding overview
- [069-container-max-width-tokens.md](069-container-max-width-tokens.md) - Container width token system
- [071-mixin-library-guide.md](071-mixin-library-guide.md) - SCSS mixin patterns
