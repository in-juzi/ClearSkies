import { Ability } from '@shared/types';

/**
 * Poison Strike - DoT debuff ability
 *
 * Coats your weapon in poison, dealing immediate damage
 * and poisoning the enemy for additional damage over time.
 * Duration: 4 turns
 * Cooldown: 6 turns
 */
export const PoisonStrike: Ability = {
  abilityId: 'poison_strike',
  name: 'Poison Strike',
  description: 'Strike with a poisoned blade, dealing 1.2x damage and 5 poison damage per turn for 4 turns.',
  type: 'debuff',
  targetType: 'single',
  powerMultiplier: 1.2,
  manaCost: 18,
  cooldown: 6,
  requirements: {
    weaponTypes: ['oneHanded', 'dualWield'],
    minSkillLevel: 7
  },
  effects: {
    damage: {
      type: 'physical',
      multiplier: 1.2
    },
    applyBuff: {
      target: 'enemy',
      name: 'Poisoned',
      description: '5 damage per turn',
      duration: 4,
      icon: {
        path: 'abilities/poison.svg',
        material: 'generic'
      },
      damageOverTime: 5 // 5 damage per turn
    }
  },
  icon: {
    path: 'abilities/poison.svg',
    material: 'generic'
  }
};
