/**
 * Oak Log - A sturdy oak log, useful for construction and crafting
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const OakLog: ResourceItem = {
  "itemId": "oak_log",
  "name": "Oak Log",
  "description": "A sturdy oak log, useful for construction and crafting",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG_BUILDING,
  "baseValue": 25,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.OAK,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": [
    "woodGrain",
    "moisture",
    "age"
  ],
  "allowedTraits": [
    "fragrant",
    "weathered",
    "pristine"
  ],
  "icon": {
    "path": "item-categories/item_cat_log.svg",
    "material": "oak_log"
  }
} as const;
