/**
 * Enchanter's Table
 * A candlelit table ringed with chalk sigils and jars of crystallized essence,
 * where mana is coaxed into a gemstone vessel and bound as a socketable sigil.
 * The in-browser home of the enchanting skill. See project/ideas/enchanting.md.
 */

import { Facility } from '@shared/types';

export const KennikEnchantersTable: Facility = {
  "facilityId": "kennik-enchanters-table",
  "name": "Enchanter's Table",
  "description": "A candlelit table ringed with chalk sigils and jars of crystallized essence. Here mana is bound into a gemstone vessel, capturing a monster's nature as a sigil.",
  "type": "crafting",
  "icon": "enchanting",
  "craftingSkills": [
    "enchanting"
  ],
  "activities": []
} as const;
