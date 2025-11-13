/**
 * Tin Ore - Raw tin ore, lightweight and essential for bronze alloys
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const TinOre: ResourceItem = {
  "itemId": "tin_ore",
  "name": "Tin Ore",
  "description": "Raw tin ore, lightweight and essential for bronze alloys",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.ORE,
  "baseValue": 25,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 4,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "tin_ore"
  }
} as const;
