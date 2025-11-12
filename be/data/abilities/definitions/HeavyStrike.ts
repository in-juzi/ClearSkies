/**
 * Heavy Strike
 * A powerful overhead blow that deals increased damage. The weight of your weapon comes crashing down ...
 */

import { Ability } from '../../../types/combat';

export const HeavyStrike: Ability = {
  "abilityId": "heavy_strike",
  "name": "Heavy Strike",
  "description": "A powerful overhead blow that deals increased damage. The weight of your weapon comes crashing down on your foe.",
  "type": "attack",
  "targetType": "single",
  "powerMultiplier": 2,
  "manaCost": 2,
  "cooldown": 3,
  "requirements": {
    "weaponTypes": [
      "oneHanded",
      "twoHanded"
    ],
    "minSkillLevel": 1
  },
  "effects": {
    "damage": {
      "type": "physical",
      "multiplier": 2
    }
  },
  "icon": {
    "path": "abilities/ability_slash_1.svg",
    "material": "default"
  }
} as const;
