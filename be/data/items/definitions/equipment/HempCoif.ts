/**
 * Hemp Coif - A simple cloth head covering made from hemp
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const HempCoif: EquipmentItem = {
  "itemId": "hemp_coif",
  "name": "Hemp Coif",
  "description": "A simple cloth head covering made from hemp",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.HEADGEAR,
    SUBCATEGORY.LIGHT_ARMOR,
    SUBCATEGORY.CLOTH
  ],
  "subtype": ARMOR_SUBTYPE.COIF,
  "slot": SLOT.HEAD,
  "baseValue": 20,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": MATERIAL.HEMP
  },
  "properties": {
    "weight": 1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T1,
    "armor": 2,
    "evasion": 5,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.WOOD_PRISTINE
} as const;
