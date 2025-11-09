# Herbalism System

## Overview

Herbalism is a gathering skill that allows players to collect medicinal plants and rare herbs from various locations. The skill is linked to the **Will** attribute, representing the herbalist's knowledge, patience, and attunement to nature.

## Skill Details

- **Skill Name**: Herbalism
- **Linked Attribute**: Will (receives 50% of herbalism XP)
- **Type**: Gathering
- **XP per Level**: 1000 XP
- **Base XP Range**: 20-75 XP per activity
- **Activity Duration**: 30-65 seconds

## Herb Items

### Tier 1 - Common Herbs (Level 1-3)

**Chamomile** (`chamomile`)
- **Base Value**: 12 gold
- **Rarity**: Common
- **Description**: Delicate white flowers with a soothing aroma, commonly used in teas and healing salves
- **Qualities**: Freshness, Purity
- **Traits**: Fragrant, Pristine
- **Location**: Kennik - Herb Garden
- **Level Required**: 1
- **XP Reward**: 20 XP
- **Duration**: 30 seconds

**Sage** (`sage`)
- **Base Value**: 18 gold
- **Rarity**: Common
- **Description**: Silvery-green leaves prized for their medicinal properties and protective qualities
- **Qualities**: Freshness, Purity
- **Traits**: Fragrant, Pristine, Blessed
- **Location**: Kennik - Herb Garden
- **Level Required**: 3
- **XP Reward**: 25 XP
- **Duration**: 35 seconds

### Tier 2 - Uncommon Herbs (Level 5-8)

**Nettle** (`nettle`)
- **Base Value**: 25 gold
- **Rarity**: Uncommon
- **Description**: Stinging leaves that, when properly prepared, provide remarkable healing properties
- **Qualities**: Freshness, Purity
- **Traits**: Pristine, Cursed
- **Location**: Forest Clearing - Hidden Herb Grove
- **Level Required**: 5
- **XP Reward**: 35 XP
- **Duration**: 40 seconds

**Mandrake Root** (`mandrake_root`)
- **Base Value**: 45 gold
- **Rarity**: Uncommon
- **Description**: A mystical root shaped like a human form, whispered to have powerful magical properties
- **Qualities**: Freshness, Purity
- **Traits**: Pristine, Blessed, Cursed
- **Location**: Forest Clearing - Hidden Herb Grove
- **Level Required**: 8
- **XP Reward**: 45 XP
- **Duration**: 50 seconds

### Tier 3 - Rare Herbs (Level 12-15)

**Moonpetal** (`moonpetal`)
- **Base Value**: 80 gold
- **Rarity**: Rare
- **Description**: Luminescent white petals that shimmer in moonlight, used in the most potent elixirs
- **Qualities**: Freshness, Purity
- **Traits**: Fragrant, Pristine, Blessed, Masterwork
- **Location**: Mountain Pass - Moonlit Meadow
- **Level Required**: 12
- **XP Reward**: 60 XP
- **Duration**: 60 seconds

**Dragon's Breath** (`dragons_breath`)
- **Base Value**: 100 gold
- **Rarity**: Rare
- **Description**: Rare crimson flowers that grow in volcanic soil, their petals warm to the touch
- **Qualities**: Freshness, Purity
- **Traits**: Pristine, Cursed, Masterwork
- **Location**: Mountain Pass - Volcanic Garden
- **Level Required**: 15
- **XP Reward**: 75 XP
- **Duration**: 65 seconds

## Gathering Locations

### Kennik - Herb Garden
- **Biome**: Sea
- **Description**: A peaceful garden filled with medicinal plants and fragrant herbs. Local healers tend to the plots, sharing their knowledge with aspiring herbalists.
- **Available Herbs**: Chamomile (L1), Sage (L3)
- **Accessibility**: Starting location

### Forest Clearing - Hidden Herb Grove
- **Biome**: Forest
- **Description**: A secluded grove deep in the forest where rare herbs flourish in the dappled sunlight. The air is thick with the scent of medicinal plants.
- **Available Herbs**: Nettle (L5), Mandrake Root (L8)
- **Accessibility**: Requires travel from Kennik (60 seconds)

### Mountain Pass - Moonlit Meadow
- **Biome**: Mountain
- **Description**: A high mountain meadow bathed in ethereal moonlight. Luminescent flowers bloom here under the stars, creating an otherworldly scene.
- **Available Herbs**: Moonpetal (L12)
- **Accessibility**: Requires Endurance 3, travel from Forest Clearing (120 seconds)

### Mountain Pass - Volcanic Garden
- **Biome**: Mountain
- **Description**: A treacherous garden where rare crimson flowers grow in the heat of volcanic soil. The ground is warm beneath your feet, and steam rises from cracks in the earth.
- **Available Herbs**: Dragon's Breath (L15)
- **Accessibility**: Requires Endurance 3, travel from Forest Clearing (120 seconds)

## Drop Tables

All herb gathering activities use weighted drop tables with quality bonuses:

### Drop Weight Distribution
- **Common Drop** (60-70%): Standard quantity, basic quality bonus
- **Good Drop** (20-30%): Higher quantity, improved quality bonus
- **Excellent Drop** (5-10%): Maximum quantity, best quality bonus
- **Nothing** (3-5%): Failed gathering attempt

### Quality Bonuses
Herbs can roll with quality bonuses to their Freshness and Purity attributes:
- Common: 10-15% bonus to each quality
- Good: 20-25% bonus to each quality
- Excellent: 30-50% bonus to each quality

Higher quality herbs are more valuable and may be more effective in crafting recipes (future feature).

## Skill Progression

### Recommended Progression Path

**Levels 1-5**: Kennik Herb Garden
- Start with Chamomile (L1) until level 3
- Switch to Sage (L3) for better XP until level 5

**Levels 5-10**: Forest Clearing Herb Grove
- Gather Nettle (L5) for moderate XP and valuable herbs
- Transition to Mandrake Root (L8) at level 8

**Levels 10-15**: Mountain Pass
- Gather Moonpetal (L12) for high XP and rare ingredients
- At level 15, switch to Dragon's Breath for maximum rewards

**Level 15+**: Endgame Gathering
- Dragon's Breath provides top-tier herbs and excellent XP
- Continue for rare trait rolls and masterwork herbs

### XP Scaling

Herbalism uses the standard XP scaling system:
- **At-level content**: Full XP reward
- **1 level over**: Full XP (grace range)
- **2+ levels over**: Diminishing returns based on polynomial decay
- **Formula**: `1 / (1 + 0.3 * (playerLevel - activityLevel - 1))`

Example for Chamomile (20 base XP, level 1 requirement):
- Level 1: 20 XP (100%)
- Level 2: 20 XP (100%, grace range)
- Level 3: 15 XP (75%)
- Level 5: 11 XP (55%)
- Level 10: 5 XP (25%)

This encourages players to progress to higher-level herbs as they advance.

## Attribute Synergy

### Will Attribute Benefits

Herbalism awards 50% of earned XP to the Will attribute:
- Gather 100 Herbalism XP → Gain 50 Will XP
- Will attribute also receives XP from Cooking skill
- Balanced progression between the two Will-linked skills

### Will in Other Systems
- **Cooking**: Crafting food and consumables (future feature)
- **Magic**: May influence mana regeneration or spell resistance
- **Social**: May affect NPC interactions and persuasion (future feature)

## Future Expansion Opportunities

### Alchemy System
- Herbs as primary ingredients for potion crafting
- Quality/trait levels affect potion potency
- Rare herbs unlock unique elixir recipes

### Herb-Specific Effects
- Chamomile: Calming teas, anxiety reduction
- Sage: Protection wards, purification
- Nettle: Healing salves, poison resistance
- Mandrake Root: Powerful potions, magical augmentation
- Moonpetal: Mana restoration, mystical effects
- Dragon's Breath: Fire resistance, combat buffs

### Seasonal Variations
- Different herbs available in different seasons
- Time-of-day affects herb quality and spawn rates
- Weather influences gathering success rates

### Advanced Features
- Herb cultivation and farming
- Cross-breeding for new herb varieties
- Herbalist guild quests and reputation
- Special tools for improved gathering (shears, sickles)

## Implementation Details

### Backend Files
- **Model**: `be/models/Player.js` (lines 171-175)
- **Migration**: `be/migrations/006-add-herbalism-skill.js`
- **Item Definitions**: `be/data/items/definitions/resources.json` (lines 182-290)
- **Drop Tables**: `be/data/locations/drop-tables/herbalism-*.json` (6 files)
- **Activities**: `be/data/locations/activities/gather-*.json` (6 files)
- **Facilities**: `be/data/locations/facilities/*-herb-*.json` (4 files)

### Frontend Files
- **Model**: `ui/src/app/models/user.model.ts`
- **Service**: `ui/src/app/services/skills.service.ts`
- **Component**: `ui/src/app/components/game/skills/skills.ts`
- **Icon**: `ui/src/assets/icons/skill_herbalism.svg`

### API Endpoints
Uses standard skills API:
- `GET /api/skills` - Returns herbalism with other skills
- `GET /api/skills/herbalism` - Get herbalism details
- `POST /api/skills/herbalism/experience` - Add herbalism XP

### Database Schema
```javascript
herbalism: {
  level: Number (default: 1, min: 1)
  experience: Number (default: 0, min: 0)
  mainAttribute: String (default: 'will')
}
```

## Design Philosophy

Herbalism was designed to:
1. **Balance Will attribute**: Previously only linked to Cooking
2. **Provide early-game content**: Accessible from starting location
3. **Scale with player**: Natural progression through tiers
4. **Support future systems**: Foundation for alchemy and crafting
5. **Encourage exploration**: Higher-tier herbs require travel
6. **Medieval fantasy theme**: Mystical herbs with evocative descriptions
7. **Flexible implementation**: Easy to add new herbs and locations

The skill fits naturally into the existing gathering loop while providing unique flavor and preparing the groundwork for more advanced crafting systems.
