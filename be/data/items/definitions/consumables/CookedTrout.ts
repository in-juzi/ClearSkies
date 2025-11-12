/**
 * Cooked Trout - A delicious cooked trout that restores health
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const CookedTrout: ConsumableItem = {
  "itemId": "cooked_trout",
  "name": "Cooked Trout",
  "description": "A delicious cooked trout that restores health",
  "category": "consumable",
  "subcategories": [
    "food",
    "fish",
    "cooked",
    "healing"
  ],
  "baseValue": 25,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": "food",
    "tier": 1,
    "healthRestore": 20,
    "craftedFrom": "trout"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_food.svg",
    "material": "food"
  }
} as const;
