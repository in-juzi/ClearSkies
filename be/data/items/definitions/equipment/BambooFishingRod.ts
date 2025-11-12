/**
 * Bamboo Fishing Rod - A simple fishing rod made from bamboo
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BambooFishingRod: EquipmentItem = {
  "itemId": "bamboo_fishing_rod",
  "name": "Bamboo Fishing Rod",
  "description": "A simple fishing rod made from bamboo",
  "category": "equipment",
  "subcategories": [
    "tool",
    "weapon",
    "gathering",
    "fishing",
    "rod",
    "melee",
    "one-handed"
  ],
  "subtype": "fishing-rod",
  "slot": "mainHand",
  "baseValue": 50,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/fishing-pole.svg",
    "material": "bamboo_fishing_rod"
  },
  "properties": {
    "weight": 2,
    "material": "bamboo",
    "tier": 1,
    "damageRoll": "1d2",
    "attackSpeed": 2.2,
    "critChance": 0.03,
    "skillScalar": "oneHanded",
    "toolEfficiency": 1,
    "requiredLevel": 1
  },
  "allowedQualities": [
    "woodGrain"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ]
} as const;
