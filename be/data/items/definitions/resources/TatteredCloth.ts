/**
 * Tattered Cloth - Worn cloth scraps salvaged from defeated enemies. Barely useful, but can be sold for a few coins.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const TatteredCloth: ResourceItem = {
  "itemId": "tattered_cloth",
  "name": "Tattered Cloth",
  "description": "Worn cloth scraps salvaged from defeated enemies. Barely useful, but can be sold for a few coins.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP_CLOTH,
  "rarity": RARITY.COMMON,
  "baseValue": 2,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/folded-paper.svg",
    "material": "cloth"
  }
} as const;
