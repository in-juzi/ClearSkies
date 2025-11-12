/**
 * Wisteria - Cascading clusters of lavender blossoms that hang like fragrant curtains from ancient vines
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';

export const Wisteria: ResourceItem = {
  "itemId": "wisteria",
  "name": "Wisteria",
  "description": "Cascading clusters of lavender blossoms that hang like fragrant curtains from ancient vines",
  "category": "resource",
  "subcategories": [
    "flower",
    "herb",
    "aromatic",
    "decorative",
    "alchemical"
  ],
  "baseValue": 28,
  "rarity": "uncommon",
  "stackable": true,
  "properties": {
    "weight": 0.15,
    "material": "herb",
    "tier": 2,
    "skillSource": "herbalism"
  },
  "allowedQualities": [],
  "allowedTraits": [
    "fragrant",
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "items/vine-flower.svg",
    "material": "wisteria"
  }
} as const;
