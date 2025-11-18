/**
 * Leather Scraps - Small pieces of leather salvaged from worn armor. Useful for basic repairs and crafting.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const LeatherScraps: ResourceItem = {
  "itemId": "leather_scraps",
  "name": "Leather Scraps",
  "description": "Small pieces of leather salvaged from worn armor. Useful for basic repairs and crafting.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP,
  "rarity": RARITY.COMMON,
  "baseValue": 6,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.5,
    "material": MATERIAL.LEATHER,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.PURITY,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/folded-paper.svg",
    "material": "leather"
  }
} as const;
