/**
 * Honeysuckle - Golden tubular blooms dripping with sweet nectar, attracting hummingbirds and skilled herbalists alike
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Honeysuckle: ResourceItem = {
  "itemId": "honeysuckle",
  "name": "Honeysuckle",
  "description": "Golden tubular blooms dripping with sweet nectar, attracting hummingbirds and skilled herbalists alike",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "medicinal",
    "culinary"
  ],
  "baseValue": 22,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": "herb",
    "tier": 2,
    "skillSource": "herbalism"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "honeysuckle"
  }
} as const;
