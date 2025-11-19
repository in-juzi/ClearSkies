/**
 * Village Sawmill
 * A weathered timber structure where logs are processed into planks. The whir of saw blades and scent of fresh-cut wood fill the air.
 */

import { Facility } from '@shared/types';

export const KennikSawmill: Facility = {
  "facilityId": "kennik-sawmill",
  "name": "Village Sawmill",
  "description": "A weathered timber structure where logs are processed into planks. The whir of saw blades and scent of fresh-cut wood fill the air.",
  "type": "crafting",
  "icon": "construction",
  "craftingSkills": ["construction"],
  "activities": [
    "activity-sawmill"
  ],
  "vendorIds": []
};
