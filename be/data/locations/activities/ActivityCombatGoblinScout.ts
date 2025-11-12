/**
 * Combat: Goblin Scout
 * Engage in combat with a nimble goblin scout
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityCombatGoblinScout: ActivityUnion = {
  "activityId": "combat-goblin-scout",
  "type": "combat",
  "name": "Fight Goblin Scout",
  "description": "Engage in combat with a nimble goblin scout. These quick archers prefer to strike from range and are difficult to catch.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_scout"
  }
} as const;
