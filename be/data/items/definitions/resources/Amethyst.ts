/**
 * Amethyst - A stunning purple quartz prized for its royal color and calming properties
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import {
  RARITY,
  TIER,
  SUBCATEGORIES,
  QUALITY_SETS,
  TRAIT_SETS,
  SKILL_SOURCE,
  MATERIAL
} from '../../../constants/item-constants';

export const Amethyst: ResourceItem = {
  "itemId": "amethyst",
  "name": "Amethyst",
  "description": "A stunning purple quartz prized for its royal color and calming properties",
  "category": "resource",
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 35,
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
    "material": MATERIAL.AMETHYST
  }
} as const;
