/**
 * Nails - Iron nails for construction
 * Tier: 2
 * Crafted from iron ingots via smithing
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Nails: ResourceItem = {
  "itemId": "nails",
  "name": "Nails",
  "description": "Iron nails forged for joining construction materials together",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.INGOT, SUBCATEGORY.BUILDING],
  "baseValue": 8,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.05,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.SMITHING
  },
  "allowedQualities": QUALITY_SETS.INGOT,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_ingot.svg",
    "material": "iron"
  }
} as const;
