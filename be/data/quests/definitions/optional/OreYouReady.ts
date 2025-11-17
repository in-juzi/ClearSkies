/**
 * Optional Quest: Ore You Ready?
 *
 * Introduces mining at Mountain Pass location.
 * Requires travel to a new location and gathering ore.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const OreYouReady: Quest = {
  questId: 'optional_ore_you_ready',
  name: 'Ore You Ready?',
  description: 'The blacksmith needs copper ore from the Mountain Pass mines. Travel there and mine 10 copper ore.',

  questGiver: {
    npcId: 'blacksmith_garrick',
    locationId: 'kennik',
    facilityId: 'village_forge'
  },

  requirements: {
    quests: ['tutorial_into_the_woods'] // After tutorial completion
  },

  objectives: [
    {
      objectiveId: 'visit_mountain_pass',
      type: ObjectiveType.VISIT,
      description: 'Discover the Mountain Pass',
      locationId: 'mountain_pass',
      quantity: 1
    },
    {
      objectiveId: 'mine_copper_ore',
      type: ObjectiveType.GATHER,
      description: 'Mine 10 Copper Ore',
      activityId: 'activity-mine-copper',
      itemId: 'copper_ore',
      quantity: 10
    }
  ],

  rewards: {
    experience: {
      mining: 200,
      strength: 100 // 50% of mining XP
    },
    gold: 150,
    items: [
      { itemId: 'bronze_mining_pickaxe', quantity: 1 }, // Better pickaxe reward
      { itemId: 'health_draught', quantity: 2 }
    ]
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'I need copper ore for the forge, but I\'m too busy with orders. Head to the Mountain Pass and mine me 10 copper ore. I\'ll make it worth your while.',
    progress: 'The mines are rich with copper. Keep at it!',
    complete: 'Good work! This ore is exactly what I needed. Here, take this pickaxe - it\'ll serve you better than that old thing.'
  }
};
