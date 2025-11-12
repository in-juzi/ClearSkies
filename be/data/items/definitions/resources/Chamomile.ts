/**
 * Chamomile - Delicate white flowers with a soothing aroma, commonly used in teas and healing salves
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Chamomile: ResourceItem = {
  "itemId": "chamomile",
  "name": "Chamomile",
  "description": "Delicate white flowers with a soothing aroma, commonly used in teas and healing salves",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "seasoning",
    "medicinal"
  ],
  "baseValue": 12,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": "herb",
    "tier": 1,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "chamomile"
  }
} as const;
