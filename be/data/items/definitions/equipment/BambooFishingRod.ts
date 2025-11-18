/**
 * Bamboo Fishing Rod - A simple fishing rod made from bamboo
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const BambooFishingRod: EquipmentItem = {
  "itemId": "bamboo_fishing_rod",
  "name": "Bamboo Fishing Rod",
  "description": "A simple fishing rod made from bamboo",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.TOOL,
    SUBCATEGORY.WEAPON,
    SUBCATEGORY.GATHERING,
    SUBCATEGORY.FISHING,
    SUBCATEGORY.ROD,
    SUBCATEGORY.MELEE,
    SUBCATEGORY.ONE_HANDED
  ],
  "subtype": WEAPON_SUBTYPE.FISHING_ROD,
  "slot": SLOT.MAIN_HAND,
  "baseValue": 50,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/fishing-pole.svg",
    "material": "bamboo_fishing_rod"
  },
  "properties": {
    "weight": 2,
    "material": MATERIAL.BAMBOO,
    "tier": TIER.T1,
    "damageRoll": "1d2",
    "attackSpeed": 2.2,
    "critChance": 0.03,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.TOOL_PRISTINE
} as const;
