/**
 * Iron Woodcutting Axe - A sturdy iron axe for chopping trees
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronWoodcuttingAxe: EquipmentItem = {
  "itemId": "iron_woodcutting_axe",
  "name": "Iron Woodcutting Axe",
  "description": "A sturdy iron axe for chopping trees",
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
  "baseValue": 200,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_axe.svg",
    "material": "iron_woodcutting_axe"
  },
  "properties": {
    "weight": 5,
    "material": "iron",
    "tier": 2,
    "damageRoll": "1d4",
    "attackSpeed": 2.9,
    "critChance": 0.05,
    "skillScalar": "oneHanded",
    "toolEfficiency": 1.5,
    "requiredLevel": 5
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
