/**
 * Bandit Camp
 * A dangerous encampment where bandits have taken residence. Approach with caution.
 */

import { Facility } from '../../../types/locations';

export const ForestBanditCamp: Facility = {
  "facilityId": "forest-bandit-camp",
  "name": "Bandit Camp",
  "description": "A dangerous encampment where bandits have taken residence. Approach with caution.",
  "type": "combat",
  "icon": "combat",
  "activities": [
    "activity-combat-forest-wolf",
    "activity-combat-bandit"
  ]
} as const;
