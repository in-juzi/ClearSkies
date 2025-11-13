/**
 * Turquoise - An opaque blue-green stone with distinctive veining, sacred to many ancient cultures
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

export const Turquoise: ResourceItem = {
  "itemId": "turquoise",
  "name": "Turquoise",
  "description": "An opaque blue-green stone with distinctive veining, sacred to many ancient cultures",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 60,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "turquoise"
  }
} as const;
