/**
 * Cut Ruby - A rough ruby refined by a jeweler's hand into a faceted vessel.
 * The cut sharpens the gem's inner fire; a finer cut holds more mana (see
 * jewelcrafting.md "compounding quality"). Still a gemstone, so it works as an
 * enchanting vessel anywhere a raw gem would — only better.
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

export const CutRuby: ResourceItem = {
  "itemId": "cut_ruby",
  "name": "Cut Ruby",
  "description": "A ruby faceted by a jeweler's hand — its crimson fire focused into a clean, brilliant vessel.",
  "category": CATEGORY.RESOURCE,
  subcategories: SUBCATEGORIES.GEMSTONE,

  "baseValue": 500,
  rarity: RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    material: MATERIAL.GEMSTONE,
    tier: TIER.T3,
    skillSource: SKILL_SOURCE.JEWELCRAFTING
  },
  "allowedQualities": QUALITY_SETS.GEMSTONE,
  "allowedTraits": TRAIT_SETS.GEMSTONE,
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "ruby"
  }
} as const;
