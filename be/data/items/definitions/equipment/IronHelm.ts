/**
 * Iron Helm - A sturdy iron helmet
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronHelm: EquipmentItem = {
  "itemId": "iron_helm",
  "name": "Iron Helm",
  "description": "A sturdy iron helmet",
  "category": "equipment",
  "subcategories": [
    "armor",
    "headgear",
    "heavy-armor",
    "metal"
  ],
  "subtype": "helm",
  "slot": "head",
  "baseValue": 150,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/light-helm.svg",
    "material": "iron_helm"
  },
  "properties": {
    "weight": 6,
    "material": "iron",
    "tier": 2,
    "armor": 15,
    "evasion": 0,
    "durability": 120,
    "requiredLevel": 3
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
