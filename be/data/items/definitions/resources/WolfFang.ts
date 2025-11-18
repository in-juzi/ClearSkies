/**
 * Wolf Fang - A sharp fang from a forest wolf. Can be used in crafting or sold to collectors.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const WolfFang: ResourceItem = {
  "itemId": "wolf_fang",
  "name": "Wolf Fang",
  "description": "A sharp fang from a forest wolf. Can be used in crafting or sold to collectors.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP,
  "rarity": RARITY.COMMON,
  "baseValue": 8,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "items/saber-tooth.svg",
    "material": "bone"
  }
} as const;
