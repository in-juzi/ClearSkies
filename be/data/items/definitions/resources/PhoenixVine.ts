/**
 * Phoenix Vine - Legendary crimson blooms with molten gold centers, said to regenerate from ash and grant vitality to the worthy
 * Tier: 4
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const PhoenixVine: ResourceItem = {
  "itemId": "phoenix_vine",
  "name": "Phoenix Vine",
  "description": "Legendary crimson blooms with molten gold centers, said to regenerate from ash and grant vitality to the worthy",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare",
    "legendary"
  ],
  "baseValue": 150,
  "rarity": RARITY.EPIC,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.HEMP,
    "tier": TIER.T4,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "phoenix_vine"
  }
} as const;
