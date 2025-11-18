/**
 * Combat: Goblin Warrior (Village)
 * Engage in combat with a fierce goblin warrior at the village
 */

import { ActivityUnion } from '@shared/types';

export const ActivityCombatGoblinWarriorVillage: ActivityUnion = {
  "activityId": "combat-goblin-warrior-village",
  "type": "combat",
  "name": "Fight Goblin Warrior",
  "description": "Engage in combat with a fierce goblin warrior. These armored fighters guard the village with reckless abandon.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_warrior"
  }
  // Note: XP awarded dynamically based on Monster.experience and equipped weapon's skillScalar
} as const;
