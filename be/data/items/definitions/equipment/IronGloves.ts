/**
 * Iron Gloves - Articulated iron gauntlets protecting hands while allowing full mobility
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const IronGloves: EquipmentItem = {
  "itemId": "iron_gloves",
  "name": "Iron Gloves",
  "description": "Articulated iron gauntlets protecting hands while allowing full mobility",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.HANDWEAR,
    SUBCATEGORY.HEAVY_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.GLOVES,
  "slot": SLOT.GLOVES,
  "baseValue": 160,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/gauntlet.svg",
    "material": "iron_gloves"
  },
  "properties": {
    "weight": 4,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "armor": 10,
    "evasion": -1,
    "requiredLevel": 14
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
