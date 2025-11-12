/**
 * Cooked Salmon - A savory cooked salmon with excellent restorative properties
 * Tier: 2
 */

import { ConsumableItem } from '../../../../types/items';

export const CookedSalmon: ConsumableItem = {
  "itemId": "cooked_salmon",
  "name": "Cooked Salmon",
  "description": "A savory cooked salmon with excellent restorative properties",
  "category": "consumable",
  "subcategories": [
    "food",
    "fish",
    "cooked",
    "healing"
  ],
  "baseValue": 60,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.8,
    "material": "food",
    "tier": 2,
    "healthRestore": 40,
    "craftedFrom": "salmon"
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
