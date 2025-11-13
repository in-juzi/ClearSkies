/**
 * Cod - A thick-fleshed cod, prized for its meaty texture
 * Tier: 3
 */

import { ConsumableItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, MATERIAL, SKILL_SOURCE, SUBCATEGORIES } from '../../../constants/item-constants';

export const Cod: ConsumableItem = {
  "itemId": "cod",
  "name": "Cod",
  "description": "A thick-fleshed cod, prized for its meaty texture",
  "category": CATEGORY.CONSUMABLE,
  "subcategories": SUBCATEGORIES.FISH_SALTWATER,
  "baseValue": 50,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 2.0,
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
