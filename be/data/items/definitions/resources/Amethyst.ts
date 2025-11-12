/**
 * Amethyst - A stunning purple quartz prized for its royal color and calming properties
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Amethyst: ResourceItem = {
  "itemId": "amethyst",
  "name": "Amethyst",
  "description": "A stunning purple quartz prized for its royal color and calming properties",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "crystal",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 35,
  "rarity": "common",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "gemstone",
    "tier": 1,
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
    "material": "amethyst"
  }
} as const;
