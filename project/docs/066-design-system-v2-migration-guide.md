# Design System v2.0 Migration Guide

## Overview

This guide helps migrate ClearSkies components from the old purple/blue gradient aesthetic to the new medieval fantasy design system with warm browns, bronzes, and golds.

## Design Philosophy

**Before (v1):**
- Purple and blue gradients everywhere
- Vibrant, futuristic colors
- Generic modern web app aesthetic

**After (v2):**
- Warm, earthy medieval palette (browns, bronzes, golds)
- Intentional color usage (not every surface needs gradients)
- Reduced visual noise, cleaner hierarchy
- Medieval fantasy game aesthetic

## Quick Reference Tables

### Color Migration Map

| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `--color-primary` (red) | `--color-bronze` | Primary accent color |
| `--color-secondary` (gold) | `--color-gold` | Secondary accent (use sparingly) |
| `--color-accent-purple` | `--color-bronze` or remove | Replace purple accents with bronze |
| `--color-accent-blue` | `--color-mana` or `--color-info` | Use for mana/magic only |
| `--color-bg-primary` (#1a1a2e blue) | `--color-bg-primary` (#2a2520 brown) | Main background |
| `--color-bg-secondary` (#16213e blue) | `--color-bg-secondary` (#3a3025 brown) | Secondary panels |
| `--color-text-primary` (white) | `--color-text-primary` (parchment #f4e8d0) | Main text |
| `#ffd700` (hardcoded gold) | `--color-gold` | Use token instead |
| `#ef4444` (hardcoded red) | `--color-damage` | Combat damage |
| `#fbbf24` (hardcoded amber) | `--color-damage-crit` | Critical hits |
| `#4ade80` (hardcoded green) | `--color-heal` | Healing |
| `#3b82f6` (hardcoded blue) | `--color-mana-restore` | Mana restore |

### Gradient Migration Map

| Old Gradient | New Gradient | Notes |
|--------------|--------------|-------|
| `--gradient-purple` | `--gradient-bronze` | Primary accent gradient |
| `--gradient-primary` (red) | `--gradient-bronze` or remove | Use bronze or solid colors |
| `--gradient-secondary` (gold) | `--gradient-gold` | Use sparingly |
| `linear-gradient(135deg, #8b5cf6, #7c3aed)` | `--gradient-bronze` | Replace hardcoded purple |
| `linear-gradient(135deg, #ffd700, #ffed4e)` | `--gradient-gold` | Use token |
| Background gradients | Remove or use `--gradient-bg-primary` | Reduce gradient usage overall |

### Shadow Migration Map

| Old Shadow | New Shadow | Notes |
|------------|------------|-------|
| `0 0 10px rgba(102, 126, 234, 0.3)` | `--shadow-glow-bronze` | Purple glow → bronze glow |
| `0 0 10px rgba(255, 215, 0, 0.5)` | `--shadow-glow-gold` | Use token |
| `0 4px 12px rgba(...)` | `--shadow-m` | Use standard shadow token |

### Spacing Migration Map

| Old Unit | New Token | Notes |
|----------|-----------|-------|
| `1rem` (16px) | `var(--spacing-l)` | Component padding |
| `1.5rem` (24px) | `var(--spacing-2xl)` | Large padding |
| `0.75rem` (12px) | `var(--spacing-m)` | Standard gaps |
| `0.5rem` (8px) | `var(--spacing-s)` | Small gaps |
| `20px` | `var(--spacing-xl)` | Section padding |
| Hardcoded `px` values | Use `--spacing-*` tokens | Consistency |

## Migration Steps by Component

### 1. Combat Component (`combat.component.scss`)

**Issues:**
- Hardcoded damage colors (`#ef4444`, `#fbbf24`, `#4ade80`, `#3b82f6`)

**Fix:**
```scss
// BEFORE
.damage-float {
  &.physical { color: #ef4444; }
  &.crit { color: #fbbf24; }
  &.heal { color: #4ade80; }
  &.mana { color: #3b82f6; }
}

// AFTER
.damage-float {
  &.physical { color: var(--color-damage); }
  &.crit { color: var(--color-damage-crit); }
  &.heal { color: var(--color-heal); }
  &.mana { color: var(--color-mana-restore); }
}
```

### 2. Ability Button Component (`ability-button.component.scss`)

**Issues:**
- Hardcoded purple gradients
- Hardcoded shadows
- Hardcoded font sizes
- Undefined `--color-border` token

**Fix:**
```scss
// BEFORE
.ability-button {
  border: 2px solid var(--color-border); // UNDEFINED
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); // HARDCODED
  font-size: 24px; // HARDCODED

  &.on-cooldown {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed); // HARDCODED
  }
}

// AFTER
.ability-button {
  border: var(--border-default); // OR var(--border-bronze) for emphasis
  box-shadow: var(--shadow-glow-bronze);
  font-size: var(--font-size-3xl);

  &.on-cooldown {
    background: var(--gradient-bronze);
    opacity: var(--opacity-muted);
  }
}
```

### 3. Inventory Component (`inventory.component.scss`)

**Issues:**
- Hardcoded purple slider gradient
- Mixed spacing units (`rem` vs tokens)

**Fix:**
```scss
// BEFORE
input[type="range"] {
  &::-webkit-slider-thumb {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed); // HARDCODED
  }
}

.inventory-header {
  padding: 1.5rem; // HARDCODED
  gap: 1rem; // HARDCODED
}

// AFTER
input[type="range"] {
  &::-webkit-slider-thumb {
    background: var(--gradient-slider-thumb); // Uses --gradient-bronze
  }
}

.inventory-header {
  padding: var(--spacing-2xl);
  gap: var(--spacing-l);
}
```

### 4. Game Component (`game.component.scss`)

**Issues:**
- Quest journal uses hardcoded gold (`#ffd700`)
- Mixed `--color-accent-gold` (undefined) and `--color-secondary`

**Fix:**
```scss
// BEFORE
.quest-journal {
  border: 3px solid #ffd700; // HARDCODED
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); // HARDCODED
}

.quest-title {
  color: var(--color-accent-gold); // UNDEFINED
}

// AFTER
.quest-journal {
  border: var(--border-gold);
  box-shadow: var(--shadow-glow-gold);
}

.quest-title {
  color: var(--color-gold); // Use defined token
}
```

### 5. Bank Component (`bank.component.scss`)

**Issues:**
- Hardcoded gold gradients in action buttons
- Hardcoded pixel spacing

**Fix:**
```scss
// BEFORE
.bank-action-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); // HARDCODED
  padding: 12px 24px; // HARDCODED
}

// AFTER
.bank-action-primary {
  background: var(--gradient-button-secondary); // Gold gradient for primary actions
  padding: var(--spacing-m) var(--spacing-2xl);
}
```

### 6. Chat Component (`chat.component.scss`)

**Issues:**
- Undefined `--color-border-primary` token
- Undefined `--shadow-overlay` token

**Fix:**
```scss
// BEFORE
.chat-container {
  border: var(--color-border-primary); // UNDEFINED
  box-shadow: var(--shadow-overlay); // UNDEFINED (but now defined in v2)
}

// AFTER
.chat-container {
  border: var(--border-default); // OR --border-bronze for emphasis
  box-shadow: var(--shadow-overlay); // Now defined in v2
}
```

## General Migration Patterns

### Pattern 1: Remove Gradients from Non-Essential Elements

**Before:**
```scss
.panel-header {
  background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary));
}
```

**After (prefer solid colors):**
```scss
.panel-header {
  background: var(--color-bg-secondary);
  border-bottom: var(--border-subtle); // Add subtle border instead
}
```

### Pattern 2: Replace Hardcoded Colors with Tokens

**Before:**
```scss
.status-indicator {
  color: #fbbf24;
  border: 2px solid #8b5cf6;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}
```

**After:**
```scss
.status-indicator {
  color: var(--color-gold);
  border: var(--border-bronze);
  box-shadow: var(--shadow-glow-bronze);
}
```

### Pattern 3: Standardize Spacing

**Before:**
```scss
.component {
  padding: 20px;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
```

**After:**
```scss
.component {
  padding: var(--spacing-xl); // 20px
  gap: var(--spacing-l);       // 16px
  margin-bottom: var(--spacing-2xl); // 24px
}
```

### Pattern 4: Replace Purple with Bronze

**Before (purple accent):**
```scss
.button-primary {
  background: var(--color-accent-purple);
  border: 2px solid var(--color-accent-purple-dark);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);

  &:hover {
    background: var(--gradient-purple);
  }
}
```

**After (bronze accent):**
```scss
.button-primary {
  background: var(--color-bronze);
  border: var(--border-bronze);
  box-shadow: var(--shadow-glow-bronze);

  &:hover {
    background: var(--color-bronze-light);
  }
}
```

### Pattern 5: Use Semantic Component Tokens

**Before:**
```scss
.modal {
  background: #16213e;
  border: 2px solid #4a4a6a;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.5);
}
```

**After:**
```scss
.modal {
  background: var(--modal-bg);
  border: var(--modal-border);
  box-shadow: var(--modal-shadow);
}
```

## Priority Migration Order

### High Priority (Visual Impact + Consistency)
1. **Combat Component** - Fix damage float colors
2. **Ability Button** - Fix purple gradients and undefined tokens
3. **Inventory Component** - Fix slider gradient
4. **Game Component** - Fix quest journal gold colors
5. **Bank Component** - Fix action button gradients

### Medium Priority (Consistency)
6. **Chat Component** - Fix undefined tokens
7. **Equipment Component** - Standardize spacing
8. **Skills Component** - Review gradient usage
9. **Crafting Component** - Standardize spacing
10. **Location Component** - Review gradient usage

### Low Priority (Polish)
11. All other shared components
12. Utility components (item-mini, buff-icon, etc.)
13. Modal/tooltip styling refinement

## Testing Checklist

After migrating a component, verify:

- [ ] No hardcoded hex colors (search for `#` in SCSS)
- [ ] No hardcoded `rem`/`px` spacing (use `var(--spacing-*)`)
- [ ] No hardcoded shadows (use `var(--shadow-*)`)
- [ ] No undefined token references (check browser console for CSS warnings)
- [ ] Visual consistency with medieval fantasy theme
- [ ] Gradients used sparingly (only for emphasis)
- [ ] Bronze replaces purple for primary accents
- [ ] Gold used sparingly for important elements only

## Common Mistakes to Avoid

1. **Don't blindly replace all colors** - Consider if gradient is needed at all
2. **Don't use gold everywhere** - It's meant for important elements only (quest rewards, currency, etc.)
3. **Don't forget spacing tokens** - Replace ALL `rem`/`px` with tokens
4. **Don't create new hardcoded values** - Always use existing tokens
5. **Don't remove all gradients** - Progress bars, health/mana bars should keep gradients

## Validation Commands

```bash
# Search for hardcoded colors
grep -r "#[0-9a-fA-F]\{6\}" ui/src/app/components --include="*.scss"

# Search for hardcoded spacing
grep -r "[0-9]\+px\|[0-9]\+rem" ui/src/app/components --include="*.scss"

# Search for undefined token usage
grep -r "var(--color-accent-gold)" ui/src/app/components --include="*.scss"
grep -r "var(--color-border-primary)" ui/src/app/components --include="*.scss"
grep -r "var(--color-border)" ui/src/app/components --include="*.scss" | grep -v "border-"
```

## New Token Reference Sheet

### When to Use Each Token

| Scenario | Token to Use |
|----------|--------------|
| Primary accent (buttons, highlights) | `--color-bronze` |
| Secondary accent (rewards, currency) | `--color-gold` |
| Borders (default) | `--border-default` |
| Borders (emphasis) | `--border-bronze` or `--border-strong` |
| Health bars | `--gradient-health` |
| Mana bars | `--gradient-mana` |
| XP/progress bars | `--gradient-experience` or `--gradient-progress` |
| Damage numbers | `--color-damage` |
| Critical hits | `--color-damage-crit` |
| Healing | `--color-heal` |
| Success messages | `--color-success` |
| Error messages | `--color-error` |
| Card backgrounds | `--card-bg` |
| Modal backgrounds | `--modal-bg` |
| Button backgrounds (primary) | `--button-bg-primary` |
| Component padding | `--spacing-component-padding` (16px) |
| Section gaps | `--spacing-section-gap` (32px) |

## Example: Complete Component Migration

**Before (`example.component.scss`):**
```scss
.example-container {
  background: linear-gradient(135deg, #16213e, #0f3460);
  border: 2px solid #4a4a6a;
  padding: 1.5rem;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  .header {
    color: #ffd700;
    font-size: 20px;
    border-bottom: 2px solid #667eea;
  }

  .button-primary {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);

    &:hover {
      box-shadow: 0 0 15px rgba(102, 126, 234, 0.7);
    }
  }

  .status-bar {
    background: #1a1a2e;
    border: 1px solid #3d3d5c;
    height: 24px;

    .fill {
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
  }
}
```

**After (`example.component.scss`):**
```scss
.example-container {
  background: var(--card-bg); // Solid color instead of gradient
  border: var(--card-border);
  padding: var(--spacing-2xl);
  gap: var(--spacing-l);
  box-shadow: var(--card-shadow);

  .header {
    color: var(--color-gold);
    font-size: var(--font-size-2xl);
    border-bottom: var(--border-bronze); // Bronze instead of purple
  }

  .button-primary {
    background: var(--gradient-button-primary); // Bronze gradient
    padding: var(--spacing-m) var(--spacing-2xl);
    border-radius: var(--radius-button);
    box-shadow: var(--shadow-glow-bronze);
    transition: box-shadow var(--transition-fast);

    &:hover {
      box-shadow: var(--shadow-glow-gold); // Gold glow on hover
    }
  }

  .status-bar {
    background: var(--color-bg-primary);
    border: var(--border-subtle);
    height: var(--height-progress-bar);

    .fill {
      background: var(--gradient-progress); // Bronze gradient for progress
    }
  }
}
```

## Summary

**Key Changes in Design System v2.0:**
- Medieval fantasy color palette (browns, bronzes, golds)
- Reduced gradient usage (intentional, not everywhere)
- Warm, earthy backgrounds instead of blue tones
- Bronze primary accent instead of purple
- Gold secondary accent (use sparingly)
- Comprehensive token coverage (no hardcoded values needed)
- Component-specific semantic tokens for consistency
- Improved scrollbar styling

**Migration Philosophy:**
- Less is more (remove unnecessary gradients)
- Token-first approach (no hardcoded values)
- Intentional color usage (every color has meaning)
- Clean hierarchy (typography + spacing > gradients)
- Medieval aesthetic (warm, earthy, readable)
