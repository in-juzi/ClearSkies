/**
 * Passionflower - Exotic purple blooms with intricate radiating centers, said to inspire dreams and deep meditation
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Passionflower: ResourceItem = {
  "itemId": "passionflower",
  "name": "Passionflower",
  "description": "Exotic purple blooms with intricate radiating centers, said to inspire dreams and deep meditation",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "medicinal",
    "alchemical",
    "rare"
  ],
  "baseValue": 50,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": "herb",
    "tier": 3,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "passionflower"
  }
} as const;
