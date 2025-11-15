/**
 * Goblin Shaman
 * A mystical goblin adorned with bone fetishes and painted symbols. These cunning spellcasters wield...
 */

import { Monster } from '../../../types/combat';

export const GoblinShaman: Monster = {
  "monsterId": "goblin_shaman",
  "name": "Goblin Shaman",
  "description": "A mystical goblin adorned with bone fetishes and painted symbols. These cunning spellcasters wield dark magic learned from ancient spirits, making them formidable foes despite their frail appearance.",
  "level": 8,
  "stats": {
    "health": {
      "current": 110,
      "max": 110
    },
    "mana": {
      "current": 80,
      "max": 80
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
    "wisdom": {
      "level": 8,
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
      "level": 7,
      "experience": 0
    },
    "charisma": {
      "level": 4,
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
      "level": 2,
      "experience": 0,
      "mainAttribute": "dexterity"
    },
    "casting": {
      "level": 8,
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
      "name": "Bone Staff",
      "damageRoll": "1d8",
      "attackSpeed": 3.5,
      "critChance": 0.06,
      "skillScalar": "casting"
    },
    "armor": {
      "name": "Ritual Robes",
      "armor": 15,
      "evasion": 5
    }
  },
  "combatStats": {
    "armor": 15,
    "evasion": 5
  },
  "passiveAbilities": [
    {
      "abilityId": "dark_blessing",
      "name": "Dark Blessing",
      "description": "Infused with dark magic, spell damage is enhanced",
      "effects": {
        "magicDamageBonus": 0.20
      }
    },
    {
      "abilityId": "spirit_ward",
      "name": "Spirit Ward",
      "description": "Protected by ancestral spirits, reducing incoming damage",
      "effects": {
        "damageReduction": 0.10
      }
    },
    {
      "abilityId": "mana_font",
      "name": "Mana Font",
      "description": "Deep connection to magical energies provides extra mana",
      "effects": {
        "manaBonus": 20
      }
    }
  ],
  "lootTables": [
    "combat-goblin-shaman"
  ],
  "goldDrop": {
    "min": 30,
    "max": 65
  },
  "experience": 120
} as const;
