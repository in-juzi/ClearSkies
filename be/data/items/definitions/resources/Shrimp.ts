/**
 * Shrimp - Small shellfish caught in shallow waters
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Shrimp: ConsumableItem = {
  "itemId": "shrimp",
  "name": "Shrimp",
  "description": "Small shellfish caught in shallow waters",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.FISH_SHELLFISH,
  "baseValue": 8,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
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
    "path": "items/shrimp.svg",
    "material": "raw_shrimp"
  }
} as const;
