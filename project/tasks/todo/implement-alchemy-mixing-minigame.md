# Implement Alchemy Mixing Minigame

**Status:** Not Started
**Priority:** Low
**Created:** 2025-11-09
**Plan refreshed:** 2026-06-27 (aligned to shipped alchemy/crafting system)

## Current State (2026-06-27)

The alchemy *system* already shipped via the unified crafting/RecipeRegistry (see `tasks/complete/implement-alchemy-system.md`):
- `alchemy` is its own registered skill on `Player.ts` (with XP + main attribute).
- 11 alchemy recipes exist as TS modules in `be/data/recipes/alchemy/`.
- Crafting is currently **passive/timed** — the controller sets `endTime = now + recipe.duration` and resolves later; there is **no interactive minigame layer**.

So this task is specifically about adding an **active, skill-expression minigame** on top of the existing crafting flow — replacing/augmenting the passive timer for alchemy first. It is the first concrete step toward the broader active-crafting vision in `project/ideas/crafting.md`.

## Overview

Implement an alchemy potion brewing minigame as the first skill minigame in ClearSkies. It hooks into the existing alchemy crafting flow, letting players actively influence quality-based outcomes instead of waiting on a timer.

## Why This Minigame First?

- Leverages existing quality/trait system (qualities 1-5, traits 1-3)
- Builds on the **already-implemented `alchemy` skill** and its 11 recipes (no new system needed — just an interactive layer)
- Works with current inventory + crafting controller
- Simple but engaging mechanics
- Clear progression path from basic to advanced potions
- Establishes the active-crafting pattern that can later extend to smithing/cooking

## Core Mechanics

### Minigame Flow
1. **Heat Management**: Maintain cauldron temperature in optimal green zone
2. **Timed Stirring**: Click/tap at marked intervals (rhythm-based)
3. **Success Calculation**:
   - Timing accuracy (50%)
   - Ingredient quality (30%)
   - Alchemy skill level (20%)

### Visual Design
```
[Cauldron Animation]
[Heat Gauge: ████░░░░░░] (maintain in green zone)
[Stir Timer: ●●●○○○○○] (click at right moments)

Brewing: Lesser Health Potion
Chamomile (Quality L3) + Spring Water

Time: 8.5s / 10s
Success Chance: 87%
```

## Potion Progression

- **Low-level**: Basic health potions (chamomile + water)
- **Mid-level**: Mana potions (sage + moonpetal)
- **High-level**: Buff potions (dragon's breath + mandrake)
- **Quality**: Ingredient quality affects output quality (L5 herbs → L5 potions)

## Implementation Plan

### Session 1: Recipe System + Basic UI
- [x] ~~Create potion item definitions (health_potion, mana_potion, etc.)~~ — DONE (potion/draught/elixir/tincture items exist)
- [x] ~~Create alchemy recipe system~~ — DONE (unified RecipeRegistry; 11 alchemy recipes as TS modules in `be/data/recipes/alchemy/`)
- [x] ~~Design recipe schema (ingredients, requirements)~~ — DONE (`Recipe` type in `@shared/types`; note: outcome uses quality calc, not a stored "base success rate")
- [ ] Create basic alchemy minigame UI component (hooks into existing crafting flow)
- [x] ~~Add alchemy activity/crafting entry point~~ — DONE (craftable via crafting controller + UI)

> Remaining Session 1 work is now just the minigame UI shell — the data/recipe/skill foundation already exists.

### Session 2: Minigame Mechanics
- [ ] Implement heat gauge component with optimal zone
- [ ] Implement stir timer with rhythm indicators
- [ ] Add cauldron animation/visual feedback
- [ ] Create minigame state management
- [ ] Add player input handling (heat control, stirring)

### Session 3: Quality Calculations + Rewards
- [ ] Calculate success chance from timing accuracy
- [ ] Factor in ingredient quality levels
- [ ] Apply alchemy skill level bonus
- [ ] Generate output potion with calculated quality
- [ ] Award alchemy XP based on recipe difficulty
- [ ] Add results screen with potion preview

## Benefits

- **Quick iterations**: 10-30 second minigames
- **Skill expression**: Players improve with practice
- **Optional engagement**: Can skip for guaranteed average result
- **Rewards mastery**: Perfect execution → quality bonus
- **Mobile-friendly**: Simple click/tap mechanics
- **Sets pattern**: Template for future crafting minigames (smithing, cooking)

## Technical Considerations

- Minigame duration: 10-30 seconds per brew
- Skip option: Auto-complete with average quality for accessibility
- Ingredient consumption: Only on minigame start (not on failure)
- Quality inheritance: Average ingredient quality → base output quality
- XP scaling: Apply existing XP scaling system to alchemy skill

## Notes

- This creates a new item sink/economy (herbs → potions)
- More engaging than pure gathering activities
- Medium complexity - good learning project for future minigames
- Can reuse heat/timing mechanics for cooking minigame later
