/**
 * Bronze Mining Pickaxe - A basic pickaxe for mining ore
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const BronzeMiningPickaxe: EquipmentItem = {
  "itemId": "bronze_mining_pickaxe",
  "name": "Bronze Mining Pickaxe",
  "description": "A basic pickaxe for mining ore",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.TOOL,
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.GATHERING,
    SUBCATEGORY.MINING,
    SUBCATEGORY.PICKAXE,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.ONE_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.MINING_PICKAXE,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 90,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/pickaxe.svg",
    "material": "bronze_mining_pickaxe"
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "damageRoll": "1d2",
    "attackSpeed": 3,
    "critChance": 0.04,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
