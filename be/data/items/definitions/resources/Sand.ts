/**
 * Sand - Fine sand for glassmaking
 * Tier: 1
 * Gathered from beaches and riverbanks
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Sand: ResourceItem = {
  "itemId": "sand",
  "name": "Sand",
  "description": "Fine sand collected from beaches, used in glassmaking and construction",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.MINERAL, SUBCATEGORY.BUILDING],
  "baseValue": 5,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_powder.svg",
    "material": "sand"
  }
} as const;
