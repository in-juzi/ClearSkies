/**
 * Moonvine - Ethereal silver-blue flowers that bloom only under moonlight, their petals glowing with celestial radiance
 * Tier: 4
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Moonvine: ResourceItem = {
  "itemId": "moonvine",
  "name": "Moonvine",
  "description": "Ethereal silver-blue flowers that bloom only under moonlight, their petals glowing with celestial radiance",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare",
    "nocturnal"
  ],
  "baseValue": 120,
  "rarity": RARITY.EPIC,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T4,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "moonvine"
  }
} as const;
