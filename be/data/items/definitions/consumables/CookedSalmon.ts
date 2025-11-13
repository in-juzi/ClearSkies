/**
 * Cooked Salmon - A savory cooked salmon with excellent restorative properties
 * Tier: 2
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL } from '../../../constants/item-constants';

export const CookedSalmon: ConsumableItem = {
  "itemId": "cooked_salmon",
  "name": "Cooked Salmon",
  "description": "A savory cooked salmon with excellent restorative properties",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.COOKED_FOOD,
  "baseValue": 60,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.8,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2,
    "healthRestore": 40,
    "craftedFrom": "salmon"
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.FOOD,
  "icon": {
    "path": "item-categories/item_cat_food.svg",
    "material": "food"
  }
} as const;
