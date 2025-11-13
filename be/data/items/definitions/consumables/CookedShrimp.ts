/**
 * Cooked Shrimp - Succulent garlic shrimp, perfectly seasoned and cooked
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL } from '../../../constants/item-constants';

export const CookedShrimp: ConsumableItem = {
  "itemId": "cooked_shrimp",
  "name": "Cooked Shrimp",
  "description": "Succulent garlic shrimp, perfectly seasoned and cooked",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.COOKED_FOOD,
  "baseValue": 35,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "healthRestore": 25,
    "craftedFrom": "shrimp"
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.FOOD,
  "icon": {
    "path": "items/shrimp.svg",
    "material": "cooked_shrimp"
  }
} as const;
