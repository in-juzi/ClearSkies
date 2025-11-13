/**
 * Garnet - A deep burgundy gemstone with a rich, wine-dark luster favored for protective amulets
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

export const Garnet: ResourceItem = {
  "itemId": "garnet",
  "name": "Garnet",
  "description": "A deep burgundy gemstone with a rich, wine-dark luster favored for protective amulets",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 50,
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
    "material": "garnet"
  }
} as const;
