/**
 * Quartz - A clear crystalline stone, common but valued for its clarity and magical resonance
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

export const Quartz: ResourceItem = {
  "itemId": "quartz",
  "name": "Quartz",
  "description": "A clear crystalline stone, common but valued for its clarity and magical resonance",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,
  
  "baseValue": 15,
  rarity: RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    material: MATERIAL.GEMSTONE,
    tier: TIER.T1,
    skillSource: SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "quartz"
  }
} as const;
