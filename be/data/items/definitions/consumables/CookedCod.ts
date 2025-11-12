/**
 * Cooked Cod - A hearty piece of baked cod with tender, flaky meat
 * Tier: 3
 */

import { ConsumableItem } from '../../../../types/items';

export const CookedCod: ConsumableItem = {
  "itemId": "cooked_cod",
  "name": "Cooked Cod",
  "description": "A hearty piece of baked cod with tender, flaky meat",
  "category": "consumable",
  "subcategories": [
    "food",
    "fish",
    "cooked",
    "healing"
  ],
  "baseValue": 75,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 1,
    "material": "food",
    "tier": 3,
    "healthRestore": 50,
    "craftedFrom": "cod"
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
