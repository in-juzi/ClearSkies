/**
 * Iron Boots - Heavy iron greaves and sabatons providing excellent leg protection
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const IronBoots: EquipmentItem = {
  "itemId": "iron_boots",
  "name": "Iron Boots",
  "description": "Heavy iron greaves and sabatons providing excellent leg protection",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.FOOTWEAR,
    SUBCATEGORY.HEAVY_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.BOOTS,
  "slot": SLOT.BOOTS,
  "baseValue": 180,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/metal-boot.svg",
    "material": "iron_boots"
  },
  "properties": {
    "weight": 6,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "armor": 12,
    "evasion": -2,
    "requiredLevel": 16
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
