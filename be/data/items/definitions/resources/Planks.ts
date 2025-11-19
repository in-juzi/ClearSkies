/**
 * Planks - Processed wood planks for construction
 * Tier: 1
 * Crafted from logs at sawmill
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Planks: ResourceItem = {
  "itemId": "planks",
  "name": "Planks",
  "description": "Processed wood planks suitable for construction projects",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.WOOD_LOG_BUILDING,
  "baseValue": 10,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.WOOD,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.CONSTRUCTION
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE,
  "icon": {
    "path": "items/planks",
    "material": "planks"
  }
} as const;
