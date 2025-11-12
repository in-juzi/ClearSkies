/**
 * Moonpetal - Luminescent white petals that shimmer in moonlight, used in the most potent elixirs
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Moonpetal: ResourceItem = {
  "itemId": "moonpetal",
  "name": "Moonpetal",
  "description": "Luminescent white petals that shimmer in moonlight, used in the most potent elixirs",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare"
  ],
  "baseValue": 80,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": "herb",
    "tier": 3,
    "skillSource": "herbalism"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
