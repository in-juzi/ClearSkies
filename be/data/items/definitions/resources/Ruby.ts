/**
 * Ruby - A brilliant crimson gemstone that seems to hold an inner fire, prized by jewelers and enchanters alike
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

export const Ruby: ResourceItem = {
  "itemId": "ruby",
  "name": "Ruby",
  "description": "A brilliant crimson gemstone that seems to hold an inner fire, prized by jewelers and enchanters alike",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,
  
  "baseValue": 250,
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
    "material": "ruby"
  }
} as const;
