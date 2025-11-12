/**
 * Emerald - A lustrous green gemstone of exceptional clarity, said to enhance magical abilities and bring good fortune
 * Tier: 4
 */

import { ResourceItem } from '../../../../types/items';

export const Emerald: ResourceItem = {
  "itemId": "emerald",
  "name": "Emerald",
  "description": "A lustrous green gemstone of exceptional clarity, said to enhance magical abilities and bring good fortune",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 300,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 4,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "emerald"
  }
} as const;
