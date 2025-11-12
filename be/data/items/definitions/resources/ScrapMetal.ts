/**
 * Scrap Metal - Broken pieces of metal salvaged from crude weapons and armor. Can be smelted down for raw materials.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const ScrapMetal: ResourceItem = {
  "itemId": "scrap_metal",
  "name": "Scrap Metal",
  "description": "Broken pieces of metal salvaged from crude weapons and armor. Can be smelted down for raw materials.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "metal",
    "smithing-ingredient",
    "salvage"
  ],
  "rarity": "common",
  "baseValue": 4,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 3,
    "material": "metal",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [
    "purity"
  ],
  "allowedTraits": [],
  "icon": {
    "path": "item-categories/item_cat_scrap.svg",
    "material": "iron"
  }
} as const;
