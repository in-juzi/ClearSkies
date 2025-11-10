export interface Ingredient {
  itemId: string;
  quantity: number;
}

export interface RecipeOutput {
  itemId: string;
  quantity: number;
  qualityModifier: string; // 'inherit', 'fixed', etc.
}

export interface Recipe {
  recipeId: string;
  name: string;
  description: string;
  skill: string;
  requiredLevel: number;
  duration: number; // seconds
  ingredients: Ingredient[];
  output?: RecipeOutput; // Legacy single output (deprecated)
  outputs?: RecipeOutput[]; // New multi-output schema
  experience: number;
}

export interface ActiveCrafting {
  recipeId: string;
  startTime: Date;
  endTime: Date;
  selectedIngredients?: { [itemId: string]: string[] };
}

export interface CraftingOutputItem {
  itemId: string;
  name?: string; // Display name of the item
  instanceId: string;
  quantity: number;
  qualities?: { [key: string]: number };
  traits?: { [key: string]: number };
}

export interface CraftingResult {
  message: string;
  output?: CraftingOutputItem; // Legacy single output (deprecated)
  outputs?: CraftingOutputItem[]; // New multi-output schema
  experience: {
    skill: string;
    xp: number;
    skillResult: any;
    attributeResult: any;
  };
  recipe: {
    recipeId: string;
    name: string;
  };
}
