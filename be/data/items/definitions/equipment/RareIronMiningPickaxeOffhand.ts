/**
 * Twin-Strike Mining Pickaxe - A rare lightweight pickaxe that can be wielded in the off-hand for dual-mining techniques
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const RareIronMiningPickaxeOffhand: EquipmentItem = {
  "itemId": "rare_iron_mining_pickaxe_offhand",
  "name": "Twin-Strike Mining Pickaxe",
  "description": "A rare lightweight pickaxe that can be wielded in the off-hand for dual-mining techniques",
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
  "slot": "offHand",
  "baseValue": 450,
  "rarity": "rare",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_tool.svg",
    "material": "iron"
  },
  "properties": {
    "weight": 4,
    "material": "iron",
    "tier": 2,
    "damageRoll": "1d3",
    "attackSpeed": 2.6,
    "critChance": 0.06,
    "skillScalar": "dualWield",
    "toolEfficiency": 1.2,
    "requiredLevel": 8
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
