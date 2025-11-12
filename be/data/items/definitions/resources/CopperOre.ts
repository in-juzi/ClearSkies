/**
 * Copper Ore - Raw copper ore, ready to be smelted
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const CopperOre: ResourceItem = {
  "itemId": "copper_ore",
  "name": "Copper Ore",
  "description": "Raw copper ore, ready to be smelted",
  "category": "resource",
  "subcategories": [
    "ore",
    "mineral",
    "metal"
  ],
  "baseValue": 30,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 5,
    "material": "ore",
    "tier": 1,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "purity",
    "sheen"
  ],
  "allowedTraits": [
    "pristine"
  ],
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "copper_ore"
  }
} as const;
