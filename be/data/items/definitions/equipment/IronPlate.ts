/**
 * Iron Plate Armor - A full suit of iron plate armor, pinnacle of defensive metalwork
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';

export const IronPlate: EquipmentItem = {
  "itemId": "iron_plate",
  "name": "Iron Plate Armor",
  "description": "A full suit of iron plate armor, pinnacle of defensive metalwork",
  "category": "equipment",
  "subcategories": [
    "armor",
    "body-armor",
    "heavy-armor",
    "metal"
  ],
  "subtype": "plate",
  "slot": "body",
  "baseValue": 400,
  "rarity": "uncommon",
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": "iron"
  },
  "properties": {
    "weight": 20,
    "material": "iron",
    "tier": 2,
    "armor": 40,
    "evasion": -8,
    "requiredLevel": 20
  },
  "allowedQualities": [],
  "allowedTraits": [
    "pristine",
    "cursed",
    "blessed",
    "masterwork"
  ]
} as const;
