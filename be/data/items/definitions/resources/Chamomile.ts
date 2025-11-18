/**
 * Chamomile - Delicate white flowers with a soothing aroma, commonly used in teas and healing salves
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Chamomile: ResourceItem = {
  "itemId": "chamomile",
  "name": "Chamomile",
  "description": "Delicate white flowers with a soothing aroma, commonly used in teas and healing salves",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "seasoning",
    "medicinal"
  ],
  "baseValue": 12,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.HERB,
  "allowedTraits": TRAIT_SETS.HERB_RESTORATIVE,
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "chamomile"
  }
} as const;
