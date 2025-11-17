/**
 * Optional Quest: Culinary Basics
 *
 * Introduces cooking skill by requiring players to prepare meals.
 * Teaches food crafting and its benefits.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const CulinaryBasics: Quest = {
  questId: 'optional_culinary_basics',
  name: 'Culinary Basics',
  description: 'Chef Marta needs help preparing meals for the village. Cook 5 meals to assist her.',

  questGiver: {
    npcId: 'chef_marta',
    locationId: 'kennik',
    facilityId: 'tavern'
  },

  requirements: {
    quests: ['tutorial_first_catch'], // After fishing tutorial (has fish to cook)
    skills: {
      fishing: 1 // Need at least 1 fishing to have caught fish
    }
  },

  objectives: [
    {
      objectiveId: 'cook_meals',
      type: ObjectiveType.CRAFT,
      description: 'Cook 5 Meals (any food recipe)',
      quantity: 5
      // Note: This will be tracked by counting any cooking recipe completions
    }
  ],

  rewards: {
    experience: {
      cooking: 200,
      will: 100 // 50% of cooking XP
    },
    gold: 100,
    items: [
      { itemId: 'cooked_shrimp', quantity: 10 }, // Cooked food for healing
      { itemId: 'health_draught', quantity: 3 }
    ]
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'Adventurers need to eat well! Let me teach you the basics of cooking. Prepare 5 meals using any recipe you know, and I\'ll share some of my best dishes.',
    progress: 'Food keeps you going when you\'re far from town. Cook well, live well!',
    complete: 'Wonderful! You\'re a natural cook. Take these supplies - you\'ll need food on your adventures.'
  }
};
