/**
 * Jasmine - Elegant white star-shaped flowers with an intoxicating sweet fragrance, prized in perfumes and teas
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Jasmine: ResourceItem = {
  "itemId": "jasmine",
  "name": "Jasmine",
  "description": "Elegant white star-shaped flowers with an intoxicating sweet fragrance, prized in perfumes and teas",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "medicinal",
    "decorative"
  ],
  "baseValue": 15,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": "herb",
    "tier": 1,
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
    "material": "jasmine"
  }
} as const;
