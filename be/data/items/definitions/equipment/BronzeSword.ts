/**
 * Bronze Sword - A sturdy sword forged from bronze, reliable in combat
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeSword: EquipmentItem = {
  "itemId": "bronze_sword",
  "name": "Bronze Sword",
  "description": "A sturdy sword forged from bronze, reliable in combat",
  "category": "equipment",
  "subcategories": [
    "weapon",
    "sword",
    "melee",
    "one-handed"
  ],
  "subtype": "sword",
  "slot": "mainHand",
  "baseValue": 120,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": "bronze_sword"
  },
  "properties": {
    "weight": 5,
    "material": "bronze",
    "tier": 1,
    "damageRoll": "1d4",
    "attackSpeed": 2.4,
    "critChance": 0.05,
    "skillScalar": "oneHanded",
    "durability": 120,
    "requiredLevel": 5
  },
  "allowedQualities": [],
  "allowedTraits": [
    "knotted",
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
