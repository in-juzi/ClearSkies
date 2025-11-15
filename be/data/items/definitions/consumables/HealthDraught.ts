/**
 * Minor Health Potion - A small potion that restores a modest amount of health
 * Tier: 1
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL } from '../../../constants/item-constants';

export const HealthDraught: ConsumableItem = {
  "itemId": "health_draught",
  "name": "Health Draught",
  "description": "A simple alchemical brew that restores a modest amount of health",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.POTION,
  "baseValue": 35,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1,
    "healthRestore": 35
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.POTION,
  "icon": {
    "path": "item-categories/item_cat_potion_1.svg",
    "material": "health_potion"
  }
} as const;
