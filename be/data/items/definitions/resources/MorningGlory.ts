/**
 * Morning Glory - Delicate blue trumpet-shaped blooms that unfurl at dawn, climbing gracefully on garden vines
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const MorningGlory: ResourceItem = {
  "itemId": "morning_glory",
  "name": "Morning Glory",
  "description": "Delicate blue trumpet-shaped blooms that unfurl at dawn, climbing gracefully on garden vines",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "decorative",
    "medicinal"
  ],
  "baseValue": 10,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "fragrant",
    "pristine"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "morning_glory"
  }
} as const;
