/**
 * Forest Clearing
 * A peaceful clearing in the heart of the woods. Ancient oak trees tower overhead, and the sounds of w...
 */

import { Location } from '../../../types/locations';

export const ForestClearing: Location = {
  "locationId": "forest-clearing",
  "name": "Forest Clearing",
  "description": "A peaceful clearing in the heart of the woods. Ancient oak trees tower overhead, and the sounds of wildlife echo through the branches.",
  "biome": "forest",
  "facilities": [
    "forest-logging-camp",
    "forest-bandit-camp",
    "forest-herb-grove"
  ],
  "navigationLinks": [
    {
      "targetLocationId": "kennik",
      "name": "Return to Kennik",
      "description": "The path back to the fishing village",
      "travelTime": 6,
      "requirements": {},
      "encounters": []
    },
    {
      "targetLocationId": "mountain-pass",
      "name": "Mountain Trail",
      "description": "A steep rocky trail climbing towards the mountains",
      "travelTime": 12,
      "requirements": {
        "attributes": {
          "endurance": 3
        }
      },
      "encounters": []
    },
    {
      "targetLocationId": "goblin-village",
      "name": "Hidden Path",
      "description": "A barely visible trail leading deeper into the forest, marked with crude goblin symbols",
      "travelTime": 10,
      "requirements": {},
      "encounters": []
    }
  ],
  "isStartingLocation": false
} as const;
