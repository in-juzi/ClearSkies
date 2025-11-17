/**
 * Tomato Seeds - Seeds for growing juicy tomatoes
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const TomatoSeeds: ResourceItem = {
  "itemId": "tomato_seeds",
  "name": "Tomato Seeds",
  "description": "Valuable seeds for growing juicy tomatoes. Often found in caches hidden by foraging animals.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.CRAFTING, "seed", "farming"],
  "baseValue": 50,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.05,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_crafting.svg",
    "material": "generic"
  }
} as const;
