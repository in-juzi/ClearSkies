/**
 * Glass - Clear glass panes for construction
 * Tier: 2
 * Crafted from sand via glassblowing
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Glass: ResourceItem = {
  "itemId": "glass",
  "name": "Glass",
  "description": "Clear glass panes crafted through intense heat, used in advanced construction",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.MINERAL, SUBCATEGORY.BUILDING],
  "baseValue": 20,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.4,
    "material": MATERIAL.GLASS,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.ALCHEMY
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_gem.svg",
    "material": "glass"
  }
} as const;
