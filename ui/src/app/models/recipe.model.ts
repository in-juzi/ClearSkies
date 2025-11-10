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
  output: RecipeOutput;
  experience: number;
}

export interface ActiveCrafting {
  recipeId: string;
  startTime: Date;
  endTime: Date;
}

export interface CraftingResult {
  message: string;
  output: any; // ItemInstance
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
