/**
 * Iron Ore - Raw iron ore, the backbone of any smithy
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const IronOre: ResourceItem = {
  "itemId": "iron_ore",
  "name": "Iron Ore",
  "description": "Raw iron ore, the backbone of any smithy",
  "category": "resource",
  "subcategories": [
    "ore",
    "mineral",
    "metal"
  ],
  "baseValue": 60,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 6,
    "material": "ore",
    "tier": 2,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "purity",
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "iron_ore"
  }
} as const;
