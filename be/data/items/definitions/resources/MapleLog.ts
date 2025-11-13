/**
 * Maple Log - A fine maple log with beautiful grain patterns
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const MapleLog: ResourceItem = {
  "itemId": "maple_log",
  "name": "Maple Log",
  "description": "A fine maple log with beautiful grain patterns",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG,
  "baseValue": 75,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.MAPLE,
    "tier": TIER.T3,
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
    "material": "maple_log"
  }
} as const;
