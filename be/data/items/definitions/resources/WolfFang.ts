/**
 * Wolf Fang - A sharp fang from a forest wolf. Can be used in crafting or sold to collectors.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const WolfFang: ResourceItem = {
  "itemId": "wolf_fang",
  "name": "Wolf Fang",
  "description": "A sharp fang from a forest wolf. Can be used in crafting or sold to collectors.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "bone",
    "crafting-material",
    "collectible"
  ],
  "rarity": "common",
  "baseValue": 8,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": "bone",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [
    "sheen"
  ],
  "allowedTraits": [
    "pristine"
  ],
  "icon": {
    "path": "items/saber-tooth.svg",
    "material": "bone"
  }
} as const;
