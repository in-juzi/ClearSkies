# Implement Alchemy Mixing Minigame

**Date Created**: 2025-11-09

## Overview

Implement an alchemy potion brewing minigame as the first skill minigame in ClearSkies. This minigame will allow players to combine herbs from the herbalism system into potions with quality-based outcomes.

## Why This Minigame First?

- Leverages existing quality/trait system (levels 1-5, 1-3)
- Uses herbalism skill and 6 existing herbs
- Works with current inventory system
- Simple but engaging mechanics
- Clear progression path from basic to advanced potions

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
- [ ] Create potion item definitions (health_potion, mana_potion, etc.)
- [ ] Create alchemy recipe system (JSON-based like items/locations)
- [ ] Design recipe schema (ingredients, requirements, base success rate)
- [ ] Create basic alchemy UI component
- [ ] Add alchemy activity type to location system

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
