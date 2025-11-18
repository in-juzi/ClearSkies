/**
 * Cooked Cod - A hearty piece of baked cod with tender, flaky meat
 * Tier: 3
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, CONSUMABLE_SUBTYPE } from '../../../constants/item-constants';

export const CookedCod: ConsumableItem = {
  "itemId": "cooked_cod",
  "name": "Cooked Cod",
  "description": "A hearty piece of baked cod with tender, flaky meat",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.COOKED_FOOD,
  "baseValue": 75,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 1,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3,
    "healthRestore": 50,
    "craftedFrom": "cod"
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.FOOD,
  "icon": {
    "path": "item-categories/item_cat_food.svg",
    "material": "food"
  }
} as const;
