# Icon Catalog Index

**Collection**: Lorc (Game Icons Project)
**Total Icons**: 1,429
**Analyzed**: 10
**Last Updated**: 2025-11-09

---

## About This Catalog

This catalog contains AI-analyzed metadata for the Lorc icon collection, including:
- Visual descriptions
- Tags and categories
- Game use case suggestions
- ClearSkies relevance scores (1-10 scale)

**Source Path**: `C:\Users\trace\OneDrive\Documents\Projects\Game Icons Project\icons\ffffff\000000\1x1\lorc (1429)`

---

## Top Icons for ClearSkies (Medieval Fantasy)

### 🔥 High Priority (Relevance Score: 9-10)

| Icon | Score | Description | Use Cases |
|------|-------|-------------|-----------|
| **acorn** | 10 | Forest resource with cap | Gathering, crafting, herbalism rewards |
| **aerodynamic-harpoon** | 9 | Sleek fishing/throwing weapon | Fishing tools, ranged weapons |
| **acid-blob** | 8 | Slime creature with eyes | Enemy icons, poison effects |

### ⚡ Medium Priority (Relevance Score: 6-8)

| Icon | Score | Description | Use Cases |
|------|-------|-------------|-----------|
| **afterburn** | 7 | Lingering flame effect | Fire damage, burn debuffs |
| **air-zigzag** | 6 | Lightning/wind energy | Wind spells, lightning abilities |
| **alien-fire** | 5 | Supernatural flame | Magical fire spells |
| **alien-skull** | 4 | Insectoid skull | Death markers, exotic enemies |

### ❄️ Low Priority (Relevance Score: 1-5)

| Icon | Score | Description | Use Cases |
|------|-------|-------------|-----------|
| **ace** | 3 | Playing card symbol | Gambling minigames |
| **aerosol** | 3 | Spray can effect | Poison items, effects |
| **aerial-signal** | 2 | Radio tower (modern) | Low medieval fantasy fit |

---

## Categories

### 🌲 Resources & Gathering
- **acorn** - Forest resource, gathering material

### ⚔️ Weapons & Tools
- **aerodynamic-harpoon** - Fishing/throwing weapon

### 🐉 Creatures & Enemies
- **acid-blob** - Slime monster
- **alien-skull** - Exotic creature

### ✨ Magic & Effects
- **afterburn** - Fire damage effect
- **air-zigzag** - Wind/lightning magic
- **alien-fire** - Supernatural fire

### 🎲 Items & Consumables
- **ace** - Game/collectible item
- **aerosol** - Spray/poison item
- **acorn** - Food/crafting item

### 📡 Other
- **aerial-signal** - Communication/tech (low medieval fit)

---

## Quick Search

### By Game System

**Gathering System**
- acorn (herbalism, foraging)

**Fishing System**
- aerodynamic-harpoon (fishing tool)

**Combat System**
- acid-blob (enemy type)
- afterburn (fire damage)
- air-zigzag (lightning damage)

**Crafting System**
- acorn (crafting material)
- aerosol (alchemy component)

---

## Analysis Progress

```
Progress: [▓▓░░░░░░░░░░░░░░░░░░] 0.7% (10/1429 icons)

Status: Initial batch complete
Next: Continue batch analysis (10-20 icons at a time)
```

---

## Usage Guide

### In Game Code

```javascript
// Load icon catalog
const catalog = require('./project/icon-catalog.json');

// Find icons by tag
function findIconsByTag(tag) {
  return catalog.icons.filter(icon => icon.tags.includes(tag));
}

// Get high-relevance icons
function getRecommendedIcons(minScore = 7) {
  return catalog.icons.filter(icon => icon.relevanceScore.clearSkies >= minScore);
}

// Search by category
function getIconsByCategory(category) {
  return catalog.categories[category].map(id =>
    catalog.icons.find(icon => icon.id === id)
  );
}
```

### Recommended Icons for Current Systems

**Herbalism System** (recently added)
- ✅ acorn - Perfect for forest gathering
- 🔍 Need to analyze more plant/herb icons

**Fishing System** (existing)
- ✅ aerodynamic-harpoon - Alternative to fishing rod
- 🔍 Need to analyze more fish/water icons

**Combat System** (planned)
- ✅ acid-blob - Enemy type
- ✅ afterburn - Fire damage
- ✅ air-zigzag - Lightning damage
- 🔍 Need to analyze more weapon/armor icons

---

## Next Steps

1. **Continue Analysis**: Batch process remaining 1,419 icons
2. **Build Search Tool**: Create Node.js utility for querying catalog
3. **Integration**: Add icon picker UI to game
4. **Filtering**: Focus on medieval fantasy themed icons first
5. **Documentation**: Create icon usage guidelines

---

## Notes

- All icons are 512x512 SVG (scalable)
- White silhouette on black background
- Consistent style across collection
- High quality for game UI use
- Artist: Lorc (game-icons.net)
