/**
 * Jade - A smooth green stone prized for its toughness and spiritual significance across many cultures
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Jade: ResourceItem = {
  "itemId": "jade",
  "name": "Jade",
  "description": "A smooth green stone prized for its toughness and spiritual significance across many cultures",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "semi-precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 140,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 3,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "jade"
  }
} as const;
