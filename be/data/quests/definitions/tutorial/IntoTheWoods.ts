import { Quest, QuestCategory, ObjectiveType, ResetInterval } from '@shared/types';

export const IntoTheWoods: Quest = {
  questId: 'tutorial_into_the_woods',
  name: 'Into the Woods',
  description: 'You\'ve learned the basics of Kennik. The wider world awaits! Travel to the Forest Clearing and meet Woodsman Bjorn to continue your journey.',

  questGiver: {
    npcId: 'herbalist_miriam',
    locationId: 'kennik',
    facilityId: 'herb_garden'
  },

  requirements: {
    quests: ['tutorial_healing_hands']
  },

  objectives: [
    {
      objectiveId: 'discover_forest_clearing',
      type: ObjectiveType.VISIT,
      description: 'Travel to Forest Clearing',
      locationId: 'forest_clearing',
      quantity: 1
    },
    {
      objectiveId: 'visit_logging_camp',
      type: ObjectiveType.VISIT,
      description: 'Visit the Logging Camp and speak with Woodsman Bjorn',
      facilityId: 'logging_camp',
      locationId: 'forest_clearing',
      quantity: 1
    }
  ],

  rewards: {
    gold: 100,
    unlocks: {
      quests: [
        'skill_woodcutting',
        'skill_mining',
        'skill_smithing',
        'skill_combat',
        'explore_goblin_threat',
        'explore_mountain_mine',
        'explore_rare_herbs'
      ]
    }
  },

  category: QuestCategory.TUTORIAL,
  isRepeatable: false,
  autoAccept: true,

  dialogue: {
    offer: 'You\'ve learned the basics of Kennik. The wider world awaits! Travel to Forest Clearing and meet Woodsman Bjorn.',
    progress: 'Follow the forest path from Kennik. Bjorn will be at the logging camp.',
    complete: 'Welcome to the woods, friend! You\'ve proven yourself capable. There\'s much more to discover out here.'
  }
};
