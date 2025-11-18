/**
 * Wolf Pelt - A thick pelt from a forest wolf. Valuable for crafting leather armor and warm clothing.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const WolfPelt: ResourceItem = {
  "itemId": "wolf_pelt",
  "name": "Wolf Pelt",
  "description": "A thick pelt from a forest wolf. Valuable for crafting leather armor and warm clothing.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.MONSTER_DROP,
  "rarity": RARITY.COMMON,
  "baseValue": 15,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 1.5,
    "material": MATERIAL.LEATHER,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.PURITY,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "items/animal-hide.svg",
    "material": "leather"
  }
} as const;
