/**
 * Aquamarine - A pale cyan gemstone reminiscent of clear ocean waters, said to protect sailors at sea
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const Aquamarine: ResourceItem = {
  "itemId": "aquamarine",
  "name": "Aquamarine",
  "description": "A pale cyan gemstone reminiscent of clear ocean waters, said to protect sailors at sea",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "semi-precious",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 120,
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
    "material": "aquamarine"
  }
} as const;
