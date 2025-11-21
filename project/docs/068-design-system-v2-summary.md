# Design System v2.0 - Complete Package

## What Changed?

We've redesigned ClearSkies from a generic purple/blue modern web app aesthetic to an **intentional medieval fantasy theme** with warm, earthy tones.

### Visual Transformation

**Before (v1):**
- 🟣 Purple gradients everywhere
- 🔵 Blue backgrounds and accents
- ✨ Modern, futuristic feel
- 🎨 Generic AI-generated aesthetic

**After (v2):**
- 🟤 Warm browns and charcoals
- 🥉 Bronze primary accents
- 🥇 Gold for important elements (used sparingly)
- 🏰 Medieval fantasy game aesthetic

---

## File Overview

### 1. **design-tokens.scss** (Main File)
**Location:** `ui/src/design-tokens.scss`

**What it is:** The complete design system with 400+ design tokens

**Key Sections:**
- Medieval Fantasy Color Palette (bronze, gold, iron, warm browns)
- Spacing System (4px base unit, 10 levels)
- Typography (font sizes, weights, line heights)
- Shadows (standard + glow effects)
- Gradients (use sparingly)
- Component-specific tokens (buttons, cards, inputs, modals)
- Custom scrollbar styling

**Usage:**
```scss
@import '../../design-tokens.scss';

.my-component {
  background: var(--color-bg-secondary);
  border: var(--border-bronze);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-glow-bronze);
}
```

---

### 2. **Migration Guide** (Step-by-Step)
**Location:** `project/docs/060-design-system-v2-migration-guide.md`

**What it is:** Comprehensive guide for migrating existing components to the new design system

**Contents:**
- Color/gradient/shadow/spacing migration maps
- Component-by-component migration examples
- Common patterns and anti-patterns
- Priority migration order
- Testing checklist
- Validation commands

**When to use:** Reference this when updating any component SCSS file

**Quick Example:**
```scss
// BEFORE
.button {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed); // Purple
  padding: 1.5rem; // Hardcoded
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); // Hardcoded
}

// AFTER
.button {
  background: var(--gradient-button-primary); // Bronze
  padding: var(--spacing-2xl); // Token
  box-shadow: var(--shadow-glow-bronze); // Token
}
```

---

### 3. **Style Guide** (Visual Reference)
**Location:** `project/docs/061-design-system-v2-style-guide.md`

**What it is:** Visual documentation of all colors, typography, spacing, shadows, and components

**Contents:**
- Complete color palette with hex values
- Typography scale and font families
- Spacing system reference
- Shadow catalog
- Gradient examples
- Component-specific token reference
- Usage guidelines ("When to use bronze vs. gold")
- Accessibility considerations
- Real-world component examples

**When to use:** Reference when choosing colors or designing new components

---

### 4. **Audit Script** (Automated Detection)
**Location:** `project/utils/audit-design-tokens.js`

**What it is:** Node.js script that scans all component SCSS files for issues

**Detects:**
- Hardcoded hex colors (`#8b5cf6`, `#ffd700`)
- Hardcoded spacing (`1rem`, `20px`)
- Undefined tokens (`var(--color-accent-gold)`)
- Hardcoded gradients (purple/gold gradients)

**Usage:**
```bash
cd project/utils
node audit-design-tokens.js
```

**Output:**
- Summary of total issues
- File-by-file breakdown
- Line numbers and context
- Migration priority ranking

**When to use:** Before and after migrating components to verify completeness

---

## Quick Start Guide

### For New Components

When creating a new component, use design tokens exclusively:

```scss
.my-new-component {
  // Backgrounds
  background: var(--color-bg-secondary);

  // Borders
  border: var(--border-bronze);
  border-radius: var(--radius-card);

  // Spacing
  padding: var(--card-padding);
  gap: var(--spacing-l);
  margin-bottom: var(--spacing-section-gap);

  // Typography
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);

  // Shadows
  box-shadow: var(--card-shadow);

  // Transitions
  transition: all var(--transition-interactive);

  &:hover {
    background: var(--color-bg-hover);
    box-shadow: var(--shadow-glow-bronze);
  }
}
```

### For Existing Components

1. **Run audit script** to identify issues in your component
2. **Open migration guide** to reference migration patterns
3. **Update SCSS file** to replace hardcoded values with tokens
4. **Test in browser** to verify visual appearance
5. **Run audit again** to confirm all issues resolved

---

## Color Usage Guidelines

### Bronze (Primary Accent)
**Use for:**
- Primary buttons
- Interactive borders
- Hover states
- Active elements
- Accent highlights

**Tokens:**
```scss
--color-bronze
--color-bronze-light (hover)
--color-bronze-dark (active)
--gradient-bronze
--shadow-glow-bronze
```

### Gold (Secondary Accent - Use Sparingly!)
**Use for:**
- Currency displays
- Quest rewards
- Achievement badges
- Important notifications
- Special item highlights

**NOT for:**
- Every heading
- Default borders
- Standard buttons

**Tokens:**
```scss
--color-gold
--gradient-gold
--shadow-glow-gold
```

### When to Use Gradients
**Yes:**
- Health/mana/XP bars (always)
- Primary action buttons (optional)
- Special emphasis elements

**No:**
- Background surfaces (use solid colors)
- Every panel or card
- Standard borders

---

## Spacing Reference

Quick reference for common spacing needs:

| Need | Token | Value |
|------|-------|-------|
| Inline gaps (icons, labels) | `--spacing-m` | 12px |
| Component padding | `--spacing-l` | 16px |
| Section padding | `--spacing-xl` | 20px |
| Card padding | `--spacing-xl` | 20px |
| Stack gaps (vertical) | `--spacing-l` | 16px |
| Section gaps (large) | `--spacing-3xl` | 32px |
| Button padding | `--spacing-m --spacing-xl` | 12px 20px |

---

## Migration Priority

Based on audit results, migrate in this order:

### High Priority (Visual Impact)
1. Combat component (damage colors)
2. Ability button (purple gradients)
3. Inventory (slider gradient)
4. Game component (quest journal gold)
5. Bank (action button gradients)

### Medium Priority (Consistency)
6. Chat (undefined tokens)
7. Equipment (spacing standardization)
8. Skills (gradient review)
9. Crafting (spacing standardization)
10. Location (gradient review)

### Low Priority (Polish)
11. Shared components (item-mini, buff-icon, etc.)
12. Utility components
13. Modal/tooltip refinements

---

## Validation Workflow

### Before Committing Changes

1. **Visual Test:**
   - Open component in browser
   - Verify colors match medieval fantasy theme
   - Check contrast and readability
   - Test hover/active states

2. **Code Audit:**
   ```bash
   node project/utils/audit-design-tokens.js
   ```
   - Verify no hardcoded values remain
   - Check for undefined token usage
   - Confirm spacing consistency

3. **Accessibility Check:**
   - Verify text contrast (DevTools)
   - Test keyboard navigation
   - Confirm focus indicators visible

---

## Common Pitfalls

### ❌ Don't Do This

```scss
// Using old purple gradients
background: linear-gradient(135deg, #8b5cf6, #7c3aed);

// Hardcoded spacing
padding: 1.5rem;
gap: 20px;

// Using undefined tokens
border: var(--color-accent-gold);

// Gold everywhere
.heading { color: var(--color-gold); }
.subheading { color: var(--color-gold); }
.label { color: var(--color-gold); }
```

### ✅ Do This Instead

```scss
// Use bronze gradients (or solid colors)
background: var(--gradient-button-primary);
// OR
background: var(--color-bronze);

// Use spacing tokens
padding: var(--spacing-2xl);
gap: var(--spacing-xl);

// Use correct defined tokens
border: var(--border-gold);

// Use gold sparingly
.quest-reward { color: var(--color-gold); } // Important element
.heading { color: var(--color-text-primary); } // Normal text
.subheading { color: var(--color-text-secondary); }
.label { color: var(--color-text-bronze); } // Bronze for accents
```

---

## Integration with CLAUDE.md

The design system is now documented in CLAUDE.md for AI-assisted development:

- **Design token reference** in Quick File Reference section
- **Migration guide link** in Documentation section
- **Style guide link** in Visual Design section
- **Audit script location** in Utility Scripts section

When requesting AI help with styling:
- Reference the migration guide for patterns
- Use the style guide for color selection
- Run the audit script to verify changes

---

## Changelog

### v2.0 (Current)
- Complete medieval fantasy color palette
- Bronze/gold accent system
- Warm brown backgrounds
- Comprehensive spacing system
- Component-specific semantic tokens
- Custom scrollbar styling
- Migration guide and style guide
- Automated audit tooling

### v1.0 (Legacy)
- Purple/blue modern theme
- Limited token coverage
- Inconsistent spacing
- Many hardcoded values

---

## Next Steps

1. **Immediate:** Run audit script to see current state
   ```bash
   cd project/utils && node audit-design-tokens.js
   ```

2. **Short-term:** Migrate top 5 priority components
   - Follow migration guide patterns
   - Test each component after changes
   - Verify with audit script

3. **Long-term:** Complete full migration
   - All components use design tokens
   - Zero hardcoded values
   - Consistent medieval fantasy aesthetic
   - Updated screenshots/documentation

---

## Resources

- **Main Design Tokens:** `ui/src/design-tokens.scss`
- **Migration Guide:** `project/docs/060-design-system-v2-migration-guide.md`
- **Style Guide:** `project/docs/061-design-system-v2-style-guide.md`
- **Audit Script:** `project/utils/audit-design-tokens.js`
- **CLAUDE.md:** References to all design system documentation

## Support

If you have questions about:
- **Which token to use:** Check style guide usage guidelines
- **How to migrate:** Follow migration guide examples
- **What needs fixing:** Run audit script

---

**Design System v2.0 - Building a Medieval Fantasy Experience** 🏰
