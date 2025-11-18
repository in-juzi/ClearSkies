/**
 * Pike - A fierce pike with sharp teeth
 * Tier: 3
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Pike: ConsumableItem = {
  "itemId": "pike",
  "name": "Pike",
  "description": "A fierce pike with sharp teeth",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.FISH_FRESHWATER,
  "baseValue": 50,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 1.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3,
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
