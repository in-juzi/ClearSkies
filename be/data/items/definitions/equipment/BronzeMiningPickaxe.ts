/**
 * Bronze Mining Pickaxe - A basic pickaxe for mining ore
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeMiningPickaxe: EquipmentItem = {
  "itemId": "bronze_mining_pickaxe",
  "name": "Bronze Mining Pickaxe",
  "description": "A basic pickaxe for mining ore",
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
  "baseValue": 90,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/pickaxe.svg",
    "material": "bronze_mining_pickaxe"
  },
  "properties": {
    "weight": 5,
    "material": "bronze",
    "tier": 1,
    "damageRoll": "1d3",
    "attackSpeed": 3,
    "critChance": 0.04,
    "skillScalar": "oneHanded",
    "toolEfficiency": 1,
    "requiredLevel": 1
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
