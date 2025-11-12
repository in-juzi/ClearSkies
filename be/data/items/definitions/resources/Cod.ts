/**
 * Cod - A thick-fleshed cod, prized for its meaty texture
 * Tier: 3
 */

import { ConsumableItem } from '../../../../types/items';

export const Cod: ConsumableItem = {
  "itemId": "cod",
  "name": "Cod",
  "description": "A thick-fleshed cod, prized for its meaty texture",
  "category": "consumable",
  "subcategories": [
    "fish",
    "saltwater"
  ],
  "baseValue": 50,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 2.0,
    "material": "fish",
    "tier": 3,
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
