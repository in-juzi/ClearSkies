/**
 * Health Potion - A refined alchemical brew that restores moderate health
 * Tier: 2 | Alchemy
 */

import { ConsumableItem } from '../../../../types/items';
import { RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const HealthPotion: ConsumableItem = {
  itemId: 'health_potion',
  name: 'Health Potion',
  description: 'A refined alchemical brew that restores moderate health. Enhanced with chamomile for calming properties.',
  category: 'consumable',
  subcategories: ['potion', 'healing', 'alchemical'],
  baseValue: 50,
  rarity: RARITY.UNCOMMON,
  stackable: true,
  properties: {
    weight: 0.3,
    material: MATERIAL.GENERIC,
    tier: TIER.T2,
    healthRestore: 50
  },
  allowedQualities: QUALITY_SETS.NONE,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'health_potion'
  }
} as const;
