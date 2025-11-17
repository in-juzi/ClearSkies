import { Quest, QuestCategory, ObjectiveType, ResetInterval } from '@shared/types';

export const FirstCatch: Quest = {
  questId: 'tutorial_first_catch',
  name: 'First Catch',
  description: 'Dockmaster Halvard has given you a fishing rod. Use it to catch 5 shrimp at the fishing dock.',

  questGiver: {
    npcId: 'dockmaster_halvard',
    locationId: 'kennik',
    facilityId: 'fishing_dock'
  },

  requirements: {
    quests: ['tutorial_welcome']
  },

  objectives: [
    {
      objectiveId: 'acquire_fishing_rod',
      type: ObjectiveType.ACQUIRE,
      description: 'Acquire a Bamboo Fishing Rod',
      itemId: 'bamboo_fishing_rod',
      quantity: 1
    },
    {
      objectiveId: 'catch_shrimp',
      type: ObjectiveType.GATHER,
      description: 'Catch 5 shrimp at the Fishing Dock',
      activityId: 'activity-fish-shrimp',
      itemId: 'shrimp',
      quantity: 5
    }
  ],

  rewards: {
    experience: {
      fishing: 50,
      endurance: 25
    },
    items: [
      { itemId: 'bamboo_fishing_rod', quantity: 1 }, // Free fishing rod reward!
      { itemId: 'health_tincture', quantity: 2 }
    ],
    unlocks: {
      quests: ['tutorial_herb_gathering']
    }
  },

  category: QuestCategory.TUTORIAL,
  isRepeatable: false,
  autoAccept: true,

  dialogue: {
    offer: 'Take this fishing rod - Kennik provides for newcomers. Catch a few shrimp and you\'ll get the hang of it.',
    progress: 'Keep fishing! You\'re doing great.',
    complete: 'Well done! You\'re a natural. Here, take these potions - you\'ll need them out there.'
  }
};
