import { Quest, QuestCategory, ObjectiveType, ResetInterval } from '@shared/types';

export const HealingHands: Quest = {
  questId: 'tutorial_healing_hands',
  name: 'Healing Hands',
  description: 'Now that you\'ve gathered chamomile, Herbalist Miriam wants to teach you the art of alchemy. Visit the Village Apothecary to craft your first potion.',

  questGiver: {
    npcId: 'herbalist_miriam',
    locationId: 'kennik',
    facilityId: 'herb_garden'
  },

  requirements: {
    quests: ['tutorial_herb_gathering']
  },

  objectives: [
    {
      objectiveId: 'craft_health_tincture',
      type: ObjectiveType.CRAFT,
      description: 'Craft 1 Health Tincture at the Village Apothecary',
      recipeId: 'recipe-health-tincture-1',
      quantity: 1
    }
  ],

  rewards: {
    experience: {
      alchemy: 75
    },
    gold: 50,
    unlocks: {
      quests: ['tutorial_into_the_woods']
    }
  },

  category: QuestCategory.TUTORIAL,
  isRepeatable: false,
  autoAccept: true,

  dialogue: {
    offer: 'Now that you\'ve gathered chamomile, let me teach you the alchemist\'s art. Visit the apothecary and craft your first potion.',
    progress: 'The apothecary has everything you need. Combine your chamomile to create a healing tincture.',
    complete: 'Excellent work! You\'ve taken your first step into the world of alchemy. Many secrets await you.'
  }
};
