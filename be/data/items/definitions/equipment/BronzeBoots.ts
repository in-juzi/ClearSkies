/**
 * Bronze Boots - Bronze greaves and boots providing solid leg protection
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeBoots: EquipmentItem = {
  "itemId": "bronze_boots",
  "name": "Bronze Boots",
  "description": "Bronze greaves and boots providing solid leg protection",
  "category": "equipment",
  "subcategories": [
    "armor",
    "footwear",
    "medium-armor",
    "metal"
  ],
  "subtype": "boots",
  "slot": "boots",
  "baseValue": 110,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/metal-boot.svg",
    "material": "bronze_boots"
  },
  "properties": {
    "weight": 4,
    "material": "bronze",
    "tier": 1,
    "armor": 8,
    "evasion": 0,
    "durability": 95,
    "requiredLevel": 6
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
