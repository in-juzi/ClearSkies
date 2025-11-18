/**
 * Mountain Quarry
 * A rocky excavation site where solid stone blocks are extracted from the mountainside for construction.
 */

import { Facility } from '@shared/types';

export const MountainQuarry: Facility = {
  "facilityId": "mountain-quarry",
  "name": "Mountain Quarry",
  "description": "A rocky excavation site where solid stone blocks are extracted from the mountainside for construction.",
  "type": "resource-gathering",
  "icon": "mining",
  "craftingSkills": [],
  "activities": [
    "activity-quarry-stone"
  ],
  "vendorIds": []
}
