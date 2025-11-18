/**
 * Iron Battleaxe - A heavy two-handed axe
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, TRAIT_IDS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronBattleaxe: EquipmentItem = {
  "itemId": "iron_battleaxe",
  "name": "Iron Battleaxe",
  "description": "A heavy two-handed axe designed for powerful cleaving strikes. Requires both hands to wield.",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.AXE,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.TWO_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.AXE,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 275,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_axe.svg",
    "material": "iron_battleaxe"
  },
  "properties": {
    "weight": 9,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d12",
    "attackSpeed": 3.8,
    "critChance": 0.08,
    "skillScalar": SKILL_SOURCE.TWO_HANDED,
    "twoHanded": true,
    "requiredLevel": 10
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [...TRAIT_SETS.EQUIPMENT_PRISTINE, TRAIT_IDS.HARDENED, TRAIT_IDS.BALANCED]
} as const;
