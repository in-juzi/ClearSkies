/**
 * Sage - Silvery-green leaves prized for their medicinal properties and protective qualities
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Sage: ResourceItem = {
  "itemId": "sage",
  "name": "Sage",
  "description": "Silvery-green leaves prized for their medicinal properties and protective qualities",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.HERB,
  "baseValue": 18,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.HERB,
  "allowedTraits": TRAIT_SETS.HERB_WARDING,
  "icon": {
    "path": "items/leaves.svg",
    "material": "sage"
  }
} as const;
