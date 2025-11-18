/**
 * Volcanic Garden
 * A treacherous garden where rare crimson flowers grow in the heat of volcanic soil. The ground is war...
 */

import { Facility } from '@shared/types';

export const VolcanicGarden: Facility = {
  "facilityId": "volcanic-garden",
  "name": "Volcanic Garden",
  "description": "A treacherous garden where rare crimson flowers grow in the heat of volcanic soil. The ground is warm beneath your feet, and steam rises from cracks in the earth.",
  "type": "resource-gathering",
  "icon": "gathering",
  "activities": [
    "activity-gather-dragons-breath"
  ]
} as const;
