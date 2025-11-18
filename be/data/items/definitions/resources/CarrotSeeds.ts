/**
 * Carrot Seeds - Seeds for growing sweet carrots
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const CarrotSeeds: ResourceItem = {
  "itemId": "carrot_seeds",
  "name": "Carrot Seeds",
  "description": "Tiny seeds for growing sweet carrots. Often found in caches hidden by foraging animals.",
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
