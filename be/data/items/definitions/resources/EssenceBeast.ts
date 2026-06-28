/**
 * Beast Essence - Crystallized mana left behind by a slain beast.
 * Lore: a monster is born of magic, and on defeat its mana is conserved,
 * crystallizing into an essence (see project/ideas/story.md).
 * Used in enchanting to craft socketables carrying the beast's feral instinct.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const EssenceBeast: ResourceItem = {
  "itemId": "essence_beast",
  "name": "Beast Essence",
  "description": "Crystallized mana left behind by a slain beast. It pulses with feral instinct - a prized reagent for enchanting.",
  "category": CATEGORY.RESOURCE,
  "subcategories": [SUBCATEGORY.MONSTER_DROP, SUBCATEGORY.ENCHANTING, SUBCATEGORY.MAGICAL],
  "rarity": RARITY.UNCOMMON,
  "baseValue": 15,
  "stackable": true,
  "maxStack": 999,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "skillSource": SKILL_SOURCE.COMBAT
  },
  "allowedQualities": QUALITY_SETS.SHEEN,
  "allowedTraits": TRAIT_SETS.PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_gem.svg",
    "material": "garnet"
  }
} as const;
