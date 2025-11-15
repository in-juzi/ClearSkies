/**
 * Willow Log - A flexible willow log, prized for its magical properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const WillowLog: ResourceItem = {
  "itemId": "willow_log",
  "name": "Willow Log",
  "description": "A flexible willow log, prized for its magical properties",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG_MAGICAL,
  "baseValue": 50,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.WILLOW,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.WOOD_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_log.svg",
    "material": "willow_log"
  }
} as const;
