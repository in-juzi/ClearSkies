/**
 * Goblin Village
 * A hostile goblin settlement hidden deep in the wilderness, built from scavenged materials
 */

import { Location } from '../../../types/locations';

export const GoblinVillage: Location = {
  "locationId": "goblin-village",
  "name": "Goblin Village",
  "description": "A hostile goblin settlement hidden deep in the wilderness, built from scavenged materials and crude fortifications. The air is thick with smoke from cooking fires, and the chatter of goblins echoes between ramshackle huts. Scouts patrol the perimeter while warriors train in makeshift arenas, and shamans perform dark rituals in the center of the village.",
  "biome": "forest",
  "facilities": [
    "goblin-village-main"
  ],
  "navigationLinks": [
    {
      "targetLocationId": "forest-clearing",
      "name": "Return to Forest Clearing",
      "description": "Escape back to the safety of the forest clearing",
      "travelTime": 15,
      "requirements": {},
      "encounters": []
    }
  ],
  "isStartingLocation": false
} as const;
