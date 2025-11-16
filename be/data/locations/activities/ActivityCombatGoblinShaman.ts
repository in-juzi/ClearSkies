/**
 * Combat: Goblin Shaman
 * Engage in combat with a mystical goblin shaman
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityCombatGoblinShaman: ActivityUnion = {
  "activityId": "combat-goblin-shaman",
  "type": "combat",
  "name": "Fight Goblin Shaman",
  "description": "Engage in combat with a mystical goblin shaman. These cunning spellcasters wield dark magic and ancestral spirits in battle.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_shaman"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
