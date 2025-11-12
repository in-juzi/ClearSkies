/**
 * Aimed Shot
 * Take careful aim and fire a precise shot with increased critical hit chance. Patience yields deadly ...
 */

import { Ability } from '../../../types/combat';

export const AimedShot: Ability = {
  "abilityId": "aimed_shot",
  "name": "Aimed Shot",
  "description": "Take careful aim and fire a precise shot with increased critical hit chance. Patience yields deadly results.",
  "type": "attack",
  "targetType": "single",
  "powerMultiplier": 1.5,
  "manaCost": 10,
  "cooldown": 2,
  "requirements": {
    "weaponTypes": [
      "ranged",
      "gun"
    ],
    "minSkillLevel": 1
  },
  "effects": {
    "damage": {
      "type": "physical",
      "multiplier": 1.5
    },
    "critChanceBonus": 0.15
  },
  "icon": {
    "path": "abilities/aimed_shot.svg",
    "material": "default"
  }
} as const;
