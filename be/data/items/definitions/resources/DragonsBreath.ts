/**
 * Dragon's Breath - Rare crimson flowers that grow in volcanic soil, their petals warm to the touch
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const DragonsBreath: ResourceItem = {
  "itemId": "dragons_breath",
  "name": "Dragon's Breath",
  "description": "Rare crimson flowers that grow in volcanic soil, their petals warm to the touch",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare"
  ],
  "baseValue": 100,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "herb",
    "tier": 3,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
