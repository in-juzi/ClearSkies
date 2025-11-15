/**
 * Bandit Thug
 * A rough-looking brigand wielding a rusty blade. These outlaws prey on travelers along the roads, see...
 */

import { Monster } from '../../../types/combat';

export const BanditThug: Monster = {
  "monsterId": "bandit_thug",
  "name": "Bandit Thug",
  "description": "A rough-looking brigand wielding a rusty blade. These outlaws prey on travelers along the roads, seeking easy coin through violence and intimidation.",
  "level": 5,
  "stats": {
    "health": {
      "current": 75,
      "max": 75
    },
    "mana": {
      "current": 30,
      "max": 30
    }
  },
  "attributes": {
    "strength": {
      "level": 4,
      "experience": 0
    },
    "endurance": {
      "level": 3,
      "experience": 0
    },
    "wisdom": {
      "level": 1,
      "experience": 0
    },
    "perception": {
      "level": 2,
      "experience": 0
    },
    "dexterity": {
      "level": 3,
      "experience": 0
    },
    "will": {
      "level": 1,
      "experience": 0
    },
    "charisma": {
      "level": 1,
      "experience": 0
    }
  },
  "skills": {
    "oneHanded": {
      "level": 4,
      "experience": 0,
      "mainAttribute": "strength"
    },
    "dualWield": {
      "level": 2,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "twoHanded": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "strength"
    },
    "ranged": {
      "level": 2,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "casting": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "wisdom"
    },
    "gun": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "perception"
    }
  },
  "equipment": {
    "weapon": {
      "name": "Rusty Sword",
      "damageRoll": "1d3",
      "attackSpeed": 2.6,
      "critChance": 0.05,
      "skillScalar": "oneHanded"
    },
    "armor": {
      "name": "Tattered Leather",
      "armor": 12,
      "evasion": 8
    }
  },
  "combatStats": {
    "armor": 12,
    "evasion": 8
  },
  "passiveAbilities": [
    {
      "abilityId": "dirty_fighter",
      "name": "Dirty Fighter",
      "description": "Increased critical strike chance from underhanded tactics",
      "effects": {
        "critChanceBonus": 0.03
      }
    }
  ],
  "lootTables": [
    "combat-bandit-basic"
  ],
  "goldDrop": {
    "min": 15,
    "max": 35
  },
  "experience": 75
} as const;
