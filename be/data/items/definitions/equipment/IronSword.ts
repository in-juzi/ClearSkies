/**
 * Iron Sword - A reliable iron sword
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronSword: EquipmentItem = {
  "itemId": "iron_sword",
  "name": "Iron Sword",
  "description": "A reliable iron sword",
  "category": "equipment",
  "subcategories": [
    "weapon",
    "sword",
    "melee",
    "one-handed"
  ],
  "subtype": "sword",
  "slot": "mainHand",
  "baseValue": 250,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": "iron"
  },
  "properties": {
    "weight": 5,
    "material": "iron",
    "tier": 2,
    "damageRoll": "1d5",
    "attackSpeed": 2.6,
    "critChance": 0.06,
    "skillScalar": "oneHanded",
    "durability": 150,
    "requiredLevel": 5
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
