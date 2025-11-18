/**
 * Jasmine - Elegant white star-shaped flowers with an intoxicating sweet fragrance, prized in perfumes and teas
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Jasmine: ResourceItem = {
  "itemId": "jasmine",
  "name": "Jasmine",
  "description": "Elegant white star-shaped flowers with an intoxicating sweet fragrance, prized in perfumes and teas",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "medicinal",
    "decorative"
  ],
  "baseValue": 15,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.HERB_PRISTINE,
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "jasmine"
  }
} as const;
