/**
 * Willow Fishing Rod - A flexible fishing rod made from willow wood
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const WillowFishingRod: EquipmentItem = {
  "itemId": "willow_fishing_rod",
  "name": "Willow Fishing Rod",
  "description": "A flexible fishing rod made from willow wood",
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
  "baseValue": 150,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/fishing-pole.svg",
    "material": "willow_fishing_rod"
  },
  "properties": {
    "weight": 2,
    "material": "willow",
    "tier": 2,
    "damageRoll": "1d3",
    "attackSpeed": 2.4,
    "critChance": 0.04,
    "skillScalar": "oneHanded",
    "toolEfficiency": 1.5,
    "requiredLevel": 5
  },
  "allowedQualities": [
    "woodGrain"
  ],
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ]
} as const;
