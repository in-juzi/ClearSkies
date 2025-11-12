/**
 * Wolf Pelt - A thick pelt from a forest wolf. Valuable for crafting leather armor and warm clothing.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const WolfPelt: ResourceItem = {
  "itemId": "wolf_pelt",
  "name": "Wolf Pelt",
  "description": "A thick pelt from a forest wolf. Valuable for crafting leather armor and warm clothing.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "leather",
    "crafting-material"
  ],
  "rarity": "common",
  "baseValue": 15,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 1.5,
    "material": "leather",
    "tier": 1,
    "skillSource": "combat"
  },
  "allowedQualities": [
    "purity"
  ],
  "allowedTraits": [
    "pristine"
  ],
  "icon": {
    "path": "items/animal-hide.svg",
    "material": "leather"
  }
} as const;
