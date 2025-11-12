/**
 * Village Kitchen
 * A warm communal kitchen where locals gather to prepare meals. The scent of herbs and freshly cooked ...
 */

import { Facility } from '../../../types/locations';

export const KennikKitchen: Facility = {
  "facilityId": "kennik-kitchen",
  "name": "Village Kitchen",
  "description": "A warm communal kitchen where locals gather to prepare meals. The scent of herbs and freshly cooked food fills the air.",
  "type": "crafting",
  "icon": "cooking",
  "craftingSkills": [
    "cooking"
  ],
  "activities": []
} as const;
