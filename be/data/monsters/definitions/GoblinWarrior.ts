/**
 * Goblin Warrior
 * A small but fierce goblin clad in crude metal armor. What these creatures lack in size, they make up...
 */

import { Monster } from '../../../types/combat';

export const GoblinWarrior: Monster = {
  "monsterId": "goblin_warrior",
  "name": "Goblin Warrior",
  "description": "A small but fierce goblin clad in crude metal armor. What these creatures lack in size, they make up for in ferocity and cunning, fighting with reckless abandon.",
  "level": 7,
  "stats": {
    "health": {
      "current": 140,
      "max": 140
    },
    "mana": {
      "current": 25,
      "max": 25
    }
  },
  "attributes": {
    "strength": {
      "level": 5,
      "experience": 0
    },
    "endurance": {
      "level": 5,
      "experience": 0
    },
    "wisdom": {
      "level": 1,
      "experience": 0
    },
    "perception": {
      "level": 3,
      "experience": 0
    },
    "dexterity": {
      "level": 2,
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
      "level": 5,
      "experience": 0,
      "mainAttribute": "strength"
    },
    "dualWield": {
      "level": 3,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "twoHanded": {
      "level": 2,
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
    "gun": {
      "level": 1,
      "experience": 0,
      "mainAttribute": "perception"
    }
  },
  "equipment": {
    "weapon": {
      "name": "Crude Axe",
      "damageRoll": "1d6",
      "attackSpeed": 3,
      "critChance": 0.04,
      "skillScalar": "oneHanded"
    },
    "armor": {
      "name": "Scrap Metal Armor",
      "armor": 25,
      "evasion": 3
    }
  },
  "combatStats": {
    "armor": 25,
    "evasion": 3
  },
  "passiveAbilities": [
    {
      "abilityId": "armored_hide",
      "name": "Armored Hide",
      "description": "Thick armor provides excellent damage reduction",
      "effects": {
        "armorBonus": 10
      }
    },
    {
      "abilityId": "battle_frenzy",
      "name": "Battle Frenzy",
      "description": "Becomes more dangerous when wounded",
      "effects": {
        "damageBonus": 0.15,
        "trigger": "below_50_percent_hp"
      }
    }
  ],
  "lootTables": [
    "combat-goblin-basic"
  ],
  "goldDrop": {
    "min": 25,
    "max": 50
  },
  "experience": 100
} as const;
