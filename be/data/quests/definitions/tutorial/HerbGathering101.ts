import { Quest, QuestCategory, ObjectiveType, ResetInterval } from '@shared/types';

export const HerbGathering101: Quest = {
  questId: 'tutorial_herb_gathering',
  name: 'Herb Gathering 101',
  description: 'Herbalist Miriam tends the village herb garden. Visit her to learn about gathering medicinal plants.',

  questGiver: {
    npcId: 'herbalist_miriam',
    locationId: 'kennik',
    facilityId: 'herb_garden'
  },

  requirements: {
    quests: ['tutorial_first_catch']
  },

  objectives: [
    {
      objectiveId: 'visit_herb_garden',
      type: ObjectiveType.VISIT,
      description: 'Visit the Herb Garden and speak with Herbalist Miriam',
      facilityId: 'herb_garden',
      locationId: 'kennik',
      quantity: 1
    },
    {
      objectiveId: 'gather_chamomile',
      type: ObjectiveType.GATHER,
      description: 'Gather 5 Chamomile at the Herb Garden',
      activityId: 'activity-gather-chamomile',
      itemId: 'chamomile',
      quantity: 5
    }
  ],

  rewards: {
    experience: {
      gathering: 50,
      will: 50
    },
    items: [
      { itemId: 'health_tincture', quantity: 1 }
    ],
    unlocks: {
      quests: ['tutorial_healing_hands']
    }
  },

  category: QuestCategory.TUTORIAL,
  isRepeatable: false,
  autoAccept: true,

  dialogue: {
    offer: 'Ah, a new face! Would you like to learn about the healing herbs that grow in our garden?',
    progress: 'Chamomile is gentle and restorative. Perfect for beginners.',
    complete: 'You have a gentle touch with plants. This will serve you well in your journeys.'
  }
};
