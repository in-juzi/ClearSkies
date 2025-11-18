/**
 * Village Forge
 * A sturdy stone forge where the rhythmic clang of hammer on anvil echoes through the air. Glowing emb...
 */

import { Facility } from '@shared/types';

export const KennikForge: Facility = {
  "facilityId": "kennik-forge",
  "name": "Village Forge",
  "description": "A sturdy stone forge where the rhythmic clang of hammer on anvil echoes through the air. Glowing embers illuminate racks of tools and bars of cooling metal.",
  "type": "crafting",
  "icon": "smithing",
  "craftingSkills": [
    "smithing"
  ],
  "activities": [],
  "vendorIds": []
} as const;
