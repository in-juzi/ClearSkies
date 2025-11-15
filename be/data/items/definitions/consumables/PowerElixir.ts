/**
 * Power Elixir - A potent brew infused with the mystical essence of mandrake
 * Tier: 2
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const PowerElixir: ConsumableItem = {
  "itemId": "power_elixir",
  "name": "Power Elixir",
  "description": "A potent brew infused with the mystical essence of mandrake. Amplifies offensive power.",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": [SUBCATEGORY.POTION],
  "baseValue": 75,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T2
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": TRAIT_SETS.NONE,
  "icon": {
    "path": "items/potion-ball.svg",
    "material": "mandrake"
  }
} as const;
