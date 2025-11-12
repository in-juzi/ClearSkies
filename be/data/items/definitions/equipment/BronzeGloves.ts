/**
 * Bronze Gloves - Bronze gauntlets protecting the hands and wrists
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';

export const BronzeGloves: EquipmentItem = {
  "itemId": "bronze_gloves",
  "name": "Bronze Gloves",
  "description": "Bronze gauntlets protecting the hands and wrists",
  "category": "equipment",
  "subcategories": [
    "armor",
    "handwear",
    "medium-armor",
    "metal"
  ],
  "subtype": "gloves",
  "slot": "gloves",
  "baseValue": 100,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "items/gauntlet.svg",
    "material": "bronze_gloves"
  },
  "properties": {
    "weight": 3,
    "material": "bronze",
    "tier": 1,
    "armor": 6,
    "evasion": 0,
    "durability": 90,
    "requiredLevel": 5
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
