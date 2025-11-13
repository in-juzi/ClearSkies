/**
 * Silver Ore - Precious silver ore with a lustrous shine
 * Tier: 3
 */

import { ResourceItem } from '../../../../types/items';
import { SUBCATEGORY, CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, SUBCATEGORIES, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const SilverOre: ResourceItem = {
  "itemId": "silver_ore",
  "name": "Silver Ore",
  "description": "Precious silver ore with a lustrous shine",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "ore",
    "mineral",
    SUBCATEGORY.METAL,
    "precious"
  ],
  "baseValue": 120,
  "rarity": RARITY.UNCOMMON,
  "stackable": true,
  "properties": {
    "weight": 5.5,
    "material": MATERIAL.GENERIC,
    "tier": TIER.T3,
    "skillSource": SKILL_SOURCE.MINING
  },
  "allowedQualities": QUALITY_SETS.ORE,
  "allowedTraits": [
    "pristine",
    "blessed"
  ],
  "icon": {
    "path": "item-categories/item_cat_ore.svg",
    "material": "silver_ore"
  }
} as const;
