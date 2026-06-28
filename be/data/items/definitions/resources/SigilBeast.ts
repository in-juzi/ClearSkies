/**
 * Beast Sigil - a gem-vessel with a beast's crystallized essence bound into it.
 * Crafted via enchanting (essence_beast + a gemstone vessel). Socketed into
 * gear, it lends a predator's instinct: a passive bonus to critical strike
 * chance. Unlike the goblinoid sigil (a trigger), this is a plain passive
 * applicator — it rides the same COMBAT_CRIT_CHANCE channel as traits/qualities.
 *
 * See project/ideas/enchanting.md (family→effect table). Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';
import { EffectContext, ModifierType } from '@shared/types/effect-system';

export const SigilBeast: ResourceItem = {
  "itemId": "sigil_beast",
  "name": "Beast Sigil",
  "description": "A cut gem with a beast's essence bound into its lattice. Socketed into gear, it sharpens a predator's instinct for the killing blow - a passive bonus to critical strikes.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.SOCKETABLE, SUBCATEGORY.ENCHANTING, SUBCATEGORY.MAGICAL],
  "rarity": RARITY.UNCOMMON,
  "baseValue": 60,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GEMSTONE,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.ENCHANTING
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.NONE,
  "socketEffect": {
    "applicators": [
      {
        "context": EffectContext.COMBAT_CRIT_CHANCE,
        "modifierType": ModifierType.FLAT,
        "value": 0.05,
        "description": "+5% critical strike chance while socketed."
      }
    ]
  },
  "icon": {
    "path": "item-categories/item_cat_gem.svg",
    "material": "garnet"
  }
} as const;
