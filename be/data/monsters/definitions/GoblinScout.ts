/**
 * Goblin Scout
 * A nimble goblin archer that prefers to strike from afar with crude arrows. Scouts are the eyes and...
 */

import { Monster } from '../../../types/combat';

export const GoblinScout: Monster = {
  "monsterId": "goblin_scout",
  "name": "Goblin Scout",
  "description": "A nimble goblin archer that prefers to strike from afar with crude arrows. Scouts are the eyes and ears of goblin tribes, quick to flee but deadly at range.",
  "level": 5,
  "stats": {
    "health": {
      "current": 90,
      "max": 90
    },
    "mana": {
      "current": 15,
      "max": 15
    }
  },
  "attributes": {
    "strength": {
      "level": 2,
      "experience": 0
    },
    "endurance": {
      "level": 3,
      "experience": 0
    },
    "magic": {
      "level": 1,
      "experience": 0
    },
    "perception": {
      "level": 5,
      "experience": 0
    },
    "dexterity": {
      "level": 6,
      "experience": 0
    },
    "will": {
      "level": 2,
      "experience": 0
    },
    "charisma": {
      "level": 1,
      "experience": 0
    }
  },
  "skills": {
    "oneHanded": {
      "level": 2,
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
      "level": 6,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "casting": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "magic"
    },
    "gun": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "perception"
    }
  },
  "equipment": {
    "weapon": {
      "name": "Crude Bow",
      "damageRoll": "1d6",
      "attackSpeed": 2.5,
      "critChance": 0.08,
      "skillScalar": "ranged"
    },
    "armor": {
      "name": "Leather Scraps",
      "armor": 10,
      "evasion": 8
    }
  },
  "combatStats": {
    "armor": 10,
    "evasion": 8
  },
  "passiveAbilities": [
    {
      "abilityId": "keen_eye",
      "name": "Keen Eye",
      "description": "Years of scouting grant improved accuracy",
      "effects": {
        "critChanceBonus": 0.05
      }
    },
    {
      "abilityId": "nimble_dodger",
      "name": "Nimble Dodger",
      "description": "Quick reflexes make this goblin hard to hit",
      "effects": {
        "evasionBonus": 5
      }
    }
  ],
  "lootTables": [
    "combat-goblin-scout"
  ],
  "goldDrop": {
    "min": 15,
    "max": 35
  },
  "experience": 75
} as const;
