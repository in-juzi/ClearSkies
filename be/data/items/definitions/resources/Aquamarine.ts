/**
 * Aquamarine - A pale cyan gemstone reminiscent of clear ocean waters, said to protect sailors at sea
 * Tier: 3
 */

import { ResourceItem } from '@shared/types';
import {
  CATEGORY,
  RARITY,
  TIER,
  SUBCATEGORIES,
  QUALITY_SETS,
  TRAIT_SETS,
  SKILL_SOURCE,
  MATERIAL
} from '../../../constants/item-constants';

export const Aquamarine: ResourceItem = {
  "itemId": "aquamarine",
  "name": "Aquamarine",
  "description": "A pale cyan gemstone reminiscent of clear ocean waters, said to protect sailors at sea",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 120,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "aquamarine"
  }
} as const;
