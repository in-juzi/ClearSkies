/**
 * Topaz - A brilliant golden gemstone that catches firelight beautifully, highly sought after by jewelers
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
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

export const Topaz: ResourceItem = {
  "itemId": "topaz",
  "name": "Topaz",
  "description": "A brilliant golden gemstone that catches firelight beautifully, highly sought after by jewelers",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,
  
  "baseValue": 100,
  rarity: RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    material: MATERIAL.GEMSTONE,
    tier: TIER.T2,
    skillSource: SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "topaz"
  }
} as const;
