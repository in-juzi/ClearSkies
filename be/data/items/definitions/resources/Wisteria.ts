/**
 * Wisteria - Cascading clusters of lavender blossoms that hang like fragrant curtains from ancient vines
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Wisteria: ResourceItem = {
  "itemId": "wisteria",
  "name": "Wisteria",
  "description": "Cascading clusters of lavender blossoms that hang like fragrant curtains from ancient vines",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "decorative",
    "alchemical"
  ],
  "baseValue": 28,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": MATERIAL.HEMP,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.HERB_PRISTINE,
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "wisteria"
  }
} as const;
