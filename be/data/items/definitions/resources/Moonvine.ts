/**
 * Moonvine - Ethereal silver-blue flowers that bloom only under moonlight, their petals glowing with celestial radiance
 * Tier: 4
 */

import { ResourceItem } from '../../../../types/items';

export const Moonvine: ResourceItem = {
  "itemId": "moonvine",
  "name": "Moonvine",
  "description": "Ethereal silver-blue flowers that bloom only under moonlight, their petals glowing with celestial radiance",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare",
    "nocturnal"
  ],
  "baseValue": 120,
  "rarity": "epic",
  "stackable": true,
  "properties": {
    "weight": 0.1,
    "material": "herb",
    "tier": 4,
    "skillSource": "gathering"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed",
    "masterwork"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "moonvine"
  }
} as const;
