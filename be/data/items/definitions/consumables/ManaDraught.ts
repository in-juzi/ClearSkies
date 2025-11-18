/**
 * Minor Mana Potion - A small potion that restores a modest amount of mana
 * Tier: 1
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL } from '../../../constants/item-constants';

export const ManaDraught: ConsumableItem = {
  "itemId": "mana_draught",
  "name": "Mana Draught",
  "description": "A simple alchemical brew that restores a modest amount of mana",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.POTION,
  "baseValue": 35,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "manaRestore": 35
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.POTION,
  "icon": {
    "path": "item-categories/item_cat_potion_1.svg",
    "material": "mana_potion"
  }
} as const;
