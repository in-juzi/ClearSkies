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
    "path": "items/gauntlet.svg",
    "material": "iron_gloves"
  },
  "properties": {
    "weight": 4,
    "material": "iron",
    "tier": 2,
    "armor": 10,
    "evasion": -1,
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
