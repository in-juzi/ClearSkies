/**
 * Fury Brew - A fiery elixir that ignites the warrior spirit and sharpens killing intent
 * Tier: 3
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const FuryBrew: ConsumableItem = {
  "itemId": "fury_brew",
  "name": "Fury Brew",
  "description": "A fiery elixir made from dragon's breath that ignites the warrior spirit. Increases critical strike chance.",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": [SUBCATEGORY.POTION],
  "baseValue": 125,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/potion-ball.svg",
    "material": "dragons_breath"
  }
} as const;
