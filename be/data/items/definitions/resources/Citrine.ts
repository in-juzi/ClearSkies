/**
 * Citrine - A golden-yellow quartz variety that gleams like captured sunlight, warm to the touch
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Citrine: ResourceItem = {
  "itemId": "citrine",
  "name": "Citrine",
  "description": "A golden-yellow quartz variety that gleams like captured sunlight, warm to the touch",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "crystal",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 25,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 1,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "citrine"
  }
} as const;
