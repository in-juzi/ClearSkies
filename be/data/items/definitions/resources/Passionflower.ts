/**
 * Passionflower - Exotic purple blooms with intricate radiating centers, said to inspire dreams and deep meditation
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const Passionflower: ResourceItem = {
  "itemId": "passionflower",
  "name": "Passionflower",
  "description": "Exotic purple blooms with intricate radiating centers, said to inspire dreams and deep meditation",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "medicinal",
    "alchemical",
    "rare"
  ],
  "baseValue": 50,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": MATERIAL.HEMP,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "passionflower"
  }
} as const;
