/**
 * Twin-Strike Mining Pickaxe - A rare lightweight pickaxe that can be wielded in the off-hand for dual-mining techniques
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const RareIronMiningPickaxeOffhand: EquipmentItem = {
  "itemId": "rare_iron_mining_pickaxe_offhand",
  "name": "Twin-Strike Mining Pickaxe",
  "description": "A rare lightweight pickaxe that can be wielded in the off-hand for dual-mining techniques",
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
  "slot": SLOT.OFF_HAND,
  "baseValue": 450,
  "rarity": RARITY.RARE,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_tool.svg",
    "material": MATERIAL.IRON
  },
  "properties": {
    "weight": 4,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d3",
    "attackSpeed": 2.6,
    "critChance": 0.06,
    "skillScalar": SKILL_SOURCE.DUAL_WIELD,
    "toolEfficiency": 1.2,
    "requiredLevel": 8
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
