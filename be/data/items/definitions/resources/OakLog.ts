/**
 * Oak Log - A sturdy oak log, useful for construction and crafting
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const OakLog: ResourceItem = {
  "itemId": "oak_log",
  "name": "Oak Log",
  "description": "A sturdy oak log, useful for construction and crafting",
  "category": "resource",
  "subcategories": [
    "wood",
    "timber",
    "building-material"
  ],
  "baseValue": 25,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": "wood",
    "tier": 1,
    "skillSource": "woodcutting"
  },
  "allowedQualities": [
    "woodGrain",
    "moisture",
    "age"
  ],
  "allowedTraits": [
    "fragrant",
    "weathered",
    "pristine"
  ],
  "icon": {
    "path": "item-categories/item_cat_log.svg",
    "material": "oak_log"
  }
} as const;
