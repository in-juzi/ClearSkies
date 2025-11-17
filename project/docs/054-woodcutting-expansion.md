# Woodcutting Expansion - Starter Island & Mainland Planning

**Status**: Starter Island Complete ✅ | Mainland Planned 📋
**Date**: 2025-11-16
**Related Systems**: Resource Gathering, Drop Tables, Economic Design, Future Farming Skill

## Overview

Complete overhaul of the woodcutting system, expanding from a single activity (Oak, level 1) to a full progression system with realistic wood types, dual-layered rare drop tables, and cross-skill economic synergy through seed drops that will support future farming implementation.

## Design Philosophy

### Starter Island: Simple & Realistic
- **Progression**: Softwood → Hardwood (Pine L1 → Oak L3 → Birch L5)
- **Traits**: Keep simple (Pristine + Balanced only)
- **Focus**: Teaching core mechanics, gentle difficulty curve
- **Realism**: Real-world wood properties (pine softwood is easier to chop than oak hardwood)

### Mainland: Complexity & Variety
- **Biome Diversity**: Temperate forests, northern conifers, marshland woods
- **Trait Variety**: Introduction of specialized traits beyond Pristine/Balanced
- **Economic Depth**: Regional wood types, specialty products, higher-tier resources
- **Progression**: Builds on starter island foundation with more challenging content

## Starter Island Implementation (Complete)

### Wood Types & Activities

| Tree Type | Level | Duration | XP | Drop Table | Rare Table(s) |
|-----------|-------|----------|-----|------------|---------------|
| **Pine** | 1 | 6s | 20 | woodcutting-pine | rare-woodcutting-pine<br>rare-woodcutting-finds |
| **Oak** | 3 | 8s | 20 | woodcutting-oak | rare-woodcutting-oak<br>rare-woodcutting-finds |
| **Birch** | 5 | 10s | 20 | woodcutting-birch | rare-woodcutting-birch<br>rare-woodcutting-finds |

**Location**: Forest Logging Camp (Forest Clearing)

### New Items Created

#### Logs (3)
- **Pine Log** (T1, 15g, COMMON, 0.5kg)
  - "Lightweight softwood log from a pine tree. Easy to work with and commonly used for basic construction and firewood."

- **Oak Log** (T1, 25g, COMMON, 0.8kg) - *Existing, no changes*
  - "A sturdy hardwood log from an oak tree. Prized for its strength and durability in construction and crafting."

- **Birch Log** (T2, 35g, UNCOMMON, 0.6kg)
  - "Distinctive log with papery white bark from a birch tree. The light-colored wood is prized for its workability and attractive appearance."

#### Tree Byproducts (2)
- **Pine Resin** (T1, 20g, UNCOMMON, 0.1kg)
  - Subcategories: [CRAFTING, ALCHEMY]
  - "Sticky amber-colored sap harvested from pine trees. Used in alchemy for adhesives and waterproofing."

- **Birch Bark** (T2, 25g, UNCOMMON, 0.05kg)
  - Subcategories: [CRAFTING, ALCHEMY]
  - "Strips of distinctive white bark harvested from birch trees. The flexible, waterproof material is valued for traditional crafts and alchemy."

#### Gemstone (1)
- **Amber** (T1, 40g, UNCOMMON, 0.1kg)
  - Subcategory: GEMSTONE
  - "Fossilized tree resin with a warm golden hue. This ancient gem sometimes contains preserved insects from millennia past."
  - **Universal rare drop** across all woodcutting activities (5% base chance)

#### Seeds (9) - Future Farming Skill
Seeds represent animal food caches found while woodcutting. They provide economic value before farming skill exists and will be used for player housing gardens when implemented.

**Tier 1 Seeds** (15g, COMMON, 0.05kg each):
- Lettuce Seeds - "Common vegetable seeds often cached by foraging animals"
- Carrot Seeds - "Hardy root vegetable seeds stored underground by animals"
- Turnip Seeds - "Nutritious root vegetable seeds hidden in forest caches"

**Tier 2 Seeds** (30g, UNCOMMON, 0.05kg each):
- Potato Seeds - "Versatile tuber seeds cached by clever forest creatures"
- Onion Seeds - "Pungent vegetable seeds found in animal stores"
- Cabbage Seeds - "Seeds for growing hardy cabbage, often found in caches hidden by foraging animals"

**Tier 3 Seeds** (50g, RARE, 0.05kg each):
- Strawberry Seeds - "Delicate fruit seeds carefully stored by forest animals"
- Tomato Seeds - "Valuable fruit seeds discovered in well-hidden caches"
- Pumpkin Seeds - "Rare seeds for growing large pumpkins, often found in caches hidden by foraging animals"

### Drop Table Architecture: Option B (Dual-Layer System)

Each woodcutting activity references **two** rare drop tables:
1. **Tree-specific rare table** - Contains tree byproducts AND tier-appropriate seeds
2. **Universal rare finds table** - Contains amber (found in ancient wood across all activities)

This architecture allows:
- ✅ Shared universal drops (amber) without duplication
- ✅ Tree-specific specialty items (resin, bark)
- ✅ Progression-based seed discoveries (higher levels = more valuable seeds)
- ✅ Easy maintenance (add new universal rares in one place)

#### Standard Drop Tables (Base Loot)

**WoodcuttingPine**:
- 80% weight: 1-2 pine logs
- 20% weight: 2-3 pine logs + woodGrain quality bonus

**WoodcuttingOak**:
- 75% weight: 1-2 oak logs
- 25% weight: 2-3 oak logs + woodGrain quality bonus

**WoodcuttingBirch**:
- 70% weight: 1-2 birch logs
- 30% weight: 2-3 birch logs + woodGrain quality bonus

#### Rare Drop Tables (Tree-Specific)

**RareWoodcuttingPine** (total: 25% something, 75% nothing):
- 10% Pine Resin (1-2)
- 5% Lettuce Seeds (1-2)
- 5% Carrot Seeds (1-2)
- 5% Turnip Seeds (1-2)
- 75% Nothing

**RareWoodcuttingOak** (total: 15% something, 85% nothing):
- 5% Potato Seeds (1-2)
- 5% Onion Seeds (1-2)
- 5% Cabbage Seeds (1-2)
- 85% Nothing

**RareWoodcuttingBirch** (total: 24% something, 76% nothing):
- 12% Birch Bark (1-2)
- 4% Strawberry Seeds (1-2)
- 4% Tomato Seeds (1-2)
- 4% Pumpkin Seeds (1-2)
- 76% Nothing

#### Universal Rare Table

**RareWoodcuttingFinds** (shared by all woodcutting activities):
- 5% Amber (1) - "Fossilized tree sap found in ancient wood"
- 95% Nothing

**Future Expansion Ideas**:
- Rare wood types (petrified wood, heartwood)
- Forest creature drops (bird nests, beehives)
- Ancient artifacts buried at tree roots
- Specialty fungi growing on old trees

### Economic Design: Cross-Skill Synergy

**Immediate Value** (Before Farming Exists):
- Seeds provide vendor income for woodcutters
- Progression creates value scaling: 15g → 30g → 50g per seed
- Encourages players to advance through woodcutting levels

**Future Value** (When Farming Implemented):
- Woodcutters become seed suppliers for farmers
- Creates player-to-player trading opportunities
- Farming skill depends on woodcutting for seed acquisition
- Multiple seeds per drop (1-2 quantity) supports both vendor sales and farming use

**Trait Philosophy**:
- Starter island seeds: No traits (simple for now)
- Future mainland seeds: May carry growth-related traits (Fast Growing, Hardy, Bountiful)
- Trait transfer to crops could affect harvest yield, quality, or growth speed

## Mainland Woodcutting (Planned)

### Geographic Context

**Port Region** (Entry from Kennik):
- Temperate to slightly cooler climate
- Transition zone between starter island and northern mainland
- Marshland areas near the port

**Northern Regions**:
- Colder climate, coniferous forests
- More challenging activities, higher XP/rewards
- Specialty northern wood types

### Planned Wood Types

#### Marshland Woods (Port Region)
**Cypress** (Level 7-8):
- Real-world properties: Water-resistant heartwood, grows in swamps
- Gameplay use: Specialty construction material (boats, water structures)
- Potential byproduct: Cypress knees (root formations), swamp moss
- Trait ideas: Water-Resistant (construction bonus near water)

**Mangrove** (Level 9-10):
- Real-world properties: Salt-tolerant, complex root systems, coastal
- Gameplay use: Coastal construction, unique alchemy ingredients
- Potential byproduct: Mangrove bark (tannins), salt crystals
- Trait ideas: Salt-Resistant, Dense Grain

#### Temperate Hardwoods (Mainland Forests)
**Maple** (Level 11-12):
- Real-world properties: Hard, fine grain, beautiful figure
- Gameplay use: High-quality furniture, tool handles
- Potential byproduct: Maple syrup (food/alchemy), sap buckets
- Trait ideas: Fine Grain (quality bonus), Sweet Sap

**Ash** (Level 13-14):
- Real-world properties: Flexible, shock-resistant, ideal for tool handles
- Gameplay use: Weapon handles, tool crafting
- Potential byproduct: Ash bark (medicinal), tool handle blanks
- Trait ideas: Flexible, Shock-Resistant (tool durability)

**Walnut** (Level 15-16):
- Real-world properties: Rich color, works beautifully, high value
- Gameplay use: Luxury furniture, decorative items
- Potential byproduct: Walnut husks (dye), walnut oil
- Trait ideas: Lustrous, Fine Workability

#### Northern Conifers
**Spruce** (Level 17-18):
- Real-world properties: Lightweight, resonant, used for musical instruments
- Gameplay use: Construction, specialty crafting
- Potential byproduct: Spruce pitch (adhesive), spruce tips (food)
- Trait ideas: Resonant (musical instrument bonus), Lightweight

**Fir** (Level 19-20):
- Real-world properties: Strong for weight, pleasant aroma
- Gameplay use: Construction lumber, aromatic products
- Potential byproduct: Fir needles (tea/alchemy), fir balsam
- Trait ideas: Aromatic, Strong Fibers

**Cedar** (Level 21-22):
- Real-world properties: Aromatic, insect-resistant, weather-resistant
- Gameplay use: Storage chests, outdoor structures
- Potential byproduct: Cedar oil (preservative), cedar shavings
- Trait ideas: Insect-Resistant, Aromatic Preservation

#### Rare/Exotic Woods (High Level)
**Ironwood** (Level 23-25):
- Real-world properties: Extremely dense, sinks in water, very hard
- Gameplay use: Weapon cores, heavy-duty tools, armor components
- Potential byproduct: Ironwood splinters (rare), compressed sawdust
- Trait ideas: Dense, Unyielding (weapon damage bonus)

**Ebony** (Level 26-28):
- Real-world properties: Very dark, extremely hard, high value
- Gameplay use: Luxury items, high-tier weapons, decorative inlays
- Potential byproduct: Ebony dust (ink/dye), ebony heartwood
- Trait ideas: Lustrous Black, Superior Hardness

**Ancient Yew** (Level 29-30):
- Real-world properties: Elastic, traditional bow wood, extremely slow-growing
- Gameplay use: Premium bows, longbows, ceremonial items
- Potential byproduct: Yew berries (alchemy - toxic), sacred bark
- Trait ideas: Elastic, Ancient Growth (significant bonuses)

### Mainland Trait System

Unlike starter island's simple traits (Pristine, Balanced), mainland introduces **specialized traits** that enhance specific crafting paths:

**Construction Traits**:
- Water-Resistant (cypress, mangrove) - Structures near water resist decay
- Weather-Resistant (cedar) - Outdoor structures last longer
- Insect-Resistant (cedar) - Storage items protected from pests

**Crafting Quality Traits**:
- Fine Grain (maple, walnut) - Furniture quality bonus
- Lustrous (walnut, ebony) - Decorative item value boost
- Workability (ash, maple) - Crafting success rate increase

**Combat/Tool Traits**:
- Dense (ironwood, ebony) - Weapon damage bonus
- Flexible (ash, yew) - Tool/weapon durability bonus
- Shock-Resistant (ash) - Tool efficiency bonus
- Elastic (yew) - Bow damage/range bonus

**Specialty Traits**:
- Aromatic (cedar, fir) - Storage preservation, alchemy bonus
- Resonant (spruce) - Musical instrument quality
- Ancient Growth (yew) - All bonuses increased

### Mainland Rare Drops

**New Universal Rare Finds** (expansion of RareWoodcuttingFinds):
- Amber (existing, all trees)
- Petrified Wood Fragments (ancient/rare trees, high value gemstone)
- Forest Relics (ancient artifacts at old tree roots)
- Rare Fungus (specialty alchemy ingredients)

**Tree-Specific Byproducts** (expand existing pattern):
- Resins/Saps: Pine Resin, Spruce Pitch, Fir Balsam, Cedar Oil, Maple Syrup
- Barks: Birch Bark, Ash Bark, Mangrove Bark, Sacred Yew Bark
- Specialty Items: Cypress Knees, Walnut Husks, Cedar Shavings, Ebony Dust

**Higher-Tier Seeds** (Mainland exclusive, T4-T5):
- Tier 4 (100g, RARE): Exotic vegetables for advanced farming
- Tier 5 (200g, EPIC): Rare herbs, magical plants, specialty crops
- Mainland seeds may carry growth traits (Fast Growing, Hardy, Bountiful)

### Progression Design

**Level Ranges**:
- **Port/Marshland** (7-10): Transitional difficulty, introduces marshland mechanics
- **Mainland Temperate** (11-16): Core mainland progression, quality hardwoods
- **Northern Regions** (17-22): Conifers, harsher climate, specialty resources
- **Rare/Exotic** (23-30): Endgame content, prestigious woods, maximum rewards

**Activity Duration Scaling**:
- Starter Island: 6s (pine) → 8s (oak) → 10s (birch)
- Port/Marshland: 12s → 14s
- Mainland Temperate: 16s → 18s → 20s
- Northern: 22s → 24s → 26s
- Rare/Exotic: 28s → 32s → 35s

**XP Scaling** (follows tiered curve system):
- Starter: 20 XP (levels 1-5)
- Port: 40-60 XP (levels 7-10)
- Mainland: 80-120 XP (levels 11-16)
- Northern: 140-180 XP (levels 17-22)
- Rare: 200-250 XP (levels 23-30)

## Technical Implementation

### Files Created

**Items** (be/data/items/definitions/resources/):
- PineLog.ts, BirchLog.ts (logs)
- PineResin.ts, BirchBark.ts (byproducts)
- Amber.ts (gemstone)
- LettuceSeeds.ts, CarrotSeeds.ts, TurnipSeeds.ts (T1 seeds)
- PotatoSeeds.ts, OnionSeeds.ts, CabbageSeeds.ts (T2 seeds)
- StrawberrySeeds.ts, TomatoSeeds.ts, PumpkinSeeds.ts (T3 seeds)

**Activities** (be/data/locations/activities/):
- ActivityChopPine.ts (new, level 1)
- ActivityChopBirch.ts (new, level 5)
- ActivityChopOak.ts (modified, level 1 → 3)

**Drop Tables** (be/data/locations/drop-tables/):
- WoodcuttingPine.ts, WoodcuttingBirch.ts (base loot)
- RareWoodcuttingPine.ts, RareWoodcuttingOak.ts, RareWoodcuttingBirch.ts (tree-specific rares)
- RareWoodcuttingFinds.ts (universal rares)

**Registries Modified**:
- ItemRegistry.ts - Added 10 items (1 gemstone + 9 seeds)
- ActivityRegistry.ts - Added 2 activities (Pine, Birch)
- DropTableRegistry.ts - Added 4 drop tables (universal finds + oak rares + 2 base tables)

**Facility Modified**:
- ForestLoggingCamp.ts - Updated activities array to include all three

### Validation

Ran `npm run validate` - **0 errors**, 17 warnings (expected, related to missing weapon subtypes for combat abilities).

**Registry Stats After Implementation**:
- Items: 93 total (+10 from this expansion)
- Drop Tables: 27 total (+4 from this expansion)
- Activities: 22 total (+2 from this expansion)

### Constants Used

All items follow type-safe constant pattern:
```typescript
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

// Example: Pine Resin
category: CATEGORY.RESOURCE
subcategories: [SUBCATEGORY.CRAFTING, SUBCATEGORY.ALCHEMY]
rarity: RARITY.UNCOMMON
properties: { tier: TIER.T1, skillSource: SKILL_SOURCE.WOODCUTTING }
allowedQualities: QUALITY_SETS.NONE
allowedTraits: TRAIT_SETS.PRISTINE
```

## Future Integration: Farming Skill

### Seed-to-Crop Pipeline (Planned)

**Phase 1: Player Housing** (Construction Skill):
- Players build/acquire houses with garden plots
- Garden plots have limited space (6-12 slots depending on house tier)
- Plots require preparation (tilling, fertilizing)

**Phase 2: Farming Skill**:
- Plant seeds in prepared garden plots
- Watering/maintenance activities
- Crops grow over real-world time (hours to days depending on tier)
- Harvest yields vegetables/herbs with quality inheritance

**Phase 3: Crop System**:
- Crops can be consumed (food), used in alchemy, or sold
- Higher-tier crops have better stats/effects
- Crop quality affected by: seed quality, farming skill, maintenance
- Potential traits: Fast Growing (-20% growth time), Hardy (+quality), Bountiful (+yield)

### Economic Flow

```
Woodcutting Activity
        ↓
  Find Seed Drops (1-2 per drop)
        ↓
    ┌───┴───┐
    ↓       ↓
Sell to    Plant in
Vendor     Garden
(15-50g)      ↓
         Grow Crops
              ↓
         ┌────┴────┐
         ↓         ↓
    Consume    Sell to
   (food/     Vendor
   alchemy)   (higher value)
```

**Value Proposition**:
- Woodcutters have steady income from seed drops
- Farmers need to buy/trade for seeds
- Crops worth more than raw seeds (incentivizes farming skill)
- Creates interdependence between gathering skills

## Design Lessons Learned

### What Worked Well

1. **Realistic Progression**: Softwood → hardwood follows real-world logic, feels intuitive
2. **Dual-Layer Drop Tables**: Clean architecture, separates tree-specific from universal drops
3. **Cross-Skill Planning**: Seeds create economic value now, support future content later
4. **Tiered Value**: 15g → 30g → 50g seed progression motivates level advancement

### Considerations for Mainland

1. **Trait Complexity**: Mainland can introduce specialized traits without overwhelming new players
2. **Biome Diversity**: Different regions should feel distinct (marsh ≠ forest ≠ northern)
3. **Resource Identity**: Each wood type should have clear use cases (cypress for boats, yew for bows)
4. **Economic Balance**: Mainland woods should be more valuable but not invalidate starter island

### Reusable Patterns

**For Other Gathering Skills** (Mining, Fishing, Gathering):
- Use dual-layer rare tables (skill-specific + universal finds)
- Include "future skill" drops (like seeds for farming)
- Create byproducts for alchemy/crafting (resin, bark model)
- Scale difficulty realistically (common resources → exotic)

## Related Documentation

- [project/docs/002-drop-table-system.md](002-drop-table-system.md) - Drop table architecture
- [project/docs/015-inventory-system.md](015-inventory-system.md) - Item definitions and traits
- [project/docs/031-location-system.md](031-location-system.md) - Activities and locations
- [project/docs/043-resource-weight-yield-rebalancing.md](043-resource-weight-yield-rebalancing.md) - Resource weight balancing

## Summary

Transformed woodcutting from single-activity placeholder into full progression system with:
- ✅ **3 starter island activities** (Pine L1, Oak L3, Birch L5)
- ✅ **10 new items** (3 logs, 2 byproducts, 1 gemstone, 9 seeds spanning 3 tiers)
- ✅ **Dual-layer rare drop architecture** (tree-specific + universal finds)
- ✅ **Cross-skill economic synergy** (woodcutting → future farming)
- 📋 **Mainland expansion plan** (13+ wood types, specialized traits, biome diversity)

System ready for player use on starter island, with clear roadmap for mainland content expansion.
