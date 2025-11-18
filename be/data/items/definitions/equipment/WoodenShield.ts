/**
 * Wooden Shield - A simple wooden shield for basic protection
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE } from '../../../constants/item-constants';

export const WoodenShield: EquipmentItem = {
  "itemId": "wooden_shield",
  "name": "Wooden Shield",
  "description": "A simple wooden shield for basic protection",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.SHIELD,
    SUBCATEGORY.DEFENSIVE
  ],
  "subtype": WEAPON_SUBTYPE.SHIELD,
  "slot": SLOT.OFF_HAND,
  "baseValue": 50,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_body.svg",
    "material": MATERIAL.OAK
  },
  "properties": {
    "weight": 3,
    "material": MATERIAL.OAK,
    "tier": TIER.T1,
    "armor": 8,
    "evasion": 2,
    "blockChance": 0.15,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.ARMOR_PRISTINE
} as const;
