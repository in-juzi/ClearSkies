/**
 * Optional Quest: The Alchemist's Apprentice
 *
 * Introduces alchemy crafting through gathering herbs and brewing a potion.
 * Teaches the connection between gathering and crafting skills.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const AlchemistsApprentice: Quest = {
  questId: 'optional_alchemist_apprentice',
  name: 'The Alchemist\'s Apprentice',
  description: 'Alchemist Elara needs chamomile for her potions. Gather 3 chamomile and brew a Health Tincture to prove your worth.',

  questGiver: {
    npcId: 'alchemist_elara',
    locationId: 'kennik',
    facilityId: 'alchemy_shop'
  },

  requirements: {
    quests: ['tutorial_healing_hands'] // After herb gathering tutorial
  },

  objectives: [
    {
      objectiveId: 'gather_chamomile',
      type: ObjectiveType.GATHER,
      description: 'Gather 3 Chamomile',
      itemId: 'chamomile',
      quantity: 3
    },
    {
      objectiveId: 'craft_health_tincture',
      type: ObjectiveType.CRAFT,
      description: 'Brew 1 Health Tincture',
      recipeId: 'recipe_health_tincture',
      quantity: 1
    }
  ],

  rewards: {
    experience: {
      gathering: 75,
      alchemy: 150,
      will: 37 // 50% of gathering, rounded down
    },
    gold: 100,
    items: [
      { itemId: 'health_tincture', quantity: 2 }
    ],
    unlocks: {
      recipes: ['recipe_mana_tincture'] // Unlock mana tincture recipe
    }
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'Ah, a curious one! If you wish to learn alchemy, start simple. Gather chamomile from the meadow and brew a Health Tincture. I\'ll teach you the rest.',
    progress: 'Chamomile has gentle restorative properties. Perfect for your first potion.',
    complete: 'Well done! You have a natural talent for this. Here, take this recipe for Mana Tinctures - you\'ve earned it.'
  }
};
