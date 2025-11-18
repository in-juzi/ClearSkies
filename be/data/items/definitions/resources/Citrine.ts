/**
 * Citrine - A golden-yellow quartz variety that gleams like captured sunlight, warm to the touch
 * Tier: 1
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

export const Citrine: ResourceItem = {
  "itemId": "citrine",
  "name": "Citrine",
  "description": "A golden-yellow quartz variety that gleams like captured sunlight, warm to the touch",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 25,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "citrine"
  }
} as const;
