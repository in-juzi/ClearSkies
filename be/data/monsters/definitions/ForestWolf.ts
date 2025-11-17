/**
 * Forest Wolf
 * A lean gray wolf that prowls the forest paths. Its keen eyes and sharp fangs make it a dangerous opp...
 */

import { Monster } from '../../../types/combat';

export const ForestWolf: Monster = {
  "monsterId": "forest_wolf",
  "name": "Forest Wolf",
  "description": "A lean gray wolf that prowls the forest paths. Its keen eyes and sharp fangs make it a dangerous opponent for inexperienced travelers.",
  "level": 3,
  "stats": {
    "health": {
      "current": 20,
      "max": 20
    },
    "mana": {
      "current": 20,
      "max": 20
    }
  },
  "attributes": {
    "strength": {
      "level": 2,
      "experience": 0
    },
    "endurance": {
      "level": 2,
      "experience": 0
    },
    "wisdom": {
      "level": 1,
      "experience": 0
    },
    "perception": {
      "level": 4,
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
      "level": 2,
      "experience": 0,
      "mainAttribute": "strength"
    },
    "dualWield": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "twoHanded": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "strength"
    },
    "ranged": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "casting": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "wisdom"
    },
    "protection": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "endurance"
    }
  },
  "equipment": {
    "natural": {
      "name": "Wolf Fangs",
      "damageRoll": "1d1",
      "attackSpeed": 4,
      "critChance": 0.08,
      "skillScalar": "oneHanded"
    }
  },
  "combatStats": {
    "armor": 5,
    "evasion": 15
  },
  "passiveAbilities": [
    {
      "abilityId": "pack_instinct",
      "name": "Pack Instinct",
      "description": "Increased perception and dodge chance",
      "effects": {
        "evasionBonus": 5
      }
    }
  ],
  "lootTables": [
    "combat-wolf-basic"
  ],
  "goldDrop": {
    "min": 5,
    "max": 15
  },
  "experience": 45
} as const;
