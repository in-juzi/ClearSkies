/**
 * Goblin Cave
 * A dark cave carved into the mountainside, home to aggressive goblin warriors. The sound of crude wea...
 */

import { Facility } from '@shared/types';

export const GoblinCave: Facility = {
  "facilityId": "goblin-cave",
  "name": "Goblin Cave",
  "description": "A dark cave carved into the mountainside, home to aggressive goblin warriors. The sound of crude weapons being sharpened echoes from within.",
  "type": "combat",
  "icon": "combat",
  "activities": [
    "activity-combat-goblin"
  ]
} as const;
