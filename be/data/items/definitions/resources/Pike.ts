/**
 * Pike - A fierce pike with sharp teeth
 * Tier: 3
 */

import { ConsumableItem } from '../../../../types/items';

export const Pike: ConsumableItem = {
  "itemId": "pike",
  "name": "Pike",
  "description": "A fierce pike with sharp teeth",
  "category": "consumable",
  "subcategories": [
    "fish",
    "freshwater"
  ],
  "baseValue": 50,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 2,
    "material": "fish",
    "tier": 3,
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
