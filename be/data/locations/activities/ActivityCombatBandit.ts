/**
 * Fight Bandit Thug
 * Challenge a dangerous bandit thug who preys on travelers along the road. These brigands show no merc...
 */

import { ActivityUnion } from '@shared/types';

export const ActivityCombatBandit: ActivityUnion = {
  "activityId": "activity-combat-bandit",
  "type": "combat",
  "name": "Fight Bandit Thug",
  "description": "Challenge a dangerous bandit thug who preys on travelers along the road. These brigands show no mercy.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "bandit_thug"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
