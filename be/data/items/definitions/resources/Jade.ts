/**
 * Jade - A smooth green stone prized for its toughness and spiritual significance across many cultures
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

export const Jade: ResourceItem = {
  "itemId": "jade",
  "name": "Jade",
  "description": "A smooth green stone prized for its toughness and spiritual significance across many cultures",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,
  
  "baseValue": 140,
  rarity: RARITY.UNCOMMON,
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
    "material": "jade"
  }
} as const;
