/**
 * Warding Tonic - A protective brew that hardens the skin and fortifies defenses
 * Tier: 1
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const WardingTonic: ConsumableItem = {
  "itemId": "warding_tonic",
  "name": "Warding Tonic",
  "description": "A protective brew made from sage that hardens the skin and fortifies defenses. Grants temporary armor.",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": [SUBCATEGORY.POTION],
  "baseValue": 35,
  "rarity": RARITY.COMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T1
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/potion-ball.svg",
    "material": "sage"
  }
} as const;
