/**
 * Herb Garden
 * A peaceful garden filled with medicinal plants and fragrant herbs. Local healers tend to the plots, ...
 */

import { Facility } from '@shared/types';

export const KennikHerbGarden: Facility = {
  "facilityId": "kennik-herb-garden",
  "name": "Herb Garden",
  "description": "A peaceful garden filled with medicinal plants and fragrant herbs. Local healers tend to the plots, sharing their knowledge with aspiring gatherers.",
  "type": "resource-gathering",
  "icon": "gathering",
  "vendorIds": [
    "kennik-herb-garden-merchant"
  ],
  "activities": [
    "activity-gather-chamomile",
    "activity-gather-sage"
  ]
} as const;
