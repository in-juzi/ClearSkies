/**
 * Turquoise - An opaque blue-green stone with distinctive veining, sacred to many ancient cultures
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Turquoise: ResourceItem = {
  "itemId": "turquoise",
  "name": "Turquoise",
  "description": "An opaque blue-green stone with distinctive veining, sacred to many ancient cultures",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "semi-precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 60,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 2,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "turquoise"
  }
} as const;
