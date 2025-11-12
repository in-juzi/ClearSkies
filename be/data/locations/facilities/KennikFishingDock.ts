/**
 * Fishing Dock
 * Weathered wooden docks extend into the harbor. Fishermen mend their nets and prepare their lines.
 */

import { Facility } from '../../../types/locations';

export const KennikFishingDock: Facility = {
  "facilityId": "kennik-fishing-dock",
  "name": "Fishing Dock",
  "description": "Weathered wooden docks extend into the harbor. Fishermen mend their nets and prepare their lines.",
  "type": "resource-gathering",
  "icon": "fishing",
  "vendorIds": [
    "kennik-dock-merchant"
  ],
  "activities": [
    "activity-fish-shrimp",
    "activity-fish-cod",
    "activity-fish-salmon"
  ]
} as const;
