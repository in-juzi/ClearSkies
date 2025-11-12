/**
 * Mountain Mine
 * Dark tunnels lead deep into the mountain where rich veins of ore can be found. Copper and tin glimme...
 */

import { Facility } from '../../../types/locations';

export const MountainMine: Facility = {
  "facilityId": "mountain-mine",
  "name": "Mountain Mine",
  "description": "Dark tunnels lead deep into the mountain where rich veins of ore can be found. Copper and tin glimmer in shallow veins, while deeper shafts yield iron.",
  "type": "resource-gathering",
  "icon": "mining",
  "vendorIds": [
    "mountain-mine-merchant"
  ],
  "activities": [
    "activity-mine-copper",
    "activity-mine-tin",
    "activity-mine-iron"
  ]
} as const;
