/**
 * Salmon - A prized salmon, rich in flavor
 * Tier: 2
 */

import { ConsumableItem } from '../../../../types/items';

export const Salmon: ConsumableItem = {
  "itemId": "salmon",
  "name": "Salmon",
  "description": "A prized salmon, rich in flavor",
  "category": "consumable",
  "subcategories": [
    "fish",
    "freshwater"
  ],
  "baseValue": 35,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 1.5,
    "material": "fish",
    "tier": 2,
    "skillSource": "fishing"
  },
  "allowedQualities": [
    "size",
    "juicy"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_meat.svg",
    "material": "fish"
  }
} as const;
