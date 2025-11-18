/**
 * Iron Sword - A reliable iron sword
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE, TRAIT_IDS } from '../../../constants/item-constants';

export const IronSword: EquipmentItem = {
  "itemId": "iron_sword",
  "name": "Iron Sword",
  "description": "A reliable iron sword",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.SWORD,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.ONE_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.SWORD,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 250,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": MATERIAL.IRON
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d6",
    "attackSpeed": 2.6,
    "critChance": 0.06,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [...TRAIT_SETS.EQUIPMENT_PRISTINE, TRAIT_IDS.HARDENED, TRAIT_IDS.BALANCED]
} as const;
