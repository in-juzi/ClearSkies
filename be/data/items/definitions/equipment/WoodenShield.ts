/**
 * Wooden Shield - A simple wooden shield for basic protection
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const WoodenShield: EquipmentItem = {
  "itemId": "wooden_shield",
  "name": "Wooden Shield",
  "description": "A simple wooden shield for basic protection",
  "category": "equipment",
  "subcategories": [
    "armor",
    "shield",
    "defensive"
  ],
  "subtype": "shield",
  "slot": "offHand",
  "baseValue": 50,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "oak"
  },
  "properties": {
    "weight": 3,
    "material": "wood",
    "tier": 1,
    "defense": 3,
    "armor": 8,
    "evasion": 2,
    "blockChance": 0.15,
    "durability": 80,
    "requiredLevel": 1
  },
  "allowedQualities": [
    "woodGrain"
  ],
  "allowedTraits": [
    "weathered",
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
