/**
 * Rapid Fire
 * Unleash a flurry of quick shots that deal moderate damage. Quantity has a quality all its own.
 */

import { Ability } from '../../../types/combat';

export const RapidFire: Ability = {
  "abilityId": "rapid_fire",
  "name": "Rapid Fire",
  "description": "Unleash a flurry of quick shots that deal moderate damage. Quantity has a quality all its own.",
  "type": "attack",
  "targetType": "single",
  "powerMultiplier": 1.8,
  "manaCost": 12,
  "cooldown": 2,
  "requirements": {
    "weaponTypes": [
      "ranged"
    ],
    "minSkillLevel": 3
  },
  "effects": {
    "damage": {
      "type": "physical",
      "multiplier": 1.8
    }
  },
  "icon": {
    "path": "abilities/rapid_fire.svg",
    "material": "default"
  }
} as const;
