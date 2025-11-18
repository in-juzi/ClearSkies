/**
 * Leather Tunic - A basic leather chest piece
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const LeatherTunic: EquipmentItem = {
  "itemId": "leather_tunic",
  "name": "Leather Tunic",
  "description": "A basic leather chest piece",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.BODY_ARMOR,
    SUBCATEGORY.MEDIUM_ARMOR,
    SUBCATEGORY.LEATHER
  ],
  "subtype": ARMOR_SUBTYPE.TUNIC,
  "slot": SLOT.BODY,
  "baseValue": 75,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": MATERIAL.LEATHER
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.LEATHER,
    "tier": TIER.T1,
    "armor": 10,
    "evasion": 8,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.WOOD_PRISTINE
} as const;
