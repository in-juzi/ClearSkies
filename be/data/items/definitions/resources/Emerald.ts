/**
 * Emerald - A lustrous green gemstone of exceptional clarity, said to enhance magical abilities and bring good fortune
 * Tier: 4
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

export const Emerald: ResourceItem = {
  "itemId": "emerald",
  "name": "Emerald",
  "description": "A lustrous green gemstone of exceptional clarity, said to enhance magical abilities and bring good fortune",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 300,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.GEMSTONE,
    "tier": 4,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "emerald"
  }
} as const;
