/**
 * Kennik
 * A small fishing village on this nameless island. Over time, it also became a paltry port for the sai...
 */

import { Location } from '../../../types/locations';

export const Kennik: Location = {
  "locationId": "kennik",
  "name": "Kennik",
  "description": "A small fishing village on this nameless island. Over time, it also became a paltry port for the sailors coming from the mainland.",
  "biome": "sea",
  "facilities": [
    "kennik-bank",
    "kennik-fishing-dock",
    "kennik-market",
    "kennik-herb-garden",
    "kennik-kitchen",
    "kennik-forge",
    "village-apothecary"
  ],
  "navigationLinks": [
    {
      "targetLocationId": "forest-clearing",
      "name": "Forest Path",
      "description": "A worn dirt path leading into the dense forest",
      "travelTime": 6,
      "requirements": {},
      "encounters": []
    }
  ],
  "isStartingLocation": true,
  "mapPosition": {
    "x": 800,
    "y": 150
  }
} as const;
