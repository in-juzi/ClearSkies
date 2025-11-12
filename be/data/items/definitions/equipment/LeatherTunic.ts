/**
 * Leather Tunic - A basic leather chest piece
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const LeatherTunic: EquipmentItem = {
  "itemId": "leather_tunic",
  "name": "Leather Tunic",
  "description": "A basic leather chest piece",
  "category": "equipment",
  "subcategories": [
    "armor",
    "body-armor",
    "medium-armor",
    "leather"
  ],
  "subtype": "tunic",
  "slot": "body",
  "baseValue": 75,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "leather"
  },
  "properties": {
    "weight": 5,
    "material": "leather",
    "tier": 1,
    "armor": 10,
    "evasion": 8,
    "requiredLevel": 1
  },
  "allowedQualities": [],
  "allowedTraits": [
    "weathered",
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
