/**
 * Sage - Silvery-green leaves prized for their medicinal properties and protective qualities
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Sage: ResourceItem = {
  "itemId": "sage",
  "name": "Sage",
  "description": "Silvery-green leaves prized for their medicinal properties and protective qualities",
  "category": "resource",
  "subcategories": [
    "herb",
    "seasoning",
    "medicinal",
    "protective"
  ],
  "baseValue": 18,
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
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
