/**
 * Fight Forest Wolf
 * Engage in combat with a lone forest wolf that prowls the clearing. Test your combat skills against a...
 */

import { ActivityUnion } from '@shared/types';

export const ActivityCombatForestWolf: ActivityUnion = {
  "activityId": "activity-combat-forest-wolf",
  "type": "combat",
  "name": "Fight Forest Wolf",
  "description": "Engage in combat with a lone forest wolf that prowls the clearing. Test your combat skills against a cunning predator.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "forest_wolf"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
