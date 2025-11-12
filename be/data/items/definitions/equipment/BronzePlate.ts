/**
 * Bronze Plate Armor - A full suit of interlocking bronze plates offering substantial protection
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzePlate: EquipmentItem = {
  "itemId": "bronze_plate",
  "name": "Bronze Plate Armor",
  "description": "A full suit of interlocking bronze plates offering substantial protection",
  "category": "equipment",
  "subcategories": [
    "armor",
    "body-armor",
    "heavy-armor",
    "metal"
  ],
  "subtype": "plate",
  "slot": "body",
  "baseValue": 250,
  "rarity": "uncommon",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "bronze"
  },
  "properties": {
    "weight": 15,
    "material": "bronze",
    "tier": 1,
    "armor": 25,
    "evasion": -5,
    "durability": 150,
    "requiredLevel": 10
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
