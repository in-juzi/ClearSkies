/**
 * Trout - A freshly caught trout
 * Tier: 1
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Trout: ConsumableItem = {
  "itemId": "trout",
  "name": "Trout",
  "description": "A freshly caught trout",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.FISH_FRESHWATER,
  "baseValue": 15,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.8,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.FISHING
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
