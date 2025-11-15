/**
 * Moonpetal - Luminescent white petals that shimmer in moonlight, used in the most potent elixirs
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Moonpetal: ResourceItem = {
  "itemId": "moonpetal",
  "name": "Moonpetal",
  "description": "Luminescent white petals that shimmer in moonlight, used in the most potent elixirs",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare"
  ],
  "baseValue": 80,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": MATERIAL.HEMP,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.HERB,
  "allowedTraits": TRAIT_SETS.HERB_PRISTINE,
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
