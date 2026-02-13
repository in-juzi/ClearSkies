/**
 * Raw Cod - A thick-fleshed cod, prized for its meaty texture
 * Tier: 3
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Cod: ResourceItem = {
  "itemId": "cod",
  "name": "Raw Cod",
  "description": "A thick-fleshed raw cod, prized for its meaty texture",
  "category": CATEGORY.RESOURCE,
  "subcategories": SUBCATEGORIES.FISH_SALTWATER,
  "baseValue": 50,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 1.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.FISHING
  },
  "allowedQualities": [
    "size",
    "juicy"
  ],
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_meat.svg",
    "material": "fish"
  }
} as const;
