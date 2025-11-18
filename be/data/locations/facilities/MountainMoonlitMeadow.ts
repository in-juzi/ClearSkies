/**
 * Moonlit Meadow
 * A high mountain meadow bathed in ethereal moonlight. Luminescent flowers bloom here under the stars,...
 */

import { Facility } from '@shared/types';

export const MountainMoonlitMeadow: Facility = {
  "facilityId": "mountain-moonlit-meadow",
  "name": "Moonlit Meadow",
  "description": "A high mountain meadow bathed in ethereal moonlight. Luminescent flowers bloom here under the stars, creating an otherworldly scene.",
  "type": "resource-gathering",
  "icon": "gathering",
  "activities": [
    "activity-gather-moonpetal"
  ]
} as const;
