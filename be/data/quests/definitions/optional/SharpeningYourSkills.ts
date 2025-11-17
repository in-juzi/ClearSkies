/**
 * Optional Quest: Sharpening Your Skills
 *
 * Encourages players to reach level 5 in any gathering skill.
 * Rewards exploration of different gathering activities.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const SharpeningYourSkills: Quest = {
  questId: 'optional_sharpening_skills',
  name: 'Sharpening Your Skills',
  description: 'Master the basics of gathering by reaching level 5 in any gathering skill (Woodcutting, Mining, Fishing, or Gathering).',

  questGiver: {
    npcId: 'elder_miriam',
    locationId: 'kennik',
    facilityId: 'town_square'
  },

  requirements: {
    quests: ['tutorial_into_the_woods'] // After tutorial completion
  },

  objectives: [
    {
      objectiveId: 'reach_level_5',
      type: ObjectiveType.GATHER, // Generic type - will be tracked manually
      description: 'Reach level 5 in any gathering skill',
      quantity: 1
    }
  ],

  rewards: {
    experience: {
      // Award XP to all gathering skills
      woodcutting: 100,
      mining: 100,
      fishing: 100,
      gathering: 100
    },
    gold: 150,
    items: [
      { itemId: 'health_draught', quantity: 3 },
      { itemId: 'mana_tincture', quantity: 2 }
    ]
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'I see potential in you, adventurer. Focus on honing your gathering skills - reach level 5 in any of them, and I\'ll reward your dedication.',
    progress: 'Keep practicing! Every master was once a beginner.',
    complete: 'Excellent work! You\'ve proven your dedication to the craft. Take these supplies - you\'ve earned them.'
  }
};
