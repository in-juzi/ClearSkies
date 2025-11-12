/**
 * Raw Meat - Fresh meat from a wild animal. Can be cooked into a hearty meal.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const RawMeat: ResourceItem = {
  "itemId": "raw_meat",
  "name": "Raw Meat",
  "description": "Fresh meat from a wild animal. Can be cooked into a hearty meal.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "food",
    "cooking-ingredient"
  ],
  "rarity": "common",
  "baseValue": 5,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 2,
    "material": "meat",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [
    "purity"
  ],
  "allowedTraits": [],
  "icon": {
    "path": "items/raw-meat.svg",
    "material": "raw_meat"
  }
} as const;
