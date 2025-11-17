/**
 * Pine Log - A lightweight softwood log, ideal for beginner woodcutters
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const PineLog: ResourceItem = {
  "itemId": "pine_log",
  "name": "Pine Log",
  "description": "A lightweight softwood log from a pine tree. Easy to work with and commonly used for basic construction and firewood.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG_BUILDING,
  "baseValue": 15,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.WOOD_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_log.svg",
    "material": "pine_log"
  }
} as const;
