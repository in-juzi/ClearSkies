# Split and Colorize Icon

Split an SVG icon into multi-channel paths and set up material colorization for game items.

## Task

You will be provided with:
1. **Icon path** - Path to the SVG icon to split (e.g., `ui/src/assets/icons/items/gauntlet.svg`)
2. **Item definitions** - One or more item definition files that will use this icon (e.g., `be/data/items/definitions/equipment/BronzeGloves.ts`, `be/data/items/definitions/equipment/IronGloves.ts`)

## Workflow

### 1. Split the SVG
```bash
node project/utils/split-svg-paths-normalized.js <icon-path>
```
This creates a `*_SPLIT.svg` file with normalized paths.

**Important:** After verifying the split SVG looks correct:
1. Delete the original `<icon_name>.svg`
2. Rename `<icon_name>_SPLIT.svg` to `<icon_name>.svg`
3. All future references use `<icon_name>.svg` (not `*_SPLIT.svg`)

### 2. Add Data Channel Attributes
Read the split SVG (now renamed to `<icon_name>.svg`) and add semantic `data-channel` attributes to each path based on visual analysis:

**Common channels for equipment:**
- `primary` - Main body/blade/plates
- `secondary` - Dark accents/shadows/reinforcements
- `edge` - Highlights/sharp edges/trim
- `detail` - Fine details/joints/ornaments
- `handle` - Grips/handles (for weapons/tools)
- `guard` - Crossguards/protective elements (for weapons)
- `blade` - Cutting edges (for weapons/tools)

**Armor-specific channels:**
- `primary` - Main armor plates
- `secondary` - Reinforcement plates/straps
- `edge` - Trim/highlights
- `detail` - Rivets/joints/decorative elements

**Weapon-specific channels:**
- `blade` - Main weapon head
- `handle` - Grip/shaft
- `guard` - Crossguard/hilt
- `edge` - Sharp edges/highlights
- `detail` - Pommel/decorative elements

Add semantic comments above each path describing what it represents (e.g., `<!-- Finger plates (thumb) - Primary metal -->`).

### 3. Create Material Color Definitions
For each item that will use this icon, add a material color entry to `ui/src/app/constants/material-colors.constants.ts`.

**Naming convention:** `{material}_{item_type}` (e.g., `bronze_gloves`, `iron_sword`, `steel_helmet`)

**Color structure:**
```typescript
material_item: {
  primary: '#HEX',     // Main color with comment
  secondary: '#HEX',   // Secondary color with comment
  edge: '#HEX',        // Edge highlights with comment
  detail: '#HEX'       // Detail accents with comment
  // Add other channels as needed (blade, handle, guard, etc.)
}
```

**Color guidelines:**
- **Bronze**: Primary #CD853F (bronze gold), Secondary #8B7355 (dark bronze), Edge #DAA520 (goldenrod)
- **Iron**: Primary #696969 (dim gray), Secondary #4A4A4A (dark gray), Edge #A9A9A9 (light gray)
- **Steel**: Primary #B0C4DE (light steel blue), Secondary #4682B4 (steel blue), Edge #F0F8FF (alice blue)
- **Copper**: Primary #CD7F32 (copper orange), Secondary #8B4513 (dark copper), Edge #F4A460 (sandy brown)
- Use existing material definitions as reference for consistency

### 4. Update Item Definitions
Update each item definition file to use the new icon:

```typescript
"icon": {
  "path": "items/<icon_name>.svg",
  "material": "<material_item>"
}
```

**Note:** Use the final renamed filename (without `_SPLIT` suffix).

## Example Usage

**Input:**
- Icon: `ui/src/assets/icons/items/gauntlet.svg`
- Items: `be/data/items/definitions/equipment/BronzeGloves.ts`, `be/data/items/definitions/equipment/IronGloves.ts`

**Process:**
1. Split `gauntlet.svg` → creates `gauntlet_SPLIT.svg`
2. Delete original `gauntlet.svg`, rename `gauntlet_SPLIT.svg` → `gauntlet.svg`
3. Add data-channel attributes to `gauntlet.svg` (primary, secondary, edge, detail)
4. Create `bronze_gloves` and `iron_gloves` material entries
5. Update both item definitions to use `items/gauntlet.svg`

## Output Summary

Provide a summary including:
1. ✅ SVG split into N paths
2. ✅ Data channels assigned (list channels used)
3. ✅ Material color definitions created (list materials)
4. ✅ Item definitions updated (list files)
5. File references with line numbers for verification

## Notes

- Always use the **normalized** split utility (`split-svg-paths-normalized.js`) for coordinate consistency
- Choose channels semantically based on what each path represents visually
- Maintain color consistency with existing material definitions
- Add descriptive comments for both SVG paths and color definitions
- Group related items (e.g., bronze/iron/steel variants) together in material colors
