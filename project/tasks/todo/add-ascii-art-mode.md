# Add ASCII Art Mode

**Status:** Not Started
**Priority:** Low
**Created:** 2025-11-09

## Description

Implement an ASCII art mode for the game that displays visual elements using ASCII characters instead of SVG icons.

## Context

This feature would provide an alternative visual style for the game, potentially offering:
- Retro/nostalgic aesthetic
- Better performance on low-end devices
- Accessibility option for text-based rendering
- Unique visual style toggle

## Potential Scope

### Areas to Consider

1. **Icon System**
   - Create ASCII art equivalents for existing SVG icons
   - Build mapping system between SVG icons and ASCII versions
   - Examples: ⚔️ → `/|\`, 🛡️ → `[#]`, etc.

2. **UI Components to Update**
   - Equipment slots (currently using SVG icons)
   - Skill icons (12 skills)
   - Attribute icons (7 attributes)
   - Item category icons
   - Inventory items
   - Location/facility markers

3. **Implementation Approach**
   - Add theme toggle in settings/preferences
   - Create ASCII art mapping service
   - Update component templates to support both modes
   - Store user preference in localStorage

4. **ASCII Art Resources**
   - Design consistent ASCII art style guide
   - Create lookup table for common game elements
   - Consider multi-character ASCII art for larger elements

## Related Files

- [ui/src/app/components/game/equipment/equipment.component.ts](../../ui/src/app/components/game/equipment/equipment.component.ts)
- [ui/src/app/components/game/skills/skills.component.ts](../../ui/src/app/components/game/skills/skills.component.ts)
- [ui/src/app/components/game/attributes/attributes.component.ts](../../ui/src/app/components/game/attributes/attributes.component.ts)
- The shared [icon.component.ts](../../ui/src/app/components/shared/icon/icon.component.ts) (central SVG icon renderer — likely the main integration point for a mode toggle)
- All SVG icon files in [ui/src/assets/icons/](../../ui/src/assets/icons/)

## Notes

- Could be a fun visual alternative that enhances the game's retro RPG feel
- May require significant design effort to create consistent ASCII art style
- Consider starting with a small subset (e.g., just equipment slots) as proof of concept
