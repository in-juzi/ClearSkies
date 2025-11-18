/**
 * Iron Ore - Raw iron ore, the backbone of any smithy
 * Tier: 2
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronOre: ResourceItem = {
  "itemId": "iron_ore",
  "name": "Iron Ore",
  "description": "Raw iron ore, the backbone of any smithy",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.ORE,
  "baseValue": 60,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 4,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "iron_ore"
  }
} as const;
