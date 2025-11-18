/**
 * Birch Bark - Distinctive white bark from birch trees
 * Tier: 2
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const BirchBark: ResourceItem = {
  "itemId": "birch_bark",
  "name": "Birch Bark",
  "description": "Strips of distinctive white bark from birch trees. Flexible and water-resistant, used in crafting, writing materials, and traditional medicine.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.CRAFTING, SUBCATEGORY.ALCHEMY],
  "baseValue": 30,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_crafting.svg",
    "material": "generic"
  }
} as const;
