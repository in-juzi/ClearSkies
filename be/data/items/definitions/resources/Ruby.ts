/**
 * Ruby - A brilliant crimson gemstone that seems to hold an inner fire, prized by jewelers and enchanters alike
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Ruby: ResourceItem = {
  "itemId": "ruby",
  "name": "Ruby",
  "description": "A brilliant crimson gemstone that seems to hold an inner fire, prized by jewelers and enchanters alike",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 250,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 3,
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
    "material": "ruby"
  }
} as const;
