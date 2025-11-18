/**
 * Sapphire - A deep blue gemstone of royal quality, its crystalline structure catches the light in mesmerizing ways
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

export const Sapphire: ResourceItem = {
  "itemId": "sapphire",
  "name": "Sapphire",
  "description": "A deep blue gemstone of royal quality, its crystalline structure catches the light in mesmerizing ways",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,
  
  "baseValue": 280,
  rarity: RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    material: MATERIAL.GEMSTONE,
    tier: TIER.T3,
    skillSource: SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "sapphire"
  }
} as const;
