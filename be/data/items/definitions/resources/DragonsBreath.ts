/**
 * Dragon's Breath - Rare crimson flowers that grow in volcanic soil, their petals warm to the touch
 * Tier: 3
 */

import { ResourceItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SKILL_SOURCE } from '../../../constants/item-constants';

export const DragonsBreath: ResourceItem = {
  "itemId": "dragons_breath",
  "name": "Dragon's Breath",
  "description": "Rare crimson flowers that grow in volcanic soil, their petals warm to the touch",
  "category": CATEGORY.RESOURCE,
  "subcategories": [
    "flower",
    "herb",
    "alchemical",
    "magical",
    "rare"
  ],
  "baseValue": 100,
  "rarity": RARITY.RARE,
  "stackable": true,
  "properties": {
    "weight": 0.2,
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
