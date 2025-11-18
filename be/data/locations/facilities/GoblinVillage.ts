/**
 * Goblin Village
 * A ramshackle settlement of goblins, with crude huts and defensive barriers
 */

import { Facility } from '@shared/types';

export const GoblinVillage: Facility = {
  "facilityId": "goblin-village-main",
  "name": "Goblin Village",
  "description": "A ramshackle settlement of goblins, with crude huts and defensive barriers made from scavenged materials. Smoke rises from cooking fires, and the sound of goblin chatter fills the air.",
  "type": "combat",
  "icon": "combat",
  "activities": [
    "combat-goblin-scout",
    "combat-goblin-warrior-village",
    "combat-goblin-shaman"
  ]
} as const;
