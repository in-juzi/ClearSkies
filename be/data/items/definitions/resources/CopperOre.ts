/**
 * Copper Ore - Raw copper ore, ready to be smelted
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const CopperOre: ResourceItem = {
  "itemId": "copper_ore",
  "name": "Copper Ore",
  "description": "Raw copper ore, ready to be smelted",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.ORE,
  "baseValue": 30,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 2.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "copper_ore"
  }
} as const;
