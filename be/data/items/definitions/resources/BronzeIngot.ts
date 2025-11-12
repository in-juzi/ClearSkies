/**
 * Bronze Ingot - A sturdy bronze ingot forged from copper and tin, warm to the touch and gleaming with a golden hue
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const BronzeIngot: ResourceItem = {
  "itemId": "bronze_ingot",
  "name": "Bronze Ingot",
  "description": "A sturdy bronze ingot forged from copper and tin, warm to the touch and gleaming with a golden hue",
  "category": "resource",
  "subcategories": [
    "metal",
    "ingot",
    "crafting-material",
    "smithing"
  ],
  "baseValue": 80,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 8,
    "material": "metal",
    "tier": 1,
    "skillSource": "smithing"
  },
  "allowedTraits": [
    "pristine",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_ingot.svg",
    "material": "bronze_ingot"
  },
  "allowedQualities": []
} as const;
