/**
 * Process Logs into Planks
 * Mill raw logs into sturdy planks suitable for construction projects.
 */

import { Recipe } from '@shared/types';
import { SUBCATEGORY } from '@shared/constants/item-constants';

export const ProcessLogsIntoPlanks: Recipe = {
  "recipeId": "process-logs-into-planks",
  "name": "Process Logs into Planks",
  "description": "Mill raw logs into sturdy planks suitable for construction projects.",
  "skill": "construction",
  "requiredLevel": 1,
  "duration": 6,
  "ingredients": [
    {
      "subcategory": SUBCATEGORY.LOG,
      "quantity": 1
    }
  ],
  "outputs": [
    {
      "itemId": "planks",
      "quantity": 3,
      "qualityModifier": "inherit"
    }
  ],
  "experience": 15
} as const;
