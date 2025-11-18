/**
 * Sandy Riverbank
 * A gentle riverbank with deposits of fine sand perfect for glassmaking and construction.
 */

import { Facility } from '../../../types/locations';

export const ForestRiverbank: Facility = {
  "facilityId": "forest-riverbank",
  "name": "Sandy Riverbank",
  "description": "A gentle riverbank with deposits of fine sand perfect for glassmaking and construction.",
  "type": "resource-gathering",
  "icon": "gathering",
  "activities": [
    "activity-gather-sand"
  ]
} as const;
