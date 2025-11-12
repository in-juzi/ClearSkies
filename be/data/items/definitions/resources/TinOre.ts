/**
 * Tin Ore - Raw tin ore, lightweight and essential for bronze alloys
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const TinOre: ResourceItem = {
  "itemId": "tin_ore",
  "name": "Tin Ore",
  "description": "Raw tin ore, lightweight and essential for bronze alloys",
  "category": "resource",
  "subcategories": [
    "ore",
    "mineral",
    "metal"
  ],
  "baseValue": 25,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 4,
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
    "material": "tin_ore"
  }
} as const;
