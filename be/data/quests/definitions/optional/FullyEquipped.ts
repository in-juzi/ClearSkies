/**
 * Optional Quest: Fully Equipped
 *
 * Encourages players to fully equip their character.
 * Teaches the importance of equipment and stat bonuses.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const FullyEquipped: Quest = {
  questId: 'optional_fully_equipped',
  name: 'Fully Equipped',
  description: 'A true adventurer is always prepared. Equip items in all 10 equipment slots to maximize your potential.',

  questGiver: {
    npcId: 'merchant_helena',
    locationId: 'kennik',
    facilityId: 'general_store'
  },

  requirements: {
    quests: ['tutorial_into_the_woods'] // After tutorial completion
  },

  objectives: [
    {
      objectiveId: 'equip_all_slots',
      type: ObjectiveType.ACQUIRE, // Generic type - will be tracked via equipment check
      description: 'Equip items in all 10 equipment slots',
      quantity: 10
    }
  ],

  rewards: {
    experience: {
      // Small bonus to all combat skills
      oneHanded: 50,
      dualWield: 50,
      twoHanded: 50,
      ranged: 50,
      casting: 50
    },
    gold: 250,
    items: [
      { itemId: 'health_draught', quantity: 5 },
      { itemId: 'mana_draught', quantity: 5 }
    ]
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'I can tell you\'re serious about adventuring. Fill all your equipment slots - head, body, hands, feet, weapons, accessories - and I\'ll give you supplies for the road.',
    progress: 'Every piece of equipment matters. Check your inventory and the merchants around town.',
    complete: 'Impressive! Now you look like a proper adventurer. These potions should help you on your journey.'
  }
};
