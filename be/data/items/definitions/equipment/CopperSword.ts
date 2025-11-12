/**
 * Copper Sword - A basic sword made of copper
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const CopperSword: EquipmentItem = {
  "itemId": "copper_sword",
  "name": "Copper Sword",
  "description": "A basic sword made of copper",
  "category": "equipment",
  "subcategories": [
    "weapon",
    "sword",
    "melee",
    "one-handed"
  ],
  "subtype": "sword",
  "slot": "mainHand",
  "baseValue": 100,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": "copper_sword"
  },
  "properties": {
    "weight": 4,
    "material": "copper",
    "tier": 1,
    "damageRoll": "1d3",
    "attackSpeed": 2.4,
    "critChance": 0.05,
    "skillScalar": "oneHanded",
    "durability": 100,
    "requiredLevel": 1
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
