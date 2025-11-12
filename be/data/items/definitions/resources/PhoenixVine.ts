/**
 * Phoenix Vine - Legendary crimson blooms with molten gold centers, said to regenerate from ash and grant vitality to the worthy
 * Tier: 4
 */

import { ResourceItem } from '../../../../types/items';

export const PhoenixVine: ResourceItem = {
  "itemId": "phoenix_vine",
  "name": "Phoenix Vine",
  "description": "Legendary crimson blooms with molten gold centers, said to regenerate from ash and grant vitality to the worthy",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare",
    "legendary"
  ],
  "baseValue": 150,
  "rarity": "epic",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "herb",
    "tier": 4,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "cursed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "phoenix_vine"
  }
} as const;
