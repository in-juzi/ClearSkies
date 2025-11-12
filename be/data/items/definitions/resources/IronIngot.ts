/**
 * Iron Ingot - A heavy iron ingot smelted from pure ore, its dark gray surface promises strength and durability
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const IronIngot: ResourceItem = {
  "itemId": "iron_ingot",
  "name": "Iron Ingot",
  "description": "A heavy iron ingot smelted from pure ore, its dark gray surface promises strength and durability",
  "category": "resource",
  "subcategories": [
    "metal",
    "ingot",
    "crafting-material",
    "smithing"
  ],
  "baseValue": 120,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 10,
    "material": "metal",
    "tier": 2,
    "skillSource": "smithing"
  },
  "allowedTraits": [
    "pristine",
    "cursed",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_ingot.svg",
    "material": "iron_ingot"
  },
  "allowedQualities": []
} as const;
