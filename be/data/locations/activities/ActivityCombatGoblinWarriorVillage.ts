/**
 * Combat: Goblin Warrior (Village)
 * Engage in combat with a fierce goblin warrior at the village
 */

import { ActivityUnion } from '../../../types/locations';

export const ActivityCombatGoblinWarriorVillage: ActivityUnion = {
  "activityId": "combat-goblin-warrior-village",
  "type": "combat",
  "name": "Fight Goblin Warrior",
  "description": "Engage in combat with a fierce goblin warrior. These armored fighters guard the village with reckless abandon.",
  "requirements": {},
  "combatConfig": {
    "monsterId": "goblin_warrior"
  }
} as const;
