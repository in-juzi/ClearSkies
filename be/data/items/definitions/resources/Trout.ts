/**
 * Trout - A freshly caught trout
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const Trout: ConsumableItem = {
  "itemId": "trout",
  "name": "Trout",
  "description": "A freshly caught trout",
  "category": "consumable",
  "subcategories": [
    "fish",
    "freshwater"
  ],
  "baseValue": 15,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 1,
    "material": "fish",
    "tier": 1,
    "skillSource": "fishing"
  },
  "allowedQualities": [
    "size",
    "juicy"
  ],
  "allowedTraits": [
    "pristine"
  ],
  "icon": {
    "path": "item-categories/item_cat_meat.svg",
    "material": "fish"
  }
} as const;
