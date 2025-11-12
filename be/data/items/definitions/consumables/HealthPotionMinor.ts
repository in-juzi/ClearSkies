/**
 * Minor Health Potion - A small potion that restores a modest amount of health
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const HealthPotionMinor: ConsumableItem = {
  "itemId": "health_potion_minor",
  "name": "Minor Health Potion",
  "description": "A small potion that restores a modest amount of health",
  "category": "consumable",
  "subcategories": [
    "potion",
    "healing",
    "alchemical",
    "liquid"
  ],
  "baseValue": 50,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": "potion",
    "tier": 1,
    "healthRestore": 30
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_potion_1.svg",
    "material": "health_potion_minor"
  }
} as const;
