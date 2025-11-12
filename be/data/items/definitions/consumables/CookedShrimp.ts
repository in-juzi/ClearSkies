/**
 * Cooked Shrimp - Succulent garlic shrimp, perfectly seasoned and cooked
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const CookedShrimp: ConsumableItem = {
  "itemId": "cooked_shrimp",
  "name": "Cooked Shrimp",
  "description": "Succulent garlic shrimp, perfectly seasoned and cooked",
  "category": "consumable",
  "subcategories": [
    "food",
    "fish",
    "cooked",
    "healing"
  ],
  "baseValue": 35,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": "food",
    "tier": 1,
    "healthRestore": 25,
    "craftedFrom": "shrimp"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "items/shrimp.svg",
    "material": "cooked_shrimp"
  }
} as const;
