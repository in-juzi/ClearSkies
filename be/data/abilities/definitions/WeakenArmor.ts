import { Ability } from '@shared/types';

/**
 * Weaken Armor - Enemy debuff that reduces armor
 *
 * Strikes the enemy's armor, creating weak points.
 * Deals moderate damage and reduces enemy armor.
 * Duration: 2 turns
 * Cooldown: 4 turns
 */
export const WeakenArmor: Ability = {
  abilityId: 'weaken_armor',
  name: 'Weaken Armor',
  description: 'Strike armor weak points, dealing 1.3x damage and reducing enemy armor by 15 for 2 turns.',
  type: 'debuff',
  targetType: 'single',
  powerMultiplier: 1.3,
  manaCost: 12,
  cooldown: 4,
  requirements: {
    weaponTypes: ['oneHanded', 'twoHanded'],
    minSkillLevel: 3
  },
  effects: {
    damage: {
      type: 'physical',
      multiplier: 1.3
    },
    applyBuff: {
      target: 'enemy',
      name: 'Weakened Armor',
      description: '-15 armor',
      duration: 2,
      icon: {
        path: 'abilities/weaken-armor.svg',
        material: 'generic'
      },
      statModifiers: [
        {
          stat: 'armor',
          type: 'flat',
          value: -15 // -15 armor
        }
      ]
    }
  },
  icon: {
    path: 'abilities/weaken-armor.svg',
    material: 'generic'
  }
};
