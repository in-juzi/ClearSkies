import { Recipe } from '../types';
import { RecipeRegistry } from '../data/recipes/RecipeRegistry';

class RecipeService {
  /**
   * Get all recipes
   */
  getAllRecipes(): Recipe[] {
    return RecipeRegistry.getAll();
  }

  /**
   * Get single recipe by ID
   */
  getRecipe(recipeId: string): Recipe | null {
    return RecipeRegistry.get(recipeId) || null;
  }

  /**
   * Get recipes for a specific skill
   */
  getRecipesBySkill(skillName: string): Recipe[] {
    return RecipeRegistry.getAll().filter(recipe => recipe.skill === skillName);
  }

  /**
   * Validate if player meets recipe requirements
   */
  validateRecipeRequirements(
    player: any,
    recipe: Recipe,
    selectedIngredients: Record<string, string[]> | null = null
  ): { valid: boolean; message: string } {
    // Check skill level
    if (!player.skills[recipe.skill]) {
      return {
        valid: false,
        message: `Skill ${recipe.skill} not found`
      };
    }

    if (player.skills[recipe.skill].level < recipe.requiredLevel) {
      return {
        valid: false,
        message: `Requires ${recipe.skill} level ${recipe.requiredLevel}`
      };
    }

    // Check ingredients
    for (const ingredient of recipe.ingredients) {
      // If specific instances selected, validate those
      if (selectedIngredients && selectedIngredients[ingredient.itemId]) {
        const selectedInstanceIds = selectedIngredients[ingredient.itemId];

        if (selectedInstanceIds.length < ingredient.quantity) {
          return {
            valid: false,
            message: `Please select ${ingredient.quantity}x ${ingredient.itemId} (selected ${selectedInstanceIds.length})`
          };
        }

        // Verify all selected instances exist and are available
        for (const instanceId of selectedInstanceIds) {
          const item = player.getItem(instanceId);
          if (!item) {
            return {
              valid: false,
              message: `Selected ${ingredient.itemId} instance not found`
            };
          }
          if (item.itemId !== ingredient.itemId) {
            return {
              valid: false,
              message: `Invalid instance selected for ${ingredient.itemId}`
            };
          }
          if (item.equipped) {
            return {
              valid: false,
              message: `Cannot use equipped ${ingredient.itemId}`
            };
          }
        }
      } else {
        // No specific selection, check total quantity
        const totalQuantity = player.getInventoryItemQuantity(ingredient.itemId);

        if (totalQuantity < ingredient.quantity) {
          return {
            valid: false,
            message: `Requires ${ingredient.quantity}x ${ingredient.itemId} (have ${totalQuantity})`
          };
        }
      }
    }

    return {
      valid: true,
      message: 'Requirements met'
    };
  }

  /**
   * Calculate crafting outcome based on ingredient quality and player skill
   */
  calculateCraftingOutcome(
    recipe: Recipe,
    ingredientInstances: any[],
    playerSkillLevel: number,
    itemService: any
  ): any[] {
    const outputs = recipe.outputs;
    const outputItems: any[] = [];

    // Collect ingredient qualities and traits once (shared across all outputs)
    const qualityMaps: Map<string, number>[] = [];
    for (const ingredient of ingredientInstances) {
      if (ingredient.qualities && ingredient.qualities.size > 0) {
        qualityMaps.push(ingredient.qualities);
      }
    }

    let bestIngredient: any = null;
    let bestTraitCount = 0;
    if (ingredientInstances.length > 0) {
      bestIngredient = ingredientInstances[0];
      bestTraitCount = bestIngredient.traits ? bestIngredient.traits.size : 0;

      for (const ingredient of ingredientInstances) {
        const traitCount = ingredient.traits ? ingredient.traits.size : 0;
        if (traitCount > bestTraitCount) {
          bestIngredient = ingredient;
          bestTraitCount = traitCount;
        }
      }
    }

    // Process each output
    for (const outputDef of outputs) {
      const output: any = {
        itemId: outputDef.itemId,
        quantity: outputDef.quantity,
        qualities: new Map(),
        traits: new Map()
      };

      // Quality inheritance based on qualityModifier
      if (outputDef.qualityModifier === 'inherit' && ingredientInstances.length > 0) {
        // If we have qualities, inherit the maximum level for each quality type
        if (qualityMaps.length > 0) {
          const allQualityTypes = new Set<string>();
          for (const qualMap of qualityMaps) {
            for (const qualityType of qualMap.keys()) {
              allQualityTypes.add(qualityType);
            }
          }

          // For each quality type, take the max level from ingredients
          for (const qualityType of allQualityTypes) {
            let maxLevel = 0;
            for (const qualMap of qualityMaps) {
              const level = qualMap.get(qualityType) || 0;
              if (level > maxLevel) {
                maxLevel = level;
              }
            }
            if (maxLevel > 0) {
              output.qualities.set(qualityType, maxLevel);
            }
          }
        }

        // Skill bonus: Every 10 skill levels = +1 quality level bonus (max +2)
        const skillBonus = Math.min(2, Math.floor(playerSkillLevel / 10));

        if (skillBonus > 0 && output.qualities.size > 0) {
          // Apply skill bonus to the primary quality (first one)
          const primaryQuality = Array.from(output.qualities.keys())[0];
          const currentLevel = output.qualities.get(primaryQuality)!;
          const newLevel = Math.min(5, currentLevel + skillBonus); // Cap at level 5
          output.qualities.set(primaryQuality, newLevel);
        }

        // Trait inheritance: Inherit traits from best ingredient
        if (bestIngredient && bestIngredient.traits && bestIngredient.traits.size > 0) {
          output.traits = new Map(bestIngredient.traits);
        }
      }

      // Create item instance using itemService
      const itemInstance = itemService.createItemInstance(
        output.itemId,
        output.quantity,
        output.qualities,
        output.traits
      );

      outputItems.push(itemInstance);
    }

    return outputItems;
  }

  /**
   * Reload recipes (for development)
   * Note: With compile-time registries, hot-reload requires server restart
   */
  reload(): { message: string; count: number } {
    return {
      message: 'Recipe definitions are compiled at build time. Restart server to reload.',
      count: RecipeRegistry.size
    };
  }
}

export default new RecipeService();
