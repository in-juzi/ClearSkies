/**
 * Weak Health Potion - A basic alchemical remedy that restores minor health
 * Tier: 1 | Alchemy
 */

import { ConsumableItem } from '@shared/types';
import { CATEGORY, RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL, SUBCATEGORIES } from '../../../constants/item-constants';

export const HealthTincture: ConsumableItem = {
  itemId: 'health_tincture',
  name: 'Health Tincture',
  description: 'A basic alchemical remedy that restores a small amount of health. Crafted from common herbs.',
  category: CATEGORY.CONSUMABLE,
  subcategories: SUBCATEGORIES.HEALTH_TINCTURE,
  baseValue: 25,
  rarity: RARITY.COMMON,
  stackable: true,
  properties: {
    weight: 0.2,
    material: MATERIAL.GENERIC,
    tier: TIER.T1,
    healthRestore: 20
  },
  allowedQualities: QUALITY_SETS.POTENCY,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'health_potion'
  }
} as const;
