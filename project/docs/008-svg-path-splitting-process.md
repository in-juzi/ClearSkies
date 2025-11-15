# SVG Path Splitting Process with Semantic Channels

## Overview

This document describes the process for splitting single-path SVG icons into multiple paths with semantic `data-channel` attributes for use in the ClearSkies game's item category icons.

## Purpose

The `data-channel` attribute allows different parts of an icon to be styled or colored independently, enabling:
- Dynamic recoloring based on item quality/rarity
- Material-specific colorization (e.g., bronze vs iron axes)
- Visual effects and animations on specific parts
- Theme customization

## Process

### 1. Identify Subpaths

SVG path data uses the `M` (move) command to start new subpaths. Each `M` command indicates a distinct, disconnected shape.

**Important:** Subpaths can use either:
- `M` (uppercase) - Absolute move to coordinates
- `m` (lowercase) - Relative move from previous position

When splitting paths with lowercase `m` commands, the paths must either:
1. Be converted to absolute coordinates first (recommended)
2. Keep the relative `m` commands intact (may not render correctly as separate paths)

**Example:**
```svg
<path d="M10 10 L20 20 M30 30 L40 40 M50 50 L60 60" />
```

This contains 3 subpaths:
1. `M10 10 L20 20`
2. `M30 30 L40 40`
3. `M50 50 L60 60`

### 2. Split into Separate Paths

Each subpath becomes its own `<path>` element:

```svg
<path d="M10 10 L20 20" />
<path d="M30 30 L40 40" />
<path d="M50 50 L60 60" />
```

### 3. Analyze Visual Structure

For each subpath, determine what part of the icon it represents by:

1. **Visual inspection**: Look at the rendered SVG to see which part each path draws
2. **Coordinate analysis**: Higher Y values = lower on screen, lower Y values = higher
3. **Path complexity**: More complex paths often represent main features, simpler paths may be details
4. **Logical grouping**: Consider how parts relate (handle vs blade, head vs shaft, etc.)

### 4. Assign Semantic Channels

Based on the icon type, assign appropriate `data-channel` values:

#### Weapon Icons (Axes, Swords, etc.)

Common channels:
- `blade` - The cutting edge or main weapon head
- `edge` - Sharpened edge highlights or decorative elements
- `handle` - Grip, shaft, or haft
- `guard` - Crossguard, pommel, or protective elements
- `decoration` - Engravings, gems, or ornamental details

**Example (Axe):**
```svg
<!-- Axe head main body -->
<path fill="#fff" data-channel="blade"
    d="M335.031 129.063L262.376 235.28..." />

<!-- Sharpened edge highlight -->
<path fill="#fff" data-channel="edge"
    d="M449.376 195.093c-30.433 72.7..." />

<!-- Wooden handle -->
<path fill="#fff" data-channel="handle"
    d="M160.282 212.593c-39.7 79.313..." />
```

#### Tool Icons (Pickaxes, Hammers, etc.)

Common channels:
- `head` - Tool working end
- `handle` - Grip or shaft
- `detail` - Wear marks, binding, or decorative elements

#### Armor Icons (Helmets, Shields, etc.)

Common channels:
- `body` - Main armor surface
- `trim` - Decorative edges or borders
- `detail` - Rivets, engravings, or emblems
- `padding` - Visible inner lining or straps

#### Projectile Icons (Arrows, Bolts, etc.)

Common channels:
- `head` - Arrowhead or tip
- `shaft` - Arrow body
- `fletching` - Feathers or stabilizing fins
- `nock` - String notch area

### 5. Add Descriptive Comments

Include HTML comments above each path explaining:
- Physical location (e.g., "top left", "middle section")
- Visual purpose (e.g., "blade edge", "handle grip")
- Channel assignment reasoning

**Example:**
```svg
<!-- First subpath (top left part - blade top) -->
<path fill="#fff" data-channel="blade"
    d="M145.75 19.78 107.906 116..." />

<!-- Fifth subpath (axe handle - handle bottom) -->
<path fill="#fff" data-channel="handle"
    d="M160.282 212.593c-39.7 79.313..." />
```

### 6. Preserve Original Attributes

Maintain all original attributes from the source path:
- `fill` color
- `stroke` properties
- Any transformations or styles
- Namespace declarations

## Implementation Example: Axe Icon

### Original (Single Path)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z" />
    <path fill="#fff"
        d="M145.75 19.78 L107.906 116l43.03 31.938 48.814-96.97-54-31.187zm77.094 26.907L152.47 186.5l86.468 49.938 88.53-129.344-104.624-60.406z..." />
</svg>
```

### Split with Channels
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z" />

    <!-- First subpath (top left part - blade top) -->
    <path fill="#fff" data-channel="blade"
        d="M145.75 19.78 107.906 116l43.03 31.938 48.814-96.97-54-31.187z" />

    <!-- Second subpath (upper middle part - handle mid) -->
    <path fill="#fff" data-channel="handle"
        d="M222.844 46.687L152.47 186.5l86.468 49.938 88.53-129.344-104.624-60.406z" />

    <!-- Third subpath (axe head upper right - blade) -->
    <path fill="#fff" data-channel="blade"
        d="M335.031 129.063L262.376 235.28c17.46 28.874 29.09 63.707 35.375 103.126 56.317-31.27 107.836-85.753 135.28-152.75l-98-56.594z" />

    <!-- Fourth subpath (far right part - blade edge) -->
    <path fill="#fff" data-channel="edge"
        d="M449.376 195.093c-30.433 72.7-86.892 130.64-148.938 163.063 2.02 18.153 3.012 37.162 3 56.906 71.107-23.5 159.603-92.374 187.907-195.75l-41.97-24.218z" />

    <!-- Fifth subpath (axe handle - handle bottom) -->
    <path fill="#fff" data-channel="handle"
        d="M160.282 212.593c-39.7 79.313-78.154 159.572-137.905 237.157v44.78H66.72c41.425-87.972 93.64-170.09 145.53-251.936l-51.97-30z" />
</svg>
```

## Automation Scripts

### Recommended: Normalized Path Splitter

This script uses the `svgpath` npm package to convert relative coordinates to absolute before splitting, ensuring correct rendering:

**Location:** `project/utils/split-svg-paths-normalized.js`

**Setup:**
```bash
cd project && npm install svgpath
```

**Usage:**
```bash
node project/utils/split-svg-paths-normalized.js input.svg [output.svg]
```

**Features:**
- ✅ Converts relative coordinates (`m`, `l`, `c`) to absolute (`M`, `L`, `C`)
- ✅ Splits at `M` commands
- ✅ Rounds coordinates to 3 decimal places
- ✅ Error handling for malformed paths
- ✅ Detailed progress output

**When to use:** Always use this script unless you have a specific reason not to. It handles both relative and absolute coordinate SVGs correctly.

### Alternative: Basic Path Splitter

Basic script for SVGs that already use absolute coordinates (manual channel assignment still needed):

```javascript
// split-svg-paths.js
const fs = require('fs');

function splitSvgPaths(inputFile, outputFile) {
    const svgContent = fs.readFileSync(inputFile, 'utf-8');

    // Match path elements with their d attribute
    const pathRegex = /<path([^>]*?)d="([^"]+)"([^>]*?)\/>/g;

    let newSvg = svgContent;

    newSvg = newSvg.replace(pathRegex, (match, before, dAttr, after) => {
        // Don't split the background rectangle
        if (dAttr.includes('M0 0h512v512H0z')) {
            return match;
        }

        // Split by M command (start of new subpath)
        // Use positive lookahead to keep M with each subpath
        const subpaths = dAttr.split(/(?=M)/).filter(s => s.trim());

        if (subpaths.length <= 1) {
            return match; // No splitting needed
        }

        // Create separate path elements
        return subpaths.map((subpath, i) => {
            return `\n    <!-- Subpath ${i + 1} -->\n    <path${before}d="${subpath.trim()}"${after}/>`;
        }).join('');
    });

    fs.writeFileSync(outputFile, newSvg);
    console.log(`✓ Split ${subpaths.length} paths to ${outputFile}`);
}

// Usage
const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile.replace('.svg', '_SPLIT.svg');

if (!inputFile) {
    console.error('Usage: node split-svg-paths.js <input.svg> [output.svg]');
    process.exit(1);
}

splitSvgPaths(inputFile, outputFile);
```

**Usage:**
```bash
node split-svg-paths.js item_cat_axe.svg item_cat_axe_SPLIT.svg
```

**Note:** This script only performs mechanical splitting. You must manually:
1. Review the generated SVG
2. Identify what each path represents
3. Add appropriate `data-channel` attributes
4. Update comments with semantic descriptions

## Usage in Game Code

Once split and channeled, these SVGs can be styled dynamically:

```typescript
// Example: Color axe based on material
const materialColors = {
  bronze: { blade: '#CD7F32', handle: '#8B4513', edge: '#FFD700' },
  iron: { blade: '#C0C0C0', handle: '#654321', edge: '#E8E8E8' },
  steel: { blade: '#4A4A4A', handle: '#2C1810', edge: '#FFFFFF' }
};

function applyMaterialColors(svgElement: SVGElement, material: string) {
  const colors = materialColors[material];

  svgElement.querySelectorAll('path[data-channel]').forEach(path => {
    const channel = path.getAttribute('data-channel');
    if (colors[channel]) {
      path.setAttribute('fill', colors[channel]);
    }
  });
}
```

## Channel Naming Conventions

- Use **lowercase** names
- Use **singular** form (blade, not blades)
- Be **specific** when needed (blade_top vs blade_bottom)
- Be **consistent** across similar icon types
- Avoid **generic** names like "part1" or "section2"

## Best Practices

1. **Keep original files**: Never overwrite the source SVG
2. **Test rendering**: Verify the split SVG looks identical to the original
3. **Minimal channels**: Use 2-4 channels per icon (too many becomes hard to style)
4. **Logical grouping**: Multiple subpaths can share the same channel
5. **Document decisions**: Comment why certain parts share channels
6. **Version control**: Commit both original and split versions

## Future Enhancements

Potential automation improvements:
- AI/ML to suggest channel names based on icon type
- Pattern matching for common weapon/tool structures
- Bulk processing with templates for icon categories
- Visual editor for channel assignment
- Validation to ensure all paths have channels
