# Icon Colorization Workflow

This document provides a step-by-step guide for adding new icons with multi-channel colorization to the ClearSkies game.

## Overview

The icon system uses `data-channel` attributes on SVG paths to enable dynamic colorization. Different parts of an icon (body, legs, tail, etc.) can be colored independently based on material definitions.

## Complete Workflow: From New Icon to Colorized Display

### Step 1: Add the Icon File

Place your SVG icon in the appropriate directory:
- **Items**: `ui/src/assets/icons/items/`
- **Skills**: `ui/src/assets/icons/skills/`
- **Abilities**: `ui/src/assets/icons/abilities/`
- **UI Elements**: `ui/src/assets/icons/ui/`

**Example**: `ui/src/assets/icons/items/shrimp.svg`

### Step 2: Analyze the SVG Structure

Open the SVG file and examine the paths. Look for:
- Multiple subpaths (indicated by `M` or `m` commands in path data)
- The visual structure when rendered
- Which parts represent different features (body, legs, head, etc.)

**Shrimp Example** (12 subpaths):
```svg
<!-- Before analysis -->
<path fill="#fff" d="M376.4 19.14C352 18.97...Z"/>
<path fill="#fff" d="M428.1 65.24C383.2 65...Z"/>
<path fill="#fff" d="M222 112.3C213.6 112.3...Z"/>
<!-- ... 9 more paths -->
```

**Analysis Method**:
1. Look at Y-coordinates to understand vertical positioning
   - Lower Y values = higher on screen (top of icon)
   - Higher Y values = lower on screen (bottom of icon)
2. Look at path complexity
   - Small circular paths often = eyes, details
   - Large complex paths = main body segments
3. Identify anatomical regions based on creature/object type

### Step 3: Assign Semantic Channels

Based on the icon type, assign appropriate `data-channel` values to each path.

#### Channel Categories by Icon Type

**Food/Creatures (Fish, Shrimp, Meat)**:
- `shell` - Hard outer carapace or scales
- `body` - Main body segments
- `legs` - Legs, fins, or appendages
- `tail` - Tail sections
- `tailfan` - Tail fan spread
- `antennae` - Antennae, feelers, whiskers
- `eye` - Eyes
- `detail` - Fine details, markings

**Weapons (Swords, Axes, Spears)**:
- `blade` - Main blade body
- `edge` - Sharpened edge highlights
- `handle` - Grip or haft
- `guard` - Crossguard, pommel
- `decoration` - Engravings, gems

**Tools (Pickaxes, Hammers, Fishing Rods)**:
- `head` - Tool working end
- `handle` - Shaft or grip
- `detail` - Binding, wear marks

**Armor (Helmets, Shields, Chest Pieces)**:
- `body` - Main armor surface
- `trim` - Decorative edges
- `detail` - Rivets, engravings
- `padding` - Inner lining, straps

**Plants/Herbs**:
- `leaves` - Leaf sections
- `stem` - Stems, branches
- `flower` - Flower petals
- `root` - Root structure
- `detail` - Veins, texture

### Step 4: Add Channels and Comments to SVG

Edit the SVG file to add `data-channel` attributes and descriptive comments:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z"/>

    <!-- Antennae and rostrum (top spines) -->
    <path fill="#fff" data-channel="antennae" d="M376.4 19.14...Z"/>

    <!-- Head and upper body carapace -->
    <path fill="#fff" data-channel="shell" d="M428.1 65.24...Z"/>

    <!-- Eye -->
    <path fill="#fff" data-channel="eye" d="M222 112.3...Z"/>

    <!-- Upper body segment with legs -->
    <path fill="#fff" data-channel="legs" d="M101.5 132.5...Z"/>

    <!-- ... additional paths -->
</svg>
```

**Best Practices**:
- ✅ Use descriptive comments explaining what each path represents
- ✅ Use lowercase channel names (e.g., `body`, not `Body`)
- ✅ Use singular form (e.g., `leg`, not `legs`)
- ✅ Be specific when needed (e.g., `blade_top`, `blade_bottom`)
- ✅ Group similar parts under the same channel (multiple paths can share one channel)
- ❌ Avoid generic names like `part1`, `section2`

### Step 5: Define Material Colors

Add a material definition in [ui/src/app/constants/material-colors.constants.ts](../../ui/src/app/constants/material-colors.constants.ts):

```typescript
export const MATERIAL_COLORS: Record<string, ColorChannels> = {
  // ... existing materials

  raw_shrimp: {
    primary: '#FFB6C1',   // Light pink (fallback color)
    secondary: '#CD5C5C', // Indian red (optional)
    shell: '#FFA07A',     // Light salmon (hard carapace)
    body: '#FFB6C1',      // Light pink body segments
    legs: '#FFC0CB',      // Pink legs and swimmerets
    tail: '#FF69B4',      // Hot pink tail
    tailfan: '#DB7093',   // Pale violet red tail fan
    antennae: '#CD5C5C',  // Indian red antennae
    eye: '#000000'        // Black eye
  },

  cooked_shrimp: {
    primary: '#FF6347',   // Tomato red (cooked shrimp)
    shell: '#FF4500',     // Orange red
    body: '#FF6347',      // Tomato body
    legs: '#FF7F50',      // Coral legs
    tail: '#FF8C00',      // Dark orange tail
    tailfan: '#FFA500',   // Orange tail fan
    antennae: '#DC143C',  // Crimson antennae
    eye: '#000000'        // Black eye
  }
};
```

**Color Channel Rules**:
- `primary` is **required** - used as fallback for any path without a matching channel
- All other channels are optional
- Paths without `data-channel` attributes will use `primary` color
- Use hex color codes (`#RRGGBB`)
- Add descriptive comments for clarity

### Step 6: Update Item Definition

Add the icon configuration to the item's JSON definition in `be/data/items/definitions/`:

```json
{
  "itemId": "shrimp",
  "name": "Shrimp",
  "description": "A fresh caught shrimp with translucent pink flesh...",
  "category": "resource",
  "subcategory": "fish",
  "rarity": "common",
  "tier": 1,
  "baseValue": 15,
  "maxStack": 99,
  "icon": {
    "path": "items/shrimp.svg",
    "material": "raw_shrimp"
  }
}
```

**Icon Configuration**:
- `path`: Relative path from `ui/src/assets/icons/`
- `material`: Key from `MATERIAL_COLORS` constant

### Step 7: Test the Colorization

The icon system will automatically:
1. Fetch the SVG file via HTTP
2. Parse the SVG and read `data-channel` attributes
3. Generate CSS rules for each channel
4. Inject a `<style>` block with color rules
5. Render the colorized SVG

**Testing in the UI**:
- Open inventory and look for the item
- Icon should display with the defined colors
- Each channel should show its assigned color
- Paths without channels should use the `primary` color

**Debug Steps if Colors Don't Appear**:
1. Check browser console for HTTP errors (icon file not found)
2. Verify `data-channel` attribute spelling matches material definition
3. Confirm material key in item JSON matches `MATERIAL_COLORS` key
4. Inspect element in browser DevTools to see injected `<style>` block
5. Look for typos in channel names (case-sensitive)

## Real-World Example: Shrimp Icon

Let's walk through the complete shrimp icon implementation:

### Before (12 Generic Subpaths)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z"/>
    <!-- Subpath 1 -->
    <path fill="#fff" d="M376.4 19.14C352 18.97...Z"/>
    <!-- Subpath 2 -->
    <path fill="#fff" d="M428.1 65.24C383.2 65...Z"/>
    <!-- ... 10 more generic paths -->
</svg>
```

### After Analysis (Identified Anatomy)

**Path Breakdown**:
1. **Path 1** (Y: 19-160): Top spines = **antennae**
2. **Path 2** (Y: 65-225): Large head region = **shell**
3. **Path 3** (Y: 112-142): Small circle = **eye**
4. **Path 4** (Y: 132-289): Left side appendages = **legs**
5. **Path 5** (Y: 228-350): Left side legs = **legs**
6. **Path 6** (Y: 247-331): Right side detail = **body**
7. **Path 7** (Y: 280-347): Right side detail = **body**
8. **Path 8** (Y: 315-368): Right side detail = **body**
9. **Path 9** (Y: 352-441): Tail transition = **tail**
10. **Path 10** (Y: 424-460): Upper tail = **tail**
11. **Path 11** (Y: 425-478): Lower tail = **tail**
12. **Path 12** (Y: 476-492): Bottom fan = **tailfan**

### After Implementation (Channeled)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M0 0h512v512H0z"/>

    <!-- Antennae and rostrum (top spines) -->
    <path fill="#fff" data-channel="antennae" d="M376.4 19.14...Z"/>

    <!-- Head and upper body carapace -->
    <path fill="#fff" data-channel="shell" d="M428.1 65.24...Z"/>

    <!-- Eye -->
    <path fill="#fff" data-channel="eye" d="M222 112.3...Z"/>

    <!-- Upper body segment with legs -->
    <path fill="#fff" data-channel="legs" d="M101.5 132.5...Z"/>

    <!-- Mid-body segment with legs -->
    <path fill="#fff" data-channel="legs" d="M52.57 228.5...Z"/>

    <!-- Mid-body segment detail (right side) -->
    <path fill="#fff" data-channel="body" d="M231 247.2...Z"/>

    <!-- Mid-body segment detail with swimmerets (right side) -->
    <path fill="#fff" data-channel="body" d="M202.7 280.1...Z"/>

    <!-- Lower body segment with swimmerets (right side) -->
    <path fill="#fff" data-channel="body" d="M182.6 315.6...Z"/>

    <!-- Tail transition segment (left side) -->
    <path fill="#fff" data-channel="tail" d="M52 352.1...Z"/>

    <!-- Tail segment detail (right side, upper) -->
    <path fill="#fff" data-channel="tail" d="M422.1 424.7...Z"/>

    <!-- Tail segment (left side, lower) -->
    <path fill="#fff" data-channel="tail" d="M210.4 425.4...Z"/>

    <!-- Tail fan (telson and uropods - bottom) -->
    <path fill="#fff" data-channel="tailfan" d="M273.7 476.3...Z"/>
</svg>
```

### Material Definition

```typescript
raw_shrimp: {
  primary: '#FFB6C1',   // Light pink (fallback)
  shell: '#FFA07A',     // Light salmon carapace
  body: '#FFB6C1',      // Light pink body
  legs: '#FFC0CB',      // Pink legs
  tail: '#FF69B4',      // Hot pink tail
  tailfan: '#DB7093',   // Pale violet tail fan
  antennae: '#CD5C5C',  // Indian red antennae
  eye: '#000000'        // Black eye
}
```

### Item Definition

```json
{
  "itemId": "shrimp",
  "icon": {
    "path": "items/shrimp.svg",
    "material": "raw_shrimp"
  }
}
```

### Result

When the shrimp icon is rendered:
- Antennae appear as **Indian red** (#CD5C5C)
- Shell appears as **light salmon** (#FFA07A)
- Eye appears as **black** (#000000)
- Legs appear as **pink** (#FFC0CB)
- Body segments appear as **light pink** (#FFB6C1)
- Tail appears as **hot pink** (#FF69B4)
- Tail fan appears as **pale violet red** (#DB7093)

### Technical Output

The icon service applies colors as **inline `fill` attributes**:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M0 0h512v512H0z"/>

  <!-- Colors applied directly to each path -->
  <path data-channel="antennae" fill="#CD5C5C" d="..." />
  <path data-channel="shell" fill="#FFA07A" d="..." />
  <path data-channel="eye" fill="#000000" d="..." />
  <path data-channel="legs" fill="#FFC0CB" d="..." />
  <path data-channel="body" fill="#FFB6C1" d="..." />
  <path data-channel="tail" fill="#FF69B4" d="..." />
  <path data-channel="tailfan" fill="#DB7093" d="..." />
</svg>
```

**Why inline styles?**
- ✅ **Isolated**: Each SVG instance has its own colors
- ✅ **No conflicts**: Multiple icons with same data-channels but different materials work correctly
- ✅ **Simple**: No CSS class management or global style pollution
- ✅ **Cacheable**: Each material+path combination cached separately

This allows raw_shrimp and cooked_shrimp to both use `items/shrimp.svg` with completely different colors!

## Advanced Techniques

### Multiple Materials for One Icon

You can define multiple materials for the same icon to show different states:

```typescript
// Raw vs cooked states
raw_shrimp: { primary: '#FFB6C1', ... },
cooked_shrimp: { primary: '#FF6347', ... }

// Metal tiers
copper_sword: { blade: '#CD7F32', ... },
iron_sword: { blade: '#C0C0C0', ... },
steel_sword: { blade: '#B0C4DE', ... }
```

### Reusing Channels

Multiple paths can share the same channel name for consistent coloring:

```svg
<!-- All three paths will use the same "body" color -->
<path data-channel="body" d="..."/>
<path data-channel="body" d="..."/>
<path data-channel="body" d="..."/>
```

### Fallback Behavior

If a path has a `data-channel` that doesn't exist in the material definition, it falls back to `primary`:

```typescript
material: {
  primary: '#FF0000',  // Red fallback
  body: '#00FF00'      // Green body
}
```

```svg
<path data-channel="body" />      <!-- Green (defined) -->
<path data-channel="tail" />      <!-- Red (fallback to primary) -->
<path data-channel="undefined" /> <!-- Red (fallback to primary) -->
```

### Paths Without Channels

Paths without `data-channel` attributes always use `primary`:

```svg
<path fill="#fff" d="..." />  <!-- No channel = uses primary -->
```

### Empty Channel (Transparent Areas)

Use `data-channel="empty"` to create transparent areas that show the background color:

```svg
<!-- Eye with transparent pupil (shows background) -->
<path data-channel="eye" d="..." />        <!-- Colored eye -->
<path data-channel="empty" d="..." />      <!-- Transparent pupil -->

<!-- Shield with transparent window -->
<path data-channel="body" d="..." />       <!-- Shield body -->
<path data-channel="empty" d="..." />      <!-- Transparent viewing slot -->
```

**Use Cases:**
- Eye pupils (transparent center, colored iris)
- Windows or viewing slots in armor/shields
- Hollow areas in weapons (e.g., axe blade cutouts)
- Decorative cutouts showing background
- Gem sockets or hollow areas

**How it works:**
- `data-channel="empty"` receives `fill: inherit` attribute
- Background color shows through (from parent container)
- No need to define "empty" in material color definitions
- Works automatically for all materials

## Troubleshooting

### Icon Not Appearing

**Problem**: Icon doesn't show at all

**Solutions**:
1. Check file path in item definition matches actual file location
2. Verify SVG file is valid XML (no syntax errors)
3. Check browser console for 404 errors
4. Ensure `iconPath` or `icon.path` is set in item definition

### Icon Shows But No Colors

**Problem**: Icon appears as all white or all one color

**Solutions**:
1. Verify `data-channel` attributes exist in SVG paths
2. Check material name in item JSON matches key in `MATERIAL_COLORS`
3. Confirm channel names in SVG match keys in material definition
4. Check for typos in channel names (case-sensitive)
5. Inspect element in DevTools to see if `<style>` block is injected

### Wrong Colors

**Problem**: Icon shows colors but they're incorrect

**Solutions**:
1. Verify hex color codes in material definition
2. Check that channel names match between SVG and material
3. Ensure paths have correct `data-channel` assignments
4. Test with different material to isolate issue

### Some Paths Colored, Others Not

**Problem**: Only some parts of icon are colored

**Solutions**:
1. Check which paths are missing `data-channel` attributes
2. Verify all channel names in SVG exist in material definition
3. Paths without channels will use `primary` color
4. Intentionally missing channels will fall back to `primary`

## Tools and Utilities

### SVG Path Splitter (Normalized)

For icons with single-path subpath data, use the normalized splitter:

```bash
cd project && npm install svgpath
node project/utils/split-svg-paths-normalized.js input.svg output.svg
```

This converts relative coordinates to absolute and splits at `M` commands.

### Visual Inspection

Use browser DevTools to inspect the SVG:
1. Right-click the icon in the game UI
2. Select "Inspect Element"
3. Expand the `<svg>` element
4. Look for injected `<style>` block with `.icon-channel-*` rules
5. Verify each path has correct `data-channel` attribute

### Color Picker

Use online tools to find hex color codes:
- [Coolors.co](https://coolors.co) - Generate color palettes
- [HTML Color Codes](https://htmlcolorcodes.com) - Pick from color wheel
- Browser DevTools color picker - Click color swatches in CSS inspector

## Best Practices Summary

✅ **Do**:
- Use descriptive channel names that match the anatomy/function
- Add comments explaining each path's purpose
- Keep channel count reasonable (3-6 channels ideal)
- Use `primary` as a fallback color
- Test with different materials to ensure flexibility
- Group similar parts under one channel
- Document your color choices with comments

❌ **Don't**:
- Use generic names like `part1`, `section2`
- Create too many channels (makes material definitions complex)
- Forget the `primary` color (it's required)
- Overwrite the original SVG file (keep a backup)
- Use different channel names for similar features across icons
- Mix uppercase and lowercase in channel names

## References

- [SVG Path Splitting Process](./svg-path-splitting-process.md) - Detailed splitting guide
- [Icon System Documentation](../../CLAUDE.md#icon-system) - System architecture
- [Material Colors Constants](../../ui/src/app/constants/material-colors.constants.ts) - All material definitions
- [Icon Component](../../ui/src/app/components/shared/icon/icon.component.ts) - Implementation
- [Icon Service](../../ui/src/app/services/icon.service.ts) - Colorization logic
