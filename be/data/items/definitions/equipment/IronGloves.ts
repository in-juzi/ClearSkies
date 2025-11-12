/**
 * Iron Gloves - Articulated iron gauntlets protecting hands while allowing full mobility
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronGloves: EquipmentItem = {
  "itemId": "iron_gloves",
  "name": "Iron Gloves",
  "description": "Articulated iron gauntlets protecting hands while allowing full mobility",
  "category": "equipment",
  "subcategories": [
    "armor",
    "handwear",
    "heavy-armor",
    "metal"
  ],
  "subtype": "gloves",
  "slot": "gloves",
  "baseValue": 160,
  "rarity": "common",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "iron"
  },
  "properties": {
    "weight": 4,
    "material": "iron",
    "tier": 2,
    "defense": 3,
    "armor": 10,
    "evasion": -1,
    "durability": 120,
    "requiredLevel": 14
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
