/**
 * Shrimp - Small shellfish caught in shallow waters
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const Shrimp: ConsumableItem = {
  "itemId": "shrimp",
  "name": "Shrimp",
  "description": "Small shellfish caught in shallow waters",
  "category": "consumable",
  "subcategories": [
    "fish",
    "shellfish",
    "saltwater"
  ],
  "baseValue": 8,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.5,
    "material": "fish",
    "tier": 1,
    "skillSource": "fishing"
  },
  "allowedQualities": [
    "size",
    "juicy"
  ],
  "allowedTraits": [
    "pristine"
  ],
  "icon": {
    "path": "items/shrimp.svg",
    "material": "raw_shrimp"
  }
} as const;
