/**
 * Bronze Plate Armor - A full suit of interlocking bronze plates offering substantial protection
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const BronzePlate: EquipmentItem = {
  "itemId": "bronze_plate",
  "name": "Bronze Plate Armor",
  "description": "A full suit of interlocking bronze plates offering substantial protection",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.BODY_ARMOR,
    SUBCATEGORY.HEAVY_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.PLATE,
  "slot": SLOT.BODY,
  "baseValue": 250,
  "rarity": RARITY.UNCOMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": MATERIAL.BRONZE
  },
  "properties": {
    "weight": 15,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "armor": 25,
    "evasion": -5,
    "requiredLevel": 10
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
