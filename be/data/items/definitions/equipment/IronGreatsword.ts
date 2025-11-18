/**
 * Iron Greatsword - A massive two-handed sword
 * Tier: 2
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, TRAIT_IDS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const IronGreatsword: EquipmentItem = {
  "itemId": "iron_greatsword",
  "name": "Iron Greatsword",
  "description": "A massive two-handed sword that deals devastating damage. Requires both hands to wield effectively.",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.SWORD,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.TWO_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.SWORD,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 250,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_sword.svg",
    "material": "iron_greatsword"
  },
  "properties": {
    "weight": 8,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "damageRoll": "1d10",
    "attackSpeed": 3.5,
    "critChance": 0.07,
    "skillScalar": SKILL_SOURCE.TWO_HANDED,
    "twoHanded": true,
    "requiredLevel": 10
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [...TRAIT_SETS.EQUIPMENT_PRISTINE, TRAIT_IDS.HARDENED, TRAIT_IDS.BALANCED]
} as const;
