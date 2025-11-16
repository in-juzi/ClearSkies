/**
 * Mountain Pass
 * A high mountain pass where the air is thin and cold. Rocky outcroppings reveal precious ore veins.
 */

import { Location } from '../../../types/locations';

export const MountainPass: Location = {
  "locationId": "mountain-pass",
  "name": "Mountain Pass",
  "description": "A high mountain pass where the air is thin and cold. Rocky outcroppings reveal precious ore veins.",
  "biome": "mountain",
  "facilities": [
    "mountain-mine",
    "mountain-moonlit-meadow",
    "volcanic-garden",
    "goblin-cave"
  ],
  "navigationLinks": [
    {
      "targetLocationId": "forest-clearing",
      "name": "Forest",
      "description": "Descend back to the forest clearing",
      "travelTime": 12,
      "requirements": {},
      "encounters": []
    }
  ],
  "isStartingLocation": false,
  "mapPosition": {
    "x": 800,
    "y": 150
  }
} as const;
