import { Ability } from '@shared/types';

/**
 * Regeneration - HoT self buff
 *
 * Channel healing energy to restore health over time.
 * No immediate effect, but heals for 3 turns.
 * Duration: 3 turns
 * Cooldown: 7 turns
 */
export const Regeneration: Ability = {
  abilityId: 'regeneration',
  name: 'Regeneration',
  description: 'Channel healing energy to restore 8 HP per turn for 3 turns.',
  type: 'buff',
  targetType: 'self',
  powerMultiplier: 0, // No immediate damage
  manaCost: 20,
  cooldown: 7,
  requirements: {
    weaponTypes: ['casting'],
    minSkillLevel: 5
  },
  effects: {
    applyBuff: {
      target: 'self',
      name: 'Regeneration',
      description: '8 HP per turn',
      duration: 3,
      icon: {
        path: 'abilities/ability_regeneration.svg',
        material: 'herb_rare'
      },
      healOverTime: 8 // 8 HP per turn
    }
  },
  icon: {
    path: 'abilities/ability_regeneration.svg',
    material: 'generic'
  }
};
