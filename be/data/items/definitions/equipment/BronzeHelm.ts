/**
 * Bronze Helm - A protective helmet forged from bronze plates
 * Tier: 1
 */

import { EquipmentItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT, ARMOR_SUBTYPE, TRAIT_IDS } from '../../../constants/item-constants';

export const BronzeHelm: EquipmentItem = {
  "itemId": "bronze_helm",
  "name": "Bronze Helm",
  "description": "A protective helmet forged from bronze plates",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.ARMOR,
    SUBCATEGORY.HEADGEAR,
    SUBCATEGORY.MEDIUM_ARMOR,
    SUBCATEGORY.METAL
  ],
  "subtype": ARMOR_SUBTYPE.HELM,
  "slot": SLOT.HEAD,
  "baseValue": 130,
  "rarity": RARITY.COMMON,
  "stackable": false,
  "icon": {
    "path": "items/light-helm.svg",
    "material": "bronze_helm"
  },
  "properties": {
    "weight": 5,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "armor": 10,
    "evasion": 0,
    "requiredLevel": 7
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [...TRAIT_SETS.EQUIPMENT_PRISTINE, TRAIT_IDS.REINFORCED]
} as const;
