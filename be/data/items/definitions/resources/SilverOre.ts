/**
 * Silver Ore - Precious silver ore with a lustrous shine
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const SilverOre: ResourceItem = {
  "itemId": "silver_ore",
  "name": "Silver Ore",
  "description": "Precious silver ore with a lustrous shine",
  "category": "resource",
  "subcategories": [
    "ore",
    "mineral",
    "metal",
    "precious"
  ],
  "baseValue": 120,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 5.5,
    "material": "ore",
    "tier": 3,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "purity",
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "silver_ore"
  }
} as const;
