/**
 * Nettle - Stinging leaves that, when properly prepared, provide remarkable healing properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Nettle: ResourceItem = {
  "itemId": "nettle",
  "name": "Nettle",
  "description": "Stinging leaves that, when properly prepared, provide remarkable healing properties",
  "category": "resource",
  "subcategories": [
    "herb",
    "leaf",
    "medicinal"
  ],
  "baseValue": 25,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": "herb",
    "tier": 2,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
