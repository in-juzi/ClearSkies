/**
 * Bronze Woodcutting Axe - A basic axe for chopping trees
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeWoodcuttingAxe: EquipmentItem = {
  "itemId": "bronze_woodcutting_axe",
  "name": "Bronze Woodcutting Axe",
  "description": "A basic axe for chopping trees",
  "category": "equipment",
  "subcategories": [
    "tool",
    "weapon",
    "gathering",
    "woodcutting",
    "axe",
    "melee",
    "one-handed"
  ],
  "subtype": "woodcutting-axe",
  "slot": "mainHand",
  "baseValue": 80,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_axe.svg",
    "material": "bronze_woodcutting_axe"
  },
  "properties": {
    "weight": 4,
    "material": "bronze",
    "tier": 1,
    "damageRoll": "1d3",
    "attackSpeed": 2.8,
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
