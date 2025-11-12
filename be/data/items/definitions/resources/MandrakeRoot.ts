/**
 * Mandrake Root - A mystical root shaped like a human form, whispered to have powerful magical properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const MandrakeRoot: ResourceItem = {
  "itemId": "mandrake_root",
  "name": "Mandrake Root",
  "description": "A mystical root shaped like a human form, whispered to have powerful magical properties",
  "category": "resource",
  "subcategories": [
    "root",
    "herb",
    "alchemical",
    "magical"
  ],
  "baseValue": 45,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": "herb",
    "tier": 2,
    "skillSource": "herbalism"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
