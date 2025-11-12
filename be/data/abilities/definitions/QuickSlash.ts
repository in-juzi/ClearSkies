/**
 * Quick Slash
 * A swift strike that deals moderate damage with a short cooldown. Speed over power.
 */

import { Ability } from '../../../types/combat';

export const QuickSlash: Ability = {
  "abilityId": "quick_slash",
  "name": "Quick Slash",
  "description": "A swift strike that deals moderate damage with a short cooldown. Speed over power.",
  "type": "attack",
  "targetType": "single",
  "powerMultiplier": 1.3,
  "manaCost": 1,
  "cooldown": 1,
  "requirements": {
    "weaponTypes": [
      "oneHanded",
      "dualWield"
    ],
    "minSkillLevel": 1
  },
  "effects": {
    "damage": {
      "type": "physical",
      "multiplier": 1.3
    }
  },
  "icon": {
    "path": "abilities/ability_quick_slash.svg",
    "material": "default"
  }
} as const;
