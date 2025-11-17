/**
 * Cabbage Seeds - Seeds for growing robust cabbage
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const CabbageSeeds: ResourceItem = {
  "itemId": "cabbage_seeds",
  "name": "Cabbage Seeds",
  "description": "Seeds for growing hardy cabbage. Often found in caches hidden by foraging animals.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.CRAFTING, "seed", "farming"],
  "baseValue": 30,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.05,
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
