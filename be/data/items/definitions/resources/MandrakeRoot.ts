/**
 * Mandrake Root - A mystical root shaped like a human form, whispered to have powerful magical properties
 * Tier: 2
 */

import { ResourceItem } from '../../../../types/items';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const MandrakeRoot: ResourceItem = {
  "itemId": "mandrake_root",
  "name": "Mandrake Root",
  "description": "A mystical root shaped like a human form, whispered to have powerful magical properties",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "root",
    "herb",
    "alchemical",
    "magical"
  ],
  "baseValue": 45,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 0.3,
    "material": MATERIAL.HEMP,
    "tier": TIER.T2,
    "skillSource": SKILL_SOURCE.GATHERING
  },
  "allowedQualities": QUALITY_SETS.NONE,
  "allowedTraits": [
    "pristine",
    "blessed",
    "cursed"
  ],
  "icon": {
    "path": "item-categories/item_cat_mushroom.svg",
    "material": "herb"
  }
} as const;
