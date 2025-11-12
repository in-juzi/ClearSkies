/**
 * Strong Health Potion - A potent alchemical elixir that restores substantial health
 * Tier: 3 | Alchemy
 */

import { ConsumableItem } from '../../../../types/items';
import { RARITY, TIER, QUALITY_SETS, TRAIT_SETS, MATERIAL } from '../../../constants/item-constants';

export const HealthPotionStrong: ConsumableItem = {
  itemId: 'strong_health_potion',
  name: 'Strong Health Elixir',
  description: 'A potent alchemical elixir that restores substantial health. Combines multiple herbs for maximum efficacy.',
  category: 'consumable',
  subcategories: ['potion', 'healing', 'alchemical', 'elixir'],
  baseValue: 100,
  rarity: RARITY.RARE,
  stackable: true,
  properties: {
    weight: 0.4,
    material: MATERIAL.GENERIC,
    tier: TIER.T3,
    healthRestore: 100
  },
  allowedQualities: QUALITY_SETS.NONE,
  allowedTraits: TRAIT_SETS.POTION,
  icon: {
    path: 'item-categories/item_cat_potion_1.svg',
    material: 'health_potion'
  }
} as const;
