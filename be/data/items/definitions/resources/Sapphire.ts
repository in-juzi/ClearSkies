/**
 * Sapphire - A deep blue gemstone of royal quality, its crystalline structure catches the light in mesmerizing ways
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Sapphire: ResourceItem = {
  "itemId": "sapphire",
  "name": "Sapphire",
  "description": "A deep blue gemstone of royal quality, its crystalline structure catches the light in mesmerizing ways",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 280,
  "rarity": "rare",
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
    "material": "sapphire"
  }
} as const;
