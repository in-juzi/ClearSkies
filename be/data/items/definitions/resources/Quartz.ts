/**
 * Quartz - A clear crystalline stone, common but valued for its clarity and magical resonance
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const Quartz: ResourceItem = {
  "itemId": "quartz",
  "name": "Quartz",
  "description": "A clear crystalline stone, common but valued for its clarity and magical resonance",
  "category": "resource",
  "subcategories": [
    "gemstone",
    "crystal",
    "jewelry",
    "enchanting"
  ],
  "baseValue": 15,
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
    "pristine"
  ],
  "icon": {
    "path": "item-categories/item_cat_jewel.svg",
    "material": "quartz"
  }
} as const;
