/**
 * Jeweler's Bench
 * A cramped corner bench strewn with files, gravers, and a jeweler's loupe — the
 * fine, patient counterpart to the forge. Here rough gems are faceted into clean
 * vessels and soft metal is drawn into rings and pendants. The in-browser home of
 * the jewelcrafting skill. See project/ideas/jewelcrafting.md.
 */

import { Facility } from '@shared/types';

export const KennikJewelersBench: Facility = {
  "facilityId": "kennik-jewelers-bench",
  "name": "Jeweler's Bench",
  "description": "A cramped bench crowded with files, gravers, and a loupe. Fine, patient work — cutting gems and shaping precious metal into rings and pendants.",
  "type": "crafting",
  "icon": "jewelcrafting",
  "craftingSkills": [
    "jewelcrafting"
  ],
  "activities": []
} as const;
