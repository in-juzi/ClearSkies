/**
 * Fight Goblin Warrior
 * Face off against a fierce goblin warrior clad in crude armor. These creatures are small but deadly w...
 */

import { ActivityUnion } from '@shared/types';

export const ActivityCombatGoblin: ActivityUnion = {
  "activityId": "activity-combat-goblin",
  "type": "combat",
  "name": "Fight Goblin Warrior",
  "description": "Face off against a fierce goblin warrior clad in crude armor. These creatures are small but deadly when cornered.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_warrior"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
