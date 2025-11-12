/**
 * Hemp Coif - A simple cloth head covering made from hemp
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const HempCoif: EquipmentItem = {
  "itemId": "hemp_coif",
  "name": "Hemp Coif",
  "description": "A simple cloth head covering made from hemp",
  "category": "equipment",
  "subcategories": [
    "armor",
    "headgear",
    "light-armor",
    "cloth"
  ],
  "subtype": "coif",
  "slot": "head",
  "baseValue": 20,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "hemp"
  },
  "properties": {
    "weight": 1,
    "material": "cloth",
    "tier": 1,
    "armor": 2,
    "evasion": 5,
    "durability": 50,
    "requiredLevel": 1
  },
  "allowedQualities": [],
  "allowedTraits": [
    "weathered",
    "pristine",
    "blessed"
  ]
} as const;
