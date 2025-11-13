/**
 * Scrap Metal - Broken pieces of metal salvaged from crude weapons and armor. Can be smelted down for raw materials.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const ScrapMetal: ResourceItem = {
  "itemId": "scrap_metal",
  "name": "Scrap Metal",
  "description": "Broken pieces of metal salvaged from crude weapons and armor. Can be smelted down for raw materials.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP_METAL,
  "rarity": RARITY.COMMON,
  "baseValue": 4,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.PURITY,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "item-categories/item_cat_scrap.svg",
    "material": "iron"
  }
} as const;
