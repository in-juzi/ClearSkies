/**
 * Birch Log - A light-colored hardwood log with distinctive bark
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const BirchLog: ResourceItem = {
  "itemId": "birch_log",
  "name": "Birch Log",
  "description": "A light-colored log from a birch tree. Known for its distinctive white bark and clean grain, prized for furniture and decorative crafts.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG_BUILDING,
  "baseValue": 35,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.WOOD_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_log.svg",
    "material": "birch_log"
  }
} as const;
