/**
 * Iron Plate Armor - A full suit of iron plate armor, pinnacle of defensive metalwork
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const IronPlate: EquipmentItem = {
  "itemId": "iron_plate",
  "name": "Iron Plate Armor",
  "description": "A full suit of iron plate armor, pinnacle of defensive metalwork",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.BODY_ARMOR,
    SUBCATEGORY.HEAVY_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.PLATE,
  "slot": SLOT.BODY,
  "baseValue": 400,
  "rarity": RARITY.UNCOMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": MATERIAL.IRON
  },
  "properties": {
    "weight": 20,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "armor": 40,
    "evasion": -8,
    "requiredLevel": 20
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
