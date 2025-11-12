/**
 * Willow Log - A flexible willow log, prized for its magical properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const WillowLog: ResourceItem = {
  "itemId": "willow_log",
  "name": "Willow Log",
  "description": "A flexible willow log, prized for its magical properties",
  "category": "resource",
  "subcategories": [
    "wood",
    "timber",
    "magical"
  ],
  "baseValue": 50,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": "wood",
    "tier": 2,
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
    "material": "willow_log"
  }
} as const;
