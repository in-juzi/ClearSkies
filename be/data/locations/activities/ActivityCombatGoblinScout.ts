/**
 * Combat: Goblin Scout
 * Engage in combat with a nimble goblin scout
 */

import { ActivityUnion } from '@shared/types';

export const ActivityCombatGoblinScout: ActivityUnion = {
  "activityId": "combat-goblin-scout",
  "type": "combat",
  "name": "Fight Goblin Scout",
  "description": "Engage in combat with a nimble goblin scout. These quick archers prefer to strike from range and are difficult to catch.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_scout"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
