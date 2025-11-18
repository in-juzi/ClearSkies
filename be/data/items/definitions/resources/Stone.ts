/**
 * Stone - Quarried stone blocks for construction
 * Tier: 1
 * Gathered from quarry activities
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Stone: ResourceItem = {
  "itemId": "stone",
  "name": "Stone",
  "description": "Solid stone blocks quarried from rock faces, essential for sturdy construction",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.ORE, SUBCATEGORY.BUILDING],
  "baseValue": 15,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 1.0,
    "material": MATERIAL.STONE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_rock.svg",
    "material": "stone"
  }
} as const;
