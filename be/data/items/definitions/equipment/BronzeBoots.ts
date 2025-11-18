/**
 * Bronze Boots - Bronze greaves and boots providing solid leg protection
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const BronzeBoots: EquipmentItem = {
  "itemId": "bronze_boots",
  "name": "Bronze Boots",
  "description": "Bronze greaves and boots providing solid leg protection",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.FOOTWEAR,
    SUBCATEGORY.MEDIUM_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.BOOTS,
  "slot": SLOT.BOOTS,
  "baseValue": 110,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/metal-boot.svg",
    "material": "bronze_boots"
  },
  "properties": {
    "weight": 4,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "armor": 8,
    "evasion": 0,
    "requiredLevel": 6
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
