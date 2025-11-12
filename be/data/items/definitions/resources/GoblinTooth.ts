/**
 * Goblin Tooth - A jagged tooth from a goblin warrior. Goblins are known for their sharp teeth and fiercer bite.
 * Tier: 1
 */

import { ResourceItem } from '../../../../types/items';

export const GoblinTooth: ResourceItem = {
  "itemId": "goblin_tooth",
  "name": "Goblin Tooth",
  "description": "A jagged tooth from a goblin warrior. Goblins are known for their sharp teeth and fiercer bite.",
  "category": "resource",
  "subcategories": [
    "monster-drop",
    "bone",
    "crafting-material",
    "collectible"
  ],
  "rarity": "common",
  "baseValue": 7,
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
    "cursed"
  ],
  "icon": {
    "path": "items/fangs.svg",
    "material": "bone"
  }
} as const;
