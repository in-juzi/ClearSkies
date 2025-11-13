/**
 * Minor Mana Potion - A small potion that restores a modest amount of mana
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';

export const ManaPotionMinor: ConsumableItem = {
  "itemId": "mana_potion_minor",
  "name": "Minor Mana Potion",
  "description": "A small potion that restores a modest amount of mana",
  "category": "consumable",
  "subcategories": [
    "potion",
    "mana",
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
    "manaRestore": 30
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_potion_1.svg",
    "material": "mana_potion"
  }
} as const;
