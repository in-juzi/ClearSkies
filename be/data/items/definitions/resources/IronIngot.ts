/**
 * Iron Ingot - A heavy iron ingot smelted from pure ore, its dark gray surface promises strength and durability
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronIngot: ResourceItem = {
  "itemId": "iron_ingot",
  "name": "Iron Ingot",
  "description": "A heavy iron ingot smelted from pure ore, its dark gray surface promises strength and durability",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.INGOT,
  "baseValue": 120,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 7,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.SMITHING
  },
  "allowedTraits": [
    "pristine",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_ingot.svg",
    "material": "iron_ingot"
  },
  "allowedQualities": QUALITY_SETS.NONE
} as const;
