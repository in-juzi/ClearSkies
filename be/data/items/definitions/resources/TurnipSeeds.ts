/**
 * Turnip Seeds - Seeds for growing hearty turnips
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const TurnipSeeds: ResourceItem = {
  "itemId": "turnip_seeds",
  "name": "Turnip Seeds",
  "description": "Hardy seeds for growing turnips. Often found in caches hidden by foraging animals.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.CRAFTING, "seed", "farming"],
  "baseValue": 15,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.05,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_crafting.svg",
    "material": "generic"
  }
} as const;
