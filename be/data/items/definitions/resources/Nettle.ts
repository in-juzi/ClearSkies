/**
 * Nettle - Stinging leaves that, when properly prepared, provide remarkable healing properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Nettle: ResourceItem = {
  "itemId": "nettle",
  "name": "Nettle",
  "description": "Stinging leaves that, when properly prepared, provide remarkable healing properties",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "herb",
    "leaf",
    "medicinal"
  ],
  "baseValue": 25,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": MATERIAL.HEMP,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.HERB,
  "allowedTraits": TRAIT_SETS.HERB_INVIGORATING,
  "icon": {
    "path": "items/curled-leaf.svg",
    "material": "nettle"
  }
} as const;
