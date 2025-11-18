/**
 * Iron Woodcutting Axe - A sturdy iron axe for chopping trees
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronWoodcuttingAxe: EquipmentItem = {
  "itemId": "iron_woodcutting_axe",
  "name": "Iron Woodcutting Axe",
  "description": "A sturdy iron axe for chopping trees",
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
  "baseValue": 200,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_axe.svg",
    "material": "iron_woodcutting_axe"
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d2",
    "attackSpeed": 2.9,
    "critChance": 0.05,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1.5,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
