/**
 * Maple Log - A fine maple log with beautiful grain patterns
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const MapleLog: ResourceItem = {
  "itemId": "maple_log",
  "name": "Maple Log",
  "description": "A fine maple log with beautiful grain patterns",
  "category": "resource",
  "subcategories": [
    "wood",
    "timber",
    "crafting-material"
  ],
  "baseValue": 75,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": "wood",
    "tier": 3,
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
    "material": "maple_log"
  }
} as const;
