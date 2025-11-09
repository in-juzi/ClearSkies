# Implement Alchemy System

**Created**: 2025-11-09

## Overview

Implement a comprehensive alchemy system that allows players to combine items (especially herbs and resources) to create potions, elixirs, and other consumables. The system should leverage the existing quality and trait systems for recipe outcomes.

## Key Features to Implement

### 1. Recipe System
- JSON-based recipe definitions in `be/data/alchemy/recipes/`
- Define ingredient requirements (itemId + quantity)
- Define quality/trait requirements for ingredients
- Multiple recipe tiers (basic, intermediate, advanced, master)
- Skill level requirements for each recipe

### 2. Alchemy Skill
- Add "alchemy" to the skills system (linked to Magic attribute)
- XP gain from successful crafting
- Higher levels unlock better recipes
- Affects success rate and potion quality

### 3. Ingredient Quality Impact
- Higher quality ingredients → better potion outcomes
- Quality levels affect potion potency
- Trait combinations create special effects
- Example: Pristine herbs → Enhanced healing potions

### 4. Crafting Process
- New API endpoint: `POST /api/alchemy/craft`
- Validate recipe, ingredients, and skill requirements
- Consume ingredients from inventory
- Calculate outcome based on quality/traits/skill level
- Award XP to alchemy skill
- Add crafted item to inventory

### 5. Recipe Discovery
- Recipes can be discovered through:
  - Skill level progression
  - Finding recipe scrolls/books
  - NPC vendors
  - Quest rewards
- Track discovered recipes per player

### 6. UI Components
- Alchemy workbench interface
- Recipe browser with filtering
- Ingredient selection with quality preview
- Success rate calculation display
- Crafting animation/feedback

## Recipe Examples

### Health Potion (Basic)
- Ingredients: chamomile (2), sage (1)
- Alchemy Level: 1
- Base effect: Restore 50 HP
- Quality bonus: +10 HP per quality level

### Mana Elixir (Intermediate)
- Ingredients: moonpetal (2), nettle (1), pure water (1)
- Alchemy Level: 5
- Base effect: Restore 100 MP
- Quality bonus: +15 MP per quality level

### Dragon's Fortitude (Advanced)
- Ingredients: dragons_breath (3), mandrake_root (2), blessed oil (1)
- Alchemy Level: 10
- Base effect: +50 max HP for 1 hour
- Quality bonus: +10 max HP, +5 min duration per quality level

## Database Changes

### Player Model Updates
- Add `alchemy` skill
- Add `discoveredRecipes: [String]` array
- Migration: `007-add-alchemy-skill.js`

## File Structure

```
be/
├── data/
│   └── alchemy/
│       └── recipes/
│           ├── health-potion-basic.json
│           ├── mana-elixir-intermediate.json
│           └── dragons-fortitude-advanced.json
├── controllers/
│   └── alchemyController.js
├── routes/
│   └── alchemy.js
├── services/
│   └── alchemyService.js
└── migrations/
    └── 007-add-alchemy-skill.js

ui/src/app/
├── components/game/
│   └── alchemy/
│       ├── alchemy.component.ts
│       ├── alchemy.component.html
│       └── alchemy.component.scss
├── services/
│   └── alchemy.service.ts
└── models/
    └── alchemy.model.ts
```

## Implementation Steps

1. **Backend Foundation**
   - [ ] Create migration to add alchemy skill
   - [ ] Create alchemyService.js for recipe loading and crafting logic
   - [ ] Create recipe JSON schema and sample recipes
   - [ ] Implement recipe validation logic

2. **API Endpoints**
   - [ ] POST /api/alchemy/craft - Craft an item from recipe
   - [ ] GET /api/alchemy/recipes - Get all discovered recipes
   - [ ] GET /api/alchemy/recipes/:recipeId - Get recipe details
   - [ ] POST /api/alchemy/recipes/discover - Discover a new recipe

3. **Crafting Logic**
   - [ ] Ingredient validation and consumption
   - [ ] Quality calculation based on ingredients
   - [ ] Success rate calculation (skill + quality bonuses)
   - [ ] XP award system for alchemy skill
   - [ ] Critical success system (bonus traits)

4. **Frontend UI**
   - [ ] Alchemy component with workbench interface
   - [ ] Recipe browser with search/filter
   - [ ] Ingredient selection with drag-and-drop
   - [ ] Real-time success rate calculation
   - [ ] Crafting animation and result display

5. **Recipe Content**
   - [ ] Create 10-15 basic recipes
   - [ ] Create 5-10 intermediate recipes
   - [ ] Create 3-5 advanced recipes
   - [ ] Balance ingredient costs and effects

6. **Testing**
   - [ ] Test recipe validation
   - [ ] Test ingredient consumption
   - [ ] Test quality calculations
   - [ ] Test XP gain and skill progression
   - [ ] Test edge cases (insufficient ingredients, wrong quality, etc.)

## Design Considerations

- **Balance**: Crafted items should be valuable but not overpowered
- **Progression**: Higher level recipes should feel rewarding
- **Quality matters**: Players should care about ingredient quality
- **Trait synergies**: Interesting combinations create unique effects
- **Herbalism integration**: Make herbalism skill valuable for gathering ingredients
- **Economy impact**: Alchemy products can be sold or traded

## Related Systems

- Herbalism skill (gathering ingredients)
- Inventory system (ingredient storage)
- Quality/trait system (crafting outcomes)
- Drop table system (recipe discovery)
- Equipment system (alchemy tools/apparatus)

## Documentation

- Create `project/docs/alchemy-system.md` with full system design
- Update CLAUDE.md with alchemy system overview
- Document recipe JSON schema
- Document crafting calculations and formulas

## Future Enhancements

- Alchemy apparatus (equipment that improves success rate)
- Transmutation (convert resources into other resources)
- Potion brewing time (time-based like activities)
- Batch crafting (craft multiple at once)
- Recipe experimentation (discover recipes through trial)
- Guild contracts for rare recipes
- Potion effects with duration tracking
