/**
 * Leather Scraps - Small pieces of leather salvaged from worn armor. Useful for basic repairs and crafting.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const LeatherScraps: ResourceItem = {
  "itemId": "leather_scraps",
  "name": "Leather Scraps",
  "description": "Small pieces of leather salvaged from worn armor. Useful for basic repairs and crafting.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "leather",
    "crafting-material",
    "salvage"
  ],
  "rarity": "common",
  "baseValue": 6,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.5,
    "material": "leather",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [
    "purity"
  ],
  "allowedTraits": [],
  "icon": {
    "path": "item-categories/item_cat_leather.svg",
    "material": "leather"
  }
} as const;
