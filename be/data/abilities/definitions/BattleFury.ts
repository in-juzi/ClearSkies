import { Ability } from '@shared/types';

/**
 * Battle Fury - Self buff that increases damage
 *
 * A powerful buff that increases the wielder's damage output.
 * Duration: 3 turns
 * Cooldown: 5 turns
 */
export const BattleFury: Ability = {
  abilityId: 'battle_fury',
  name: 'Battle Fury',
  description: 'Channel your rage to deal +20% damage for 3 turns.',
  type: 'buff',
  targetType: 'self',
  powerMultiplier: 0, // No immediate damage
  manaCost: 15,
  cooldown: 5,
  requirements: {
    weaponTypes: ['oneHanded', 'twoHanded'],
    minSkillLevel: 5
  },
  effects: {
    applyBuff: {
      target: 'self',
      name: 'Battle Fury',
      description: '+20% damage',
      duration: 3,
      icon: {
        path: 'status/status_battle_high.svg',
        material: 'gem_ruby'
      },
      statModifiers: [
        {
          stat: 'damage',
          type: 'percentage',
          value: 0.20 // +20% damage
        }
      ]
    }
  },
  icon: {
    path: 'status/status_battle_high.svg',
    material: 'generic'
  }
};
