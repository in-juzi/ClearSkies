/**
 * Bronze Gloves - Bronze gauntlets protecting the hands and wrists
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const BronzeGloves: EquipmentItem = {
  "itemId": "bronze_gloves",
  "name": "Bronze Gloves",
  "description": "Bronze gauntlets protecting the hands and wrists",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.HANDWEAR,
    SUBCATEGORY.MEDIUM_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.GLOVES,
  "slot": SLOT.GLOVES,
  "baseValue": 100,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/gauntlet.svg",
    "material": "bronze_gloves"
  },
  "properties": {
    "weight": 3,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "armor": 6,
    "evasion": 0,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
