/**
 * Willow Fishing Rod - A flexible fishing rod made from willow wood
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, WEAPON_SUBTYPE, SKILL_SOURCE } from '../../../constants/item-constants';

export const WillowFishingRod: EquipmentItem = {
  "itemId": "willow_fishing_rod",
  "name": "Willow Fishing Rod",
  "description": "A flexible fishing rod made from willow wood",
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
  "baseValue": 150,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/fishing-pole.svg",
    "material": "willow_fishing_rod"
  },
  "properties": {
    "weight": 2,
    "material": MATERIAL.WILLOW,
    "tier": TIER.T2,
    "damageRoll": "1d3",
    "attackSpeed": 2.4,
    "critChance": 0.04,
    "skillScalar": SKILL_SOURCE.ONE_HANDED,
    "toolEfficiency": 1.5,
    "requiredLevel": 5
  },
  "allowedQualities": QUALITY_SETS.WOOD,
  "allowedTraits": TRAIT_SETS.TOOL_PRISTINE
} as const;
