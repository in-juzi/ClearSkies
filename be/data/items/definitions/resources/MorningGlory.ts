/**
 * Morning Glory - Delicate blue trumpet-shaped blooms that unfurl at dawn, climbing gracefully on garden vines
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const MorningGlory: ResourceItem = {
  "itemId": "morning_glory",
  "name": "Morning Glory",
  "description": "Delicate blue trumpet-shaped blooms that unfurl at dawn, climbing gracefully on garden vines",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "decorative",
    "medicinal"
  ],
  "baseValue": 10,
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
    "material": "morning_glory"
  }
} as const;
