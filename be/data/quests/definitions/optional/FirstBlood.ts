/**
 * Optional Quest: First Blood
 *
 * Introduces combat by requiring players to defeat goblins.
 * Teaches the combat system and rewards combat progression.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const FirstBlood: Quest = {
  questId: 'optional_first_blood',
  name: 'First Blood',
  description: 'Goblins have been spotted near the village. Defeat 3 goblins to prove your combat prowess.',

  questGiver: {
    npcId: 'guard_captain_thorne',
    locationId: 'kennik',
    facilityId: 'town_square'
  },

  requirements: {
    quests: ['tutorial_into_the_woods'], // After tutorial completion
    skills: {
      // Recommended to have some combat skill, but not required
    }
  },

  objectives: [
    {
      objectiveId: 'visit_goblin_village',
      type: ObjectiveType.VISIT,
      description: 'Discover the Goblin Village',
      locationId: 'goblin_village',
      quantity: 1
    },
    {
      objectiveId: 'defeat_goblins',
      type: ObjectiveType.COMBAT,
      description: 'Defeat 3 Goblins',
      monsterId: 'goblin_scout',
      quantity: 3
    }
  ],

  rewards: {
    experience: {
      oneHanded: 150, // Combat XP
      strength: 75,   // Linked attribute
      endurance: 50   // Secondary attribute bonus
    },
    gold: 200,
    items: [
      { itemId: 'iron_sword', quantity: 1 },
      { itemId: 'health_draught', quantity: 5 }
    ]
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'The goblins are getting bolder. We need someone to show them we won\'t be pushed around. Defeat a few of them, and I\'ll see you\'re properly equipped.',
    progress: 'Watch your health in combat - those goblins are scrappy fighters!',
    complete: 'Well fought! You\'ve proven yourself in battle. Take this sword - you\'ve earned it, warrior.'
  }
};
