/**
 * Bronze Ingot - A sturdy bronze ingot forged from copper and tin, warm to the touch and gleaming with a golden hue
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const BronzeIngot: ResourceItem = {
  "itemId": "bronze_ingot",
  "name": "Bronze Ingot",
  "description": "A sturdy bronze ingot forged from copper and tin, warm to the touch and gleaming with a golden hue",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.INGOT,
  "baseValue": 80,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 4.5,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.SMITHING
  },
  "allowedTraits": [
    "pristine",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_ingot.svg",
    "material": "bronze_ingot"
  },
  "allowedQualities": QUALITY_SETS.NONE
} as const;
