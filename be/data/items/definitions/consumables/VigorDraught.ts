/**
 * Vigor Draught - An energizing concoction that quickens reflexes and sharpens strikes
 * Tier: 2
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, SUBCATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const VigorDraught: ConsumableItem = {
  "itemId": "vigor_draught",
  "name": "Vigor Draught",
  "description": "An energizing concoction made from nettle that quickens reflexes. Increases attack speed.",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": [SUBCATEGORY.POTION],
  "baseValue": 50,
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
    "material": "nettle"
  }
} as const;
