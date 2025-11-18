/**
 * Village Apothecary
 * A cozy shop filled with drying herbs and bubbling alembics. The village alchemist practices the ancient art of potion-making here.
 */

import { Facility } from '@shared/types';

export const VillageApothecary: Facility = {
  "facilityId": "village-apothecary",
  "name": "Village Apothecary",
  "description": "A cozy shop filled with drying herbs and bubbling alembics. The village alchemist practices the ancient art of potion-making here, transforming simple herbs into powerful remedies.",
  "type": "crafting",
  "icon": "alchemy",
  "craftingSkills": ["alchemy"],
  "vendorIds": [],
  "activities": []
} as const;
