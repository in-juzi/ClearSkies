/**
 * Optional Quest: Tool Time
 *
 * Introduces smithing by requiring players to craft equipment.
 * Teaches ore smelting and tool crafting mechanics.
 */

import { Quest, QuestCategory, ObjectiveType } from '@shared/types';

export const ToolTime: Quest = {
  questId: 'optional_tool_time',
  name: 'Tool Time',
  description: 'Learn the art of smithing by crafting a Bronze Mining Pickaxe at the Village Forge.',

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
      objectiveId: 'gather_copper_ore',
      type: ObjectiveType.ACQUIRE,
      description: 'Acquire 3 Copper Ore',
      itemId: 'copper_ore',
      quantity: 3
    },
    {
      objectiveId: 'gather_tin_ore',
      type: ObjectiveType.ACQUIRE,
      description: 'Acquire 1 Tin Ore',
      itemId: 'tin_ore',
      quantity: 1
    },
    {
      objectiveId: 'smelt_bronze_ingot',
      type: ObjectiveType.CRAFT,
      description: 'Smelt 1 Bronze Ingot',
      recipeId: 'recipe_bronze_ingot',
      quantity: 1
    },
    {
      objectiveId: 'craft_pickaxe',
      type: ObjectiveType.CRAFT,
      description: 'Craft 1 Bronze Mining Pickaxe',
      recipeId: 'recipe_bronze_mining_pickaxe',
      quantity: 1
    }
  ],

  rewards: {
    experience: {
      smithing: 250,
      endurance: 125 // 50% of smithing XP
    },
    gold: 150,
    items: [
      { itemId: 'bronze_ingot', quantity: 2 } // Extra ingots for future crafting
    ],
    unlocks: {
      recipes: ['recipe_bronze_woodcutting_axe'] // Unlock axe recipe
    }
  },

  category: QuestCategory.OPTIONAL,
  isRepeatable: false,
  autoAccept: false,

  dialogue: {
    offer: 'Want to learn smithing? Start with the basics. Gather copper and tin, smelt bronze, and craft yourself a proper pickaxe. I\'ll show you the ropes.',
    progress: 'Bronze is an alloy of copper and tin. Heat it right, and it\'ll serve you well.',
    complete: 'Fine work! You\'ve got the touch of a smith. Here\'s a recipe for a bronze axe - put those skills to use.'
  }
};
