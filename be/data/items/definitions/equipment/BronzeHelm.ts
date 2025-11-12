/**
 * Bronze Helm - A protective helmet forged from bronze plates
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeHelm: EquipmentItem = {
  "itemId": "bronze_helm",
  "name": "Bronze Helm",
  "description": "A protective helmet forged from bronze plates",
  "category": "equipment",
  "subcategories": [
    "armor",
    "headgear",
    "medium-armor",
    "metal"
  ],
  "subtype": "helm",
  "slot": "head",
  "baseValue": 130,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/light-helm.svg",
    "material": "bronze_helm"
  },
  "properties": {
    "weight": 5,
    "material": "bronze",
    "tier": 1,
    "armor": 10,
    "evasion": 0,
    "durability": 100,
    "requiredLevel": 7
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
