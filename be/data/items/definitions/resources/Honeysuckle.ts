/**
 * Honeysuckle - Golden tubular blooms dripping with sweet nectar, attracting hummingbirds and skilled herbalists alike
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Honeysuckle: ResourceItem = {
  "itemId": "honeysuckle",
  "name": "Honeysuckle",
  "description": "Golden tubular blooms dripping with sweet nectar, attracting hummingbirds and skilled herbalists alike",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "medicinal",
    "culinary"
  ],
  "baseValue": 22,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.HERB_PRISTINE,
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "honeysuckle"
  }
} as const;
