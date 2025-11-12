/**
 * Iron Boots - Heavy iron greaves and sabatons providing excellent leg protection
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronBoots: EquipmentItem = {
  "itemId": "iron_boots",
  "name": "Iron Boots",
  "description": "Heavy iron greaves and sabatons providing excellent leg protection",
  "category": "equipment",
  "subcategories": [
    "armor",
    "footwear",
    "heavy-armor",
    "metal"
  ],
  "subtype": "boots",
  "slot": "boots",
  "baseValue": 180,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/metal-boot.svg",
    "material": "iron_boots"
  },
  "properties": {
    "weight": 6,
    "material": "iron",
    "tier": 2,
    "armor": 12,
    "evasion": -2,
    "durability": 130,
    "requiredLevel": 16
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
