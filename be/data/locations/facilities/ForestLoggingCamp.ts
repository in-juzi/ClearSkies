/**
 * Logging Camp
 * A clearing filled with tree stumps and the sound of axes striking wood.
 */

import { Facility } from '@shared/types';

export const ForestLoggingCamp: Facility = {
  "facilityId": "forest-logging-camp",
  "name": "Logging Camp",
  "description": "A clearing filled with tree stumps and the sound of axes striking wood.",
  "type": "resource-gathering",
  "icon": "woodcutting",
  "vendorIds": [
    "forest-clearing-merchant"
  ],
  "activities": [
    "activity-chop-pine",
    "activity-chop-oak",
    "activity-chop-birch"
  ]
} as const;
