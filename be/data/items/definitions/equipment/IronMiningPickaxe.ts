/**
 * Iron Mining Pickaxe - A sturdy iron pickaxe for mining ore
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronMiningPickaxe: EquipmentItem = {
  "itemId": "iron_mining_pickaxe",
  "name": "Iron Mining Pickaxe",
  "description": "A sturdy iron pickaxe for mining ore",
  "category": "equipment",
  "subcategories": [
    "tool",
    "weapon",
    "gathering",
    "mining",
    "pickaxe",
    "melee",
    "one-handed"
  ],
  "subtype": "mining-pickaxe",
  "slot": "mainHand",
  "baseValue": 220,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/pickaxe.svg",
    "material": "iron_mining_pickaxe"
  },
  "properties": {
    "weight": 6,
    "material": "iron",
    "tier": 2,
    "damageRoll": "1d4",
    "attackSpeed": 3.2,
    "critChance": 0.05,
    "skillScalar": "oneHanded",
    "toolEfficiency": 1.5,
    "durability": 150,
    "requiredLevel": 5
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
