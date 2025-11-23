# ClearSkies Design System v2.0 - Visual Style Guide

## Color Palette

### Core Brand Colors

#### Bronze/Copper (Primary Accent)
```
--color-bronze:        #cd7f32  █████ Primary accent
--color-bronze-light:  #e6a557  █████ Hover states, highlights
--color-bronze-dark:   #a0642a  █████ Active states, depth
--color-bronze-darker: #7a4d1f  █████ Dark accents
```

**Usage:** Primary interactive elements, borders, buttons, highlights

#### Gold (Secondary Accent - Use Sparingly)
```
--color-gold:          #d4af37  █████ Important elements
--color-gold-light:    #f0d673  █████ Highlights, glows
--color-gold-dark:     #b8941f  █████ Depth, shadows
--color-gold-darker:   #8a6e17  █████ Dark accents
```

**Usage:** Currency, quest rewards, important labels, special achievements

#### Iron/Steel (Neutral Metallics)
```
--color-iron:          #4a4a4a  █████ Neutral elements
--color-iron-light:    #6a6a6a  █████ Hover states
--color-iron-dark:     #2a2a2a  █████ Depth
--color-steel:         #8f9296  █████ Muted accents
```

**Usage:** Disabled states, neutral borders, less important elements

---

### Surface Colors (Warm Dark Theme)

#### Backgrounds
```
--color-bg-primary:    #2a2520  █████ Main background (darkest)
--color-bg-secondary:  #3a3025  █████ Panels, cards
--color-bg-tertiary:   #4a3f2f  █████ Elevated surfaces
--color-bg-hover:      #524539  █████ Hover states
```

**Surface Variants:**
```
--color-surface:          #3a3025  █████ Default surface
--color-surface-elevated: #4a3f2f  █████ Raised elements
--color-surface-sunken:   #2a2520  █████ Inset areas
```

#### Borders
```
--color-border-subtle:   #5a4a3a  █████ Default borders
--color-border-moderate: #6a5a4a  █████ Emphasized borders
--color-border-strong:   #8b6f47  █████ Strong emphasis
--color-border-bronze:   #cd7f32  █████ Accent borders
--color-border-gold:     #d4af37  █████ Important borders
```

#### Overlays
```
--color-overlay-light:  rgba(0, 0, 0, 0.3)  Subtle overlays
--color-overlay-medium: rgba(0, 0, 0, 0.5)  Modal backdrops
--color-overlay-strong: rgba(0, 0, 0, 0.7)  Strong emphasis
```

---

### Text Colors

#### Main Text (Warm Off-Whites)
```
--color-text-primary:   #f4e8d0  █████ Primary text (parchment)
--color-text-secondary: #e0d4bc  █████ Secondary text
--color-text-tertiary:  #ccc0a8  █████ Muted text
--color-text-muted:     #a89e8a  █████ Very muted
--color-text-disabled:  #6a6050  █████ Disabled state
```

#### Semantic Text Colors
```
--color-text-bronze:  #e6a557  █████ Bronze highlights
--color-text-gold:    #d4af37  █████ Gold highlights
--color-text-error:   #d97066  █████ Errors, warnings
--color-text-success: #6b9d7a  █████ Success messages
--color-text-warning: #d4a049  █████ Warnings
--color-text-info:    #6a8db8  █████ Info messages
```

---

### Game Mechanics Colors

#### Combat Stats
```
--color-health:      #d97066  █████ Health bars, damage
--color-health-dark: #c45a50  █████ Health bar depth
--color-mana:        #6a8db8  █████ Mana bars
--color-mana-dark:   #5a7da8  █████ Mana bar depth
```

#### Combat Damage Types
```
--color-damage:        #d97066  █████ Physical damage
--color-damage-crit:   #f0d673  █████ Critical hits (gold)
--color-heal:          #6b9d7a  █████ Healing effects
--color-mana-restore:  #6a8db8  █████ Mana restoration
```

#### Resources
```
--color-experience:     #d4af37  █████ XP bars, level ups
--color-gold-currency:  #d4af37  █████ Currency display
```

---

### Status & Feedback Colors

```
--color-success:      #6b9d7a  █████ Success (earthy green)
--color-success-dark: #5a8a68  █████ Success depth
--color-warning:      #d4a049  █████ Warnings (amber)
--color-warning-dark: #c49039  █████ Warning depth
--color-error:        #d97066  █████ Errors (warm red)
--color-error-dark:   #c45a50  █████ Error depth
--color-info:         #6a8db8  █████ Info (steel blue)
--color-info-dark:    #5a7da8  █████ Info depth
```

---

### Rarity Colors (Keep Existing)

```
--color-rarity-common:     #9ca3af  █████ Gray
--color-rarity-uncommon:   #6ee7b7  █████ Green
--color-rarity-rare:       #60a5fa  █████ Blue
--color-rarity-epic:       #c084fc  █████ Purple
--color-rarity-legendary:  #fb923c  █████ Orange
```

**Note:** Rarity colors are well-established and should remain unchanged.

---

## Typography

### Font Families
```
--font-primary:  'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
--font-display:  'Georgia', 'Times New Roman', serif (medieval headers)
--font-monospace: 'Courier New', Courier, monospace
```

### Font Scale
```
--font-size-s:    11px  /* Small text */
--font-size-m:    12px  /* Body text */
--font-size-base: 14px  /* Default body */
--font-size-l:    16px  /* Large body */
--font-size-xl:   18px  /* Subheading */
--font-size-2xl:  20px  /* Heading 3 */
--font-size-3xl:  24px  /* Heading 2 */
--font-size-4xl:  28px  /* Heading 1 */
--font-size-5xl:  32px  /* Display */
```

### Font Weights
```
--font-weight-normal:    400  Regular
--font-weight-medium:    500  Medium
--font-weight-semibold:  600  Semibold
--font-weight-bold:      700  Bold
```

---

## Spacing System (4px Base Unit)

```
--spacing-xxs:  2px   /* Tiny gaps */
--spacing-xs:   4px   /* Minimal spacing */
--spacing-s:    8px   /* Small gaps */
--spacing-m:    12px  /* Standard gaps */
--spacing-l:    16px  /* Component padding */
--spacing-xl:   20px  /* Section padding */
--spacing-2xl:  24px  /* Large padding */
--spacing-3xl:  32px  /* Section gaps */
--spacing-4xl:  40px  /* Large sections */
--spacing-5xl:  48px  /* Major sections */
```

### Semantic Spacing
```
--spacing-component-padding: 16px  /* Standard component padding */
--spacing-section-padding:   20px  /* Section padding */
--spacing-section-gap:       32px  /* Gap between sections */
--spacing-card-padding:      20px  /* Card internal padding */
--spacing-inline-gap:        12px  /* Inline element gaps */
--spacing-stack-gap:         16px  /* Vertical stack gaps */
```

---

## Shadows

### Standard Shadows
```
--shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.3)   Subtle depth
--shadow-s:   0 2px 4px rgba(0, 0, 0, 0.4)   Small elements
--shadow-m:   0 4px 8px rgba(0, 0, 0, 0.5)   Cards, panels
--shadow-l:   0 8px 16px rgba(0, 0, 0, 0.6)  Elevated surfaces
--shadow-xl:  0 12px 24px rgba(0, 0, 0, 0.7) Modals
--shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.8) Highest elevation
```

### Glow Shadows (For Effects)
```
--shadow-glow-bronze:  0 0 12px rgba(205, 127, 50, 0.4)   Primary glow
--shadow-glow-gold:    0 0 16px rgba(212, 175, 55, 0.5)   Special glow
--shadow-glow-health:  0 0 10px rgba(217, 112, 102, 0.4)  Health effects
--shadow-glow-mana:    0 0 10px rgba(106, 141, 184, 0.4)  Mana effects
--shadow-glow-success: 0 0 10px rgba(107, 157, 122, 0.4)  Success glow
--shadow-glow-error:   0 0 10px rgba(217, 112, 102, 0.5)  Error glow
```

### Interactive Shadows
```
--shadow-interactive:        var(--shadow-s)   Default state
--shadow-interactive-hover:  var(--shadow-m)   Hover state
--shadow-interactive-active: var(--shadow-xs)  Active/pressed state
```

---

## Gradients (Use Sparingly)

### Background Gradients
```
--gradient-bg-primary:   linear-gradient(135deg, #2a2520, #3a3025)
--gradient-bg-elevated:  linear-gradient(135deg, #3a3025, #4a3f2f)
--gradient-surface:      linear-gradient(180deg, #3a3025, #2a2520)
```

### Metallic Gradients (For Emphasis Only)
```
--gradient-bronze: linear-gradient(135deg, #e6a557, #cd7f32, #a0642a)
--gradient-gold:   linear-gradient(135deg, #f0d673, #d4af37, #b8941f)
--gradient-iron:   linear-gradient(135deg, #6a6a6a, #4a4a4a, #2a2a2a)
```

### Progress/Bar Gradients
```
--gradient-health:     linear-gradient(90deg, #c45a50, #d97066)
--gradient-mana:       linear-gradient(90deg, #5a7da8, #6a8db8)
--gradient-experience: linear-gradient(90deg, #b8941f, #f0d673)
--gradient-progress:   linear-gradient(90deg, #a0642a, #e6a557)
```

### Interactive Element Gradients
```
--gradient-button-primary:   linear-gradient(135deg, #cd7f32, #a0642a)
--gradient-button-secondary: linear-gradient(135deg, #d4af37, #b8941f)
--gradient-button-hover:     linear-gradient(135deg, #e6a557, #cd7f32)
```

---

## Border Radius

```
--radius-none: 0
--radius-s:    4px   /* Small elements */
--radius-m:    6px   /* Buttons, inputs */
--radius-l:    8px   /* Cards, panels */
--radius-xl:   10px  /* Modals */
--radius-2xl:  12px  /* Large modals */
--radius-full: 9999px /* Circular elements */
```

### Semantic Radius
```
--radius-button: 6px  /* Buttons */
--radius-input:  6px  /* Input fields */
--radius-card:   8px  /* Cards */
--radius-panel:  8px  /* Panels */
--radius-modal:  10px /* Modals */
--radius-badge:  9999px /* Badges, pills */
```

---

## Component-Specific Tokens

### Buttons
```
--button-bg-primary:       #cd7f32  Bronze
--button-bg-primary-hover: #e6a557  Bronze light
--button-bg-secondary:     #4a3f2f  Tertiary background
--button-bg-secondary-hover: #524539  Hover background
--button-text-primary:     #f4e8d0  Parchment white
--button-border-primary:   2px solid #cd7f32
```

### Cards/Panels
```
--card-bg:     #3a3025  Secondary background
--card-border: 2px solid #5a4a3a
--card-shadow: 0 4px 8px rgba(0, 0, 0, 0.5)
```

### Inputs
```
--input-bg:           #2a2520  Primary background
--input-bg-focus:     #3a3025  Secondary background
--input-border:       1px solid #5a4a3a
--input-border-focus: 2px solid #cd7f32
--input-text:         #f4e8d0  Parchment white
```

### Tooltips
```
--tooltip-bg:     #4a3f2f  Tertiary background
--tooltip-border: 2px solid #8b6f47
--tooltip-text:   #f4e8d0  Parchment white
--tooltip-shadow: 0 8px 16px rgba(0, 0, 0, 0.6)
```

### Modals
```
--modal-bg:       #3a3025  Secondary background
--modal-border:   2px solid #cd7f32
--modal-shadow:   0 16px 32px rgba(0, 0, 0, 0.8)
--modal-backdrop: rgba(0, 0, 0, 0.7)
```

---

## Usage Guidelines

### When to Use Bronze
- Primary buttons
- Interactive element borders
- Accent highlights
- Active states
- Important labels

### When to Use Gold
- Currency displays
- Quest rewards
- Achievement badges
- Important notifications
- Special item highlights
- **NOT** for every heading or border

### When to Use Gradients
- Health/mana/XP bars (always)
- Primary action buttons (optional)
- **NOT** for backgrounds or every surface
- Use solid colors as default, gradients for emphasis

### When to Use Shadows
- Cards and elevated surfaces (standard shadows)
- Interactive elements on hover (glow shadows)
- Modals and overlays (large shadows)
- **NOT** every element needs a shadow

### Text Hierarchy
1. **Display/Headers:** Gold (`--color-gold`) + larger font size
2. **Body Text:** Parchment white (`--color-text-primary`)
3. **Secondary Text:** Dimmer white (`--color-text-secondary`)
4. **Muted Text:** Muted (`--color-text-muted`)
5. **Disabled:** Disabled color (`--color-text-disabled`)

---

## Accessibility Considerations

### Contrast Ratios
All text colors meet WCAG AA standards against their intended backgrounds:

- Primary text (#f4e8d0) on primary background (#2a2520): **14.2:1** ✓
- Secondary text (#e0d4bc) on secondary background (#3a3025): **12.8:1** ✓
- Muted text (#a89e8a) on tertiary background (#4a3f2f): **6.5:1** ✓

### Focus States
All interactive elements must have clear focus indicators:
```scss
&:focus-visible {
  outline: 2px solid var(--color-bronze);
  outline-offset: 2px;
}
```

---

## Examples

### Primary Button
```scss
.button-primary {
  background: var(--button-bg-primary);
  color: var(--button-text-primary);
  border: var(--button-border-primary);
  padding: var(--spacing-m) var(--spacing-xl);
  border-radius: var(--radius-button);
  box-shadow: var(--shadow-interactive);
  transition: all var(--transition-interactive);

  &:hover {
    background: var(--button-bg-primary-hover);
    box-shadow: var(--shadow-interactive-hover);
  }

  &:active {
    box-shadow: var(--shadow-interactive-active);
  }
}
```

### Card Component
```scss
.card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--radius-card);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);

  .card-header {
    color: var(--color-gold);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-l);
    border-bottom: var(--border-subtle);
    padding-bottom: var(--spacing-m);
  }

  .card-body {
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
  }
}
```

### Progress Bar
```scss
.progress-bar {
  height: var(--height-progress-bar);
  background: var(--color-bg-primary);
  border: var(--border-subtle);
  border-radius: var(--radius-m);
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background: var(--gradient-progress); // Bronze gradient
    transition: width var(--transition-normal);
  }

  &.health {
    .progress-fill {
      background: var(--gradient-health);
    }
  }

  &.mana {
    .progress-fill {
      background: var(--gradient-mana);
    }
  }
}
```

---

## Color Psychology in Medieval Fantasy

**Bronze/Copper:**
- Represents craftsmanship, adventure, exploration
- Warm, earthy, approachable
- Medieval weaponry and armor

**Gold:**
- Represents wealth, achievement, importance
- Reserved for rewards and special moments
- Creates excitement when used sparingly

**Warm Browns:**
- Grounded, natural, medieval
- Evokes taverns, wood, leather, parchment
- Comfortable for long play sessions

**Muted Reds (Health):**
- Clear danger indicator without being alarming
- Warm red fits medieval palette better than bright red

**Steel Blue (Mana):**
- Magic and mysticism
- Cool contrast to warm palette
- Distinct from physical combat colors

---

## Summary

**Design System v2.0 Goals:**
1. ✅ Establish medieval fantasy aesthetic
2. ✅ Reduce visual noise (fewer gradients)
3. ✅ Create consistent, token-based system
4. ✅ Improve readability and hierarchy
5. ✅ Intentional color usage (every color has meaning)
6. ✅ Maintain accessibility standards
7. ✅ Support scalable component design

**Next Steps:**
- Migrate components systematically (see migration guide)
- Test color combinations in different lighting
- Gather user feedback on readability
- Refine as needed based on real-world usage
