/**
 * Trumpet Vine - Bold scarlet-orange blooms shaped like heralds' trumpets, their fiery petals crackling with latent energy
 * Tier: 3
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const TrumpetVine: ResourceItem = {
  "itemId": "trumpet_vine",
  "name": "Trumpet Vine",
  "description": "Bold scarlet-orange blooms shaped like heralds' trumpets, their fiery petals crackling with latent energy",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "medicinal",
    "rare"
  ],
  "baseValue": 60,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": MATERIAL.HEMP,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "trumpet_vine"
  }
} as const;
