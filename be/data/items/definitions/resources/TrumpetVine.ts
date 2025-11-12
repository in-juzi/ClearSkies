/**
 * Trumpet Vine - Bold scarlet-orange blooms shaped like heralds' trumpets, their fiery petals crackling with latent energy
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';

export const TrumpetVine: ResourceItem = {
  "itemId": "trumpet_vine",
  "name": "Trumpet Vine",
  "description": "Bold scarlet-orange blooms shaped like heralds' trumpets, their fiery petals crackling with latent energy",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "medicinal",
    "rare"
  ],
  "baseValue": 60,
  "rarity": "rare",
  "stackable": true,
  "properties": {
    "weight": 0.2,
    "material": "herb",
    "tier": 3,
    "skillSource": "herbalism"
  },
  "allowedQualities": [],
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
