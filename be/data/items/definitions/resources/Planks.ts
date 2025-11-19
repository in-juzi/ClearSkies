/**
 * Planks - Processed wood planks for construction
 * Tier: 1
 * Crafted from logs at sawmill
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Planks: ResourceItem = {
  "itemId": "planks",
  "name": "Planks",
  "description": "Processed wood planks suitable for construction projects",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.WOOD, SUBCATEGORY.TIMBER, SUBCATEGORY.BUILDING_MATERIAL],
  "baseValue": 10,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.WOOD,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.CONSTRUCTION
  },
  "allowedQualities": [],
  "allowedTraits": [],
  "icon": {
    "path": "items/planks.svg",
    "material": "planks"
  }
} as const;
