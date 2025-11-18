/**
 * Iron Mining Pickaxe - A sturdy iron pickaxe for mining ore
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronMiningPickaxe: EquipmentItem = {
  "itemId": "iron_mining_pickaxe",
  "name": "Iron Mining Pickaxe",
  "description": "A sturdy iron pickaxe for mining ore",
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
  "baseValue": 220,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/pickaxe.svg",
    "material": "iron_mining_pickaxe"
  },
  "properties": {
    "weight": 6,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d2",
    "attackSpeed": 3.2,
    "critChance": 0.05,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1.5,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
