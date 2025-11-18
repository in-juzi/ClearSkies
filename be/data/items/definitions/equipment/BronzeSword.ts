/**
 * Bronze Sword - A sturdy sword forged from bronze, reliable in combat
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const BronzeSword: EquipmentItem = {
  "itemId": "bronze_sword",
  "name": "Bronze Sword",
  "description": "A sturdy sword forged from bronze, reliable in combat",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.SWORD,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.ONE_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.SWORD,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 120,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": "bronze_sword"
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "damageRoll": "1d4",
    "attackSpeed": 2.4,
    "critChance": 0.05,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT
} as const;
