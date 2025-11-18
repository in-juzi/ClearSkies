/**
 * Bronze Woodcutting Axe - A basic axe for chopping trees
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE, TRAIT_IDS } from '../../../constants/item-constants';

export const BronzeWoodcuttingAxe: EquipmentItem = {
  "itemId": "bronze_woodcutting_axe",
  "name": "Bronze Woodcutting Axe",
  "description": "A basic axe for chopping trees",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.TOOL,
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.GATHERING,
    SUBCATEGORY.WOODCUTTING,
    SUBCATEGORY.AXE,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.ONE_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.WOODCUTTING_AXE,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 80,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_axe.svg",
    "material": "bronze_woodcutting_axe"
  },
  "properties": {
    "weight": 4,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "damageRoll": "1d2",
    "attackSpeed": 2.8,
    "critChance": 0.04,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [...TRAIT_SETS.EQUIPMENT_PRISTINE, TRAIT_IDS.BALANCED, TRAIT_IDS.HARDENED]
} as const;
