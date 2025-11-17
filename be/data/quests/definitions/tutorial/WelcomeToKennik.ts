import { Quest, QuestCategory, ObjectiveType, ResetInterval } from '@shared/types';

export const WelcomeToKennik: Quest = {
  questId: 'tutorial_welcome',
  name: 'Welcome to Kennik',
  description: 'You\'ve arrived in the fishing village of Kennik. Speak with Dockmaster Halvard at the fishing dock to learn the basics of survival in these lands.',

  questGiver: {
    npcId: 'dockmaster_halvard',
    locationId: 'kennik',
    facilityId: 'fishing_dock'
  },

  requirements: {
    // No requirements - tutorial quest
  },

  objectives: [
    {
      objectiveId: 'visit_fishing_dock',
      type: ObjectiveType.VISIT,
      description: 'Visit the Fishing Dock and speak with Dockmaster Halvard',
      facilityId: 'fishing_dock',
      locationId: 'kennik',
      quantity: 1
    }
  ],

  rewards: {
    gold: 50,
    unlocks: {
      quests: ['tutorial_first_catch']
    }
  },

  category: QuestCategory.TUTORIAL,
  isRepeatable: false,
  autoAccept: true,

  dialogue: {
    offer: 'Welcome to Kennik, stranger! If you\'re going to survive here, you\'ll need to know the basics. Let me show you around.',
    progress: 'Come visit me at the fishing dock when you\'re ready.',
    complete: 'Ah, there you are! Glad you found the dock. Now, let me teach you about fishing...'
  }
};
