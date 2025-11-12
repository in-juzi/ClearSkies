/**
 * Garnet - A deep burgundy gemstone with a rich, wine-dark luster favored for protective amulets
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Garnet: ResourceItem = {
  "itemId": "garnet",
  "name": "Garnet",
  "description": "A deep burgundy gemstone with a rich, wine-dark luster favored for protective amulets",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "semi-precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 50,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 2,
    "skillSource": "mining"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "garnet"
  }
} as const;
