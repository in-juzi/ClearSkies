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
