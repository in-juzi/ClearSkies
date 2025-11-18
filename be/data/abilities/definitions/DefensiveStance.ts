/**
 * Defensive Stance
 * Assume a defensive posture, significantly increasing armor for a short duration. Practice makes perfect.
 */

import { Ability } from '@shared/types';

export const DefensiveStance: Ability = {
  "abilityId": "defensive_stance",
  "name": "Defensive Stance",
  "description": "Assume a defensive posture, significantly increasing armor for a short duration. Practice makes perfect.",
  "type": "buff",
  "targetType": "self",
  "powerMultiplier": 1.0,
  "manaCost": 8,
  "cooldown": 4,
  "requirements": {
    "weaponTypes": [
      "oneHanded",
      "dualWield",
      "twoHanded",
      "ranged",
      "casting"
    ],
    "minSkillLevel": 1
  },
  "effects": {
    "applyBuff": {
      "target": "self",
      "name": "Defensive Stance",
      "description": "+20 armor",
      "duration": 3,
      "icon": {
        "path": "status/status_armor_up.svg",
        "material": "generic"
      },
      "statModifiers": [
        {
          "stat": "armor",
          "type": "flat",
          "value": 20
        }
      ]
    }
  },
  "xpOnUse": 15,
  "icon": {
    "path": "abilities/defensive_stance.svg",
    "material": "default"
  }
} as const;
