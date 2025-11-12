/**
 * Topaz - A brilliant golden gemstone that catches firelight beautifully, highly sought after by jewelers
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Topaz: ResourceItem = {
  "itemId": "topaz",
  "name": "Topaz",
  "description": "A brilliant golden gemstone that catches firelight beautifully, highly sought after by jewelers",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "semi-precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 100,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 2,
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
    "material": "topaz"
  }
} as const;
