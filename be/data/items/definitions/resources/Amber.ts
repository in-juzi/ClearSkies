/**
 * Amber - Fossilized tree resin with a warm golden hue, sometimes containing ancient insects
 * Tier: 1
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

export const Amber: ResourceItem = {
  "itemId": "amber",
  "name": "Amber",
  "description": "Fossilized tree resin with a warm golden hue. This ancient gem sometimes contains preserved insects from millennia past.",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.GEMSTONE,
  "baseValue": 40,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.WOODCUTTING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "generic"
  }
} as const;
