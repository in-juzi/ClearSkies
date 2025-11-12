/**
 * Tattered Cloth - Worn cloth scraps salvaged from defeated enemies. Barely useful, but can be sold for a few coins.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const TatteredCloth: ResourceItem = {
  "itemId": "tattered_cloth",
  "name": "Tattered Cloth",
  "description": "Worn cloth scraps salvaged from defeated enemies. Barely useful, but can be sold for a few coins.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "cloth",
    "salvage"
  ],
  "rarity": "common",
  "baseValue": 2,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.3,
    "material": "cloth",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [],
  "allowedTraits": [],
  "icon": {
    "path": "item-categories/item_cat_cloth.svg",
    "material": "cloth"
  }
} as const;
