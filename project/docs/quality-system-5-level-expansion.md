# Quality System 5-Level Expansion

**Date**: 2025-01-10
**Status**: Completed

## Overview

The quality system has been expanded from 3 levels to 5 levels, providing more granular progression and better item differentiation. Traits remain at 3 levels for special modifiers.

## Changes Made

### 1. Quality Definitions Updated

All qualities in `be/data/items/qualities/qualities.json` now have 5 levels with escalating effects:

#### woodGrain (10% per level, 1.1x → 1.5x)
- **L1**: Fine Grain (1.1x alchemy/vendor)
- **L2**: Superior Grain (1.2x)
- **L3**: Pristine Grain (1.3x) *[NEW]*
- **L4**: Perfect Grain (1.4x)
- **L5**: Mythical Grain (1.5x) *[NEW]*

#### moisture (8% per level, 1.08x → 1.4x)
- **L1**: Well-Seasoned (1.08x burning/vendor)
- **L2**: Air-Dried (1.16x) *[NEW]*
- **L3**: Kiln-Dried (1.24x)
- **L4**: Perfectly Dried (1.32x)
- **L5**: Ancient Dry (1.4x) *[NEW]*

#### age (10% per level, 1.1x → 1.5x)
- **L1**: Aged (1.1x alchemy/vendor)
- **L2**: Mature (1.2x)
- **L3**: Veteran (1.3x) *[NEW]*
- **L4**: Ancient (1.4x)
- **L5**: Primordial (1.5x) *[NEW]*

#### purity (10% per level, 1.1x → 1.5x)
- **L1**: High Purity (1.1x smithing/vendor)
- **L2**: Refined (1.2x)
- **L3**: Superior (1.3x) *[NEW]*
- **L4**: Flawless (1.4x)
- **L5**: Transcendent (1.5x) *[NEW]*

#### sheen (8% per level, 1.08x → 1.4x)
- **L1**: Polished (1.08x vendor)
- **L2**: Lustrous (1.16x) *[NEW]*
- **L3**: Brilliant (1.24x)
- **L4**: Radiant (1.32x)
- **L5**: Celestial (1.4x) *[NEW]*

### 2. Documentation Updates

#### CLAUDE.md
- Updated "Active Features" section to reflect 5-level quality system
- Updated "Inventory System" section with accurate level ranges and examples
- Changed from "3-tier quality/trait system" to "5-level quality system with 3-level trait system"

#### Manual Controller (be/controllers/manualController.js)
- Updated `getQualities()` response to indicate '1-5' level range
- Updated description to emphasize escalating effects

#### Items Section Component (ui/src/app/components/manual/sections/items-section.component.ts)
- Updated quality description to clarify escalating bonuses
- Already had correct template showing 5 levels dynamically

### 3. Icon Path Fixes

While updating the quality system, also fixed icon paths in manual controller:

**Skills**:
- woodcutting: `icons/skills/skill_woodcutting.svg`
- mining: `icons/ui/ui_dig_1.svg` (using available icon)
- fishing: `icons/ui/ui_fishing_new.svg` (using available icon)
- smithing: `icons/skills/skill_blacksmithing.svg`
- cooking: `icons/skills/skill_cooking.svg`

**Attributes**:
- All attributes: `icons/attributes/attr_*.svg` (e.g., `attr_strength.svg`)

## Impact & Migration

### Backend
- **No migration needed**: Existing items with qualities 1-3 remain valid
- New items can now roll qualities 1-5
- Quality generation logic in ItemService will automatically use new maxLevel values

### Frontend
- **No changes needed**: UI already displays quality levels dynamically
- Items section in manual will automatically show all 5 levels

### Game Balance
- **Vendor prices**: More granular pricing with 5 levels
- **Crafting**: Quality inheritance can now produce higher-tier results
- **Drop rates**: Existing drop table quality bonuses still work

## Testing Checklist

- [ ] Hot-reload item definitions: `POST /api/inventory/reload`
- [ ] Verify manual shows 5 quality levels correctly
- [ ] Test quality generation for new items
- [ ] Verify stacking still works (items with same levels stack)
- [ ] Check vendor pricing calculations with new levels
- [ ] Test crafting quality inheritance with 5-level system

## Future Considerations

1. **Drop Table Balancing**: May want to adjust `qualityBonus` values in drop tables to account for wider quality range
2. **Rarity Distribution**: Consider whether higher quality levels should be rarer
3. **Trait Expansion**: Traits remain at 3 levels; may expand in future if needed
4. **Quality Icons**: Could add visual indicators for quality levels in UI (stars, colors, etc.)

## References

- Quality definitions: `be/data/items/qualities/qualities.json`
- Documentation: `CLAUDE.md` (lines 17, 593-620)
- Manual controller: `be/controllers/manualController.js` (getQualities function)
- UI component: `ui/src/app/components/manual/sections/items-section.component.ts`
