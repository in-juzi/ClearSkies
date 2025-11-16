/**
 * Salmon - A prized salmon, rich in flavor
 * Tier: 2
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Salmon: ConsumableItem = {
  "itemId": "salmon",
  "name": "Salmon",
  "description": "A prized salmon, rich in flavor",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.FISH_FRESHWATER,
  "baseValue": 35,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 1.2,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.FISHING
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
