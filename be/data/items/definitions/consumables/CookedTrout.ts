/**
 * Cooked Trout - A delicious cooked trout that restores health
 * Tier: 1
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL } from '../../../constants/item-constants';

export const CookedTrout: ConsumableItem = {
  "itemId": "cooked_trout",
  "name": "Cooked Trout",
  "description": "A delicious cooked trout that restores health",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.COOKED_FOOD,
  "baseValue": 25,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "healthRestore": 20,
    "craftedFrom": "trout"
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.FOOD,
  "icon": {
    "path": "item-categories/item_cat_food.svg",
    "material": "food"
  }
} as const;
