/**
 * Ice Shard
 * Launch a jagged spike of ice that pierces your foe. The cold slows and damages.
 */

import { Ability } from '@shared/types';

export const IceShard: Ability = {
  "abilityId": "ice_shard",
  "name": "Ice Shard",
  "description": "Launch a jagged spike of ice that pierces your foe. The cold slows and damages.",
  "type": "attack",
  "targetType": "single",
  "powerMultiplier": 1.7,
  "manaCost": 15,
  "cooldown": 2,
  "requirements": {
    "weaponTypes": [
      "casting"
    ],
    "minSkillLevel": 1
  },
  "effects": {
    "damage": {
      "type": "magical",
      "multiplier": 1.7
    }
  },
  "icon": {
    "path": "abilities/ice_shard.svg",
    "material": "default"
  }
} as const;
