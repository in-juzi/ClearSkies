/**
 * Raw Meat - Fresh meat from a wild animal. Can be cooked into a hearty meal.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const RawMeat: ResourceItem = {
  "itemId": "raw_meat",
  "name": "Raw Meat",
  "description": "Fresh meat from a wild animal. Can be cooked into a hearty meal.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP_FOOD,
  "rarity": RARITY.COMMON,
  "baseValue": 5,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 2,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.PURITY,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/raw-meat.svg",
    "material": "raw_meat"
  }
} as const;
