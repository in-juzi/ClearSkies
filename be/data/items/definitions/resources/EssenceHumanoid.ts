/**
 * Humanoid Essence - Crystallized mana left behind by a slain humanoid.
 * Lore: a monster is born of magic, and on defeat its mana is conserved,
 * crystallizing into an essence (see project/ideas/story.md).
 * Used in enchanting to craft socketables carrying the outlaw's martial opportunism.
 * Tier: 1
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORY, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const EssenceHumanoid: ResourceItem = {
  "itemId": "essence_humanoid",
  "name": "Humanoid Essence",
  "description": "Crystallized mana left behind by a slain humanoid. It carries a sharp, opportunistic edge - a prized reagent for enchanting.",
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
    "material": "citrine"
  }
} as const;
