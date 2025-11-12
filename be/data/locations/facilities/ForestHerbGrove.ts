/**
 * Hidden Herb Grove
 * A secluded grove deep in the forest where rare herbs flourish in the dappled sunlight. The air is th...
 */

import { Facility } from '../../../types/locations';

export const ForestHerbGrove: Facility = {
  "facilityId": "forest-herb-grove",
  "name": "Hidden Herb Grove",
  "description": "A secluded grove deep in the forest where rare herbs flourish in the dappled sunlight. The air is thick with the scent of medicinal plants.",
  "type": "resource-gathering",
  "icon": "herbalism",
  "activities": [
    "activity-gather-nettle",
    "activity-gather-mandrake"
  ]
} as const;
