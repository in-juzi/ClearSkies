/**
 * Bronze Amulet - A simple cast-bronze pendant on a chain. The first craftable
 * jewelry base: it fills the long-empty necklace slot, and at uncommon rarity it
 * carries a single socket, so an enchanter can charge it with a sigil. The plain
 * metal does nothing on its own — its worth is the stone it will one day hold.
 * Tier: 1
 */

import { EquipmentItem } from '@shared/types';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SLOT } from '../../../constants/item-constants';

export const BronzeAmulet: EquipmentItem = {
  "itemId": "bronze_amulet",
  "name": "Bronze Amulet",
  "description": "A simple cast-bronze pendant. Plain on its own, but its socket waits for a sigil's spark.",
  "category": CATEGORY.EQUIPMENT,
  "subcategories": [
    SUBCATEGORY.JEWELRY,
    SUBCATEGORY.METAL
  ],
  "subtype": "amulet",
  "slot": SLOT.NECKLACE,
  "baseValue": 140,
  "rarity": RARITY.UNCOMMON,
  "stackable": false,
  "icon": {
    "path": "item-categories/item_cat_amulet.svg",
    "material": "bronze_amulet"
  },
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.BRONZE,
    "tier": TIER.T1,
    "requiredLevel": 1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.EQUIPMENT_PRISTINE
} as const;
