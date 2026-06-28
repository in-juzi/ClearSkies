/**
 * Sigil Solvent - an enchanter's reagent that loosens a sigil's binding so it
 * pops back out of a socket intact. Consumed by the extraction action (one
 * solvent per extraction). This is the "removable-for-a-cost" spine: the cost
 * is one tunable data value (this reagent), sitting between free removal and a
 * destructive one. See project/ideas/enchanting.md "Locked decisions".
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const SigilSolvent: ResourceItem = {
  "itemId": "sigil_solvent",
  "name": "Sigil Solvent",
  "description": "A volatile draught that dissolves the bond between gem and socket. Applied carefully, it frees a socketed sigil unharmed - the gem keeps its essence, ready to be reseated elsewhere.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.ENCHANTING, SUBCATEGORY.MAGICAL],
  "rarity": RARITY.UNCOMMON,
  "baseValue": 40,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.AQUAMARINE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.ENCHANTING
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "item-categories/item_cat_potion.svg",
    "material": "aquamarine"
  }
} as const;
