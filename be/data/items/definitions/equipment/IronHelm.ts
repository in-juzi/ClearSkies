/**
 * Iron Helm - A sturdy iron helmet
 * Tier: 2
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE } from '../../../constants/item-constants';

export const IronHelm: EquipmentItem = {
  "itemId": "iron_helm",
  "name": "Iron Helm",
  "description": "A sturdy iron helmet",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.HEADGEAR,
    SUBCATEGORY.HEAVY_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.HELM,
  "slot": SLOT.HEAD,
  "baseValue": 150,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/light-helm.svg",
    "material": "iron_helm"
  },
  "properties": {
    "weight": 6,
    "material": MATERIAL.IRON,
    "tier": TIER.T2,
    "armor": 15,
    "evasion": 0,
    "requiredLevel": 3
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
