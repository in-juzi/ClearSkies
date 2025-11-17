/**
 * Potato Seeds - Seeds for growing staple potatoes
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const PotatoSeeds: ResourceItem = {
  "itemId": "potato_seeds",
  "name": "Potato Seeds",
  "description": "Valuable seeds for growing hearty potatoes. Often found in caches hidden by foraging animals.",
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
