import { Recipe } from '@shared/types';
import { RecipeRegistry } from '../data/recipes/RecipeRegistry';
import itemService from './itemService';
import effectEvaluator from './effectEvaluator';

class RecipeService {
  private itemService = itemService;
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

    // Check ingredients (supports both specific itemId and subcategory matching)
    for (const ingredient of recipe.ingredients) {
      // Determine lookup key: itemId for specific, subcategory for flexible
      const lookupKey = ingredient.itemId || ingredient.subcategory;
      if (!lookupKey) {
        return {
          valid: false,
          message: 'Invalid recipe: ingredient must have itemId or subcategory'
        };
      }

      // If specific instances selected, validate those
      if (selectedIngredients && selectedIngredients[lookupKey]) {
        const selectedInstanceIds = selectedIngredients[lookupKey];

        if (selectedInstanceIds.length < ingredient.quantity) {
          const displayName = ingredient.itemId || `any ${ingredient.subcategory}`;
          return {
            valid: false,
            message: `Please select ${ingredient.quantity}x ${displayName} (selected ${selectedInstanceIds.length})`
          };
        }

        // Verify all selected instances exist and are available
        for (const instanceId of selectedInstanceIds) {
          const item = player.getItem(instanceId);
          if (!item) {
            return {
              valid: false,
              message: `Selected instance not found`
            };
          }

          // For itemId: exact match. For subcategory: check if item has that subcategory
          if (ingredient.itemId) {
            if (item.itemId !== ingredient.itemId) {
              return {
                valid: false,
                message: `Invalid instance selected for ${ingredient.itemId}`
              };
            }
          } else if (ingredient.subcategory) {
            const itemDef = this.itemService.getItemDefinition(item.itemId);
            if (!itemDef || !itemDef.subcategories?.includes(ingredient.subcategory)) {
              return {
                valid: false,
                message: `Selected item does not match subcategory: ${ingredient.subcategory}`
              };
            }
          }

          if (item.equipped) {
            return {
              valid: false,
              message: `Cannot use equipped items`
            };
          }
        }
      } else {
        // No specific selection, check total quantity available
        let totalQuantity = 0;

        if (ingredient.itemId) {
          // Specific item: use existing method
          totalQuantity = player.getInventoryItemQuantity(ingredient.itemId);
        } else if (ingredient.subcategory) {
          // Subcategory: count all items matching subcategory
          for (const item of player.inventory) {
            if (!item.equipped) {
              const itemDef = this.itemService.getItemDefinition(item.itemId);
              if (itemDef && itemDef.subcategories?.includes(ingredient.subcategory)) {
                totalQuantity += item.quantity || 1;
              }
            }
          }
        }

        if (totalQuantity < ingredient.quantity) {
          const displayName = ingredient.itemId || `any ${ingredient.subcategory}`;
          return {
            valid: false,
            message: `Requires ${ingredient.quantity}x ${displayName} (have ${totalQuantity})`
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
   * Check which recipes the player should have unlocked
   * Returns array of newly unlocked recipe IDs
   */
  checkRecipeUnlocks(player: any): string[] {
    const allRecipes = this.getAllRecipes();
    const newlyUnlocked: string[] = [];

    for (const recipe of allRecipes) {
      // Skip if already unlocked
      if (player.unlockedRecipes && player.unlockedRecipes.includes(recipe.recipeId)) {
        continue;
      }

      // No unlock conditions means unlocked by default (backward compatibility)
      if (!recipe.unlockConditions || recipe.unlockConditions.discoveredByDefault !== false) {
        newlyUnlocked.push(recipe.recipeId);
        continue;
      }

      let shouldUnlock = false;

      // Check required recipes (must have crafted these recipes)
      if (recipe.unlockConditions.requiredRecipes && recipe.unlockConditions.requiredRecipes.length > 0) {
        const allRequiredCrafted = recipe.unlockConditions.requiredRecipes.every(
          reqRecipeId => player.unlockedRecipes && player.unlockedRecipes.includes(reqRecipeId)
        );
        if (allRequiredCrafted) {
          shouldUnlock = true;
        }
      }

      // Check required items (must have in inventory)
      if (recipe.unlockConditions.requiredItems && recipe.unlockConditions.requiredItems.length > 0) {
        const allRequiredOwned = recipe.unlockConditions.requiredItems.every(
          itemId => player.hasInventoryItem && player.hasInventoryItem(itemId, 1)
        );
        if (allRequiredOwned) {
          shouldUnlock = true;
        }
      }

      // Future: quest completion checks can be added here
      // if (recipe.unlockConditions.questRequired) { ... }

      if (shouldUnlock) {
        newlyUnlocked.push(recipe.recipeId);
      }
    }

    return newlyUnlocked;
  }

  /**
   * Check if a specific recipe is unlocked for the player
   */
  isRecipeUnlocked(player: any, recipeId: string): boolean {
    const recipe = this.getRecipe(recipeId);
    if (!recipe) return false;

    // No unlock conditions means unlocked by default
    if (!recipe.unlockConditions || recipe.unlockConditions.discoveredByDefault !== false) {
      return true;
    }

    // Check if player has unlocked this recipe
    return player.unlockedRecipes && player.unlockedRecipes.includes(recipeId);
  }

  /**
   * Calculate crafting outcome based on ingredient quality and player skill
   * Now integrates effect system for quality bonuses and yield multipliers
   */
  calculateCraftingOutcome(
    recipe: Recipe,
    ingredientInstances: any[],
    playerSkillLevel: number,
    itemService: any,
    player?: any
  ): any[] {
    const outputs = recipe.outputs;
    const outputItems: any[] = [];

    // Collect ingredient qualities and traits once (shared across all outputs)
    const qualityMaps: Map<string, number>[] = [];
    const traitMaps: Map<string, number>[] = [];
    for (const ingredient of ingredientInstances) {
      if (ingredient.qualities && ingredient.qualities.size > 0) {
        qualityMaps.push(ingredient.qualities);
      }
      if (ingredient.traits && ingredient.traits.size > 0) {
        traitMaps.push(ingredient.traits);
      }
    }

    // Process each output
    for (const outputDef of outputs) {
      // Calculate base quantity
      let finalQuantity = outputDef.quantity;

      // Apply yield multiplier from effect system (equipped tools with traits)
      if (player) {
        const yieldEffects = effectEvaluator.getCraftingYieldMultiplier(
          player,
          recipe.skill,
          recipe
        );

        // Apply yield modifiers
        finalQuantity = Math.floor(
          effectEvaluator.calculateFinalValue(finalQuantity, {
            flatBonus: yieldEffects.flat,
            percentageBonus: yieldEffects.percentage,
            multiplier: yieldEffects.multiplier,
            appliedEffects: [],
            skippedEffects: []
          })
        );

        // Ensure at least 1 item
        finalQuantity = Math.max(1, finalQuantity);
      }

      const output: any = {
        itemId: outputDef.itemId,
        quantity: finalQuantity,
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

        // Skill bonus: Base bonus (every 10 skill levels = +1, max +2)
        let totalQualityBonus = Math.min(2, Math.floor(playerSkillLevel / 10));

        // Add effect system quality bonuses (traits/qualities on equipped tools)
        if (player) {
          const qualityEffects = effectEvaluator.getCraftingQualityBonus(
            player,
            recipe.skill,
            recipe
          );

          // Add flat bonus from effects (e.g., Masterwork trait could add +1)
          totalQualityBonus += Math.floor(qualityEffects.flat);

          // Apply percentage modifier if any (e.g., +50% quality bonus)
          if (qualityEffects.percentage !== 0) {
            totalQualityBonus = Math.floor(totalQualityBonus * (1 + qualityEffects.percentage));
          }

          // Apply multiplier if any
          totalQualityBonus = Math.floor(totalQualityBonus * qualityEffects.multiplier);
        }

        if (totalQualityBonus > 0 && output.qualities.size > 0) {
          // Apply total quality bonus to the primary quality (first one)
          const primaryQuality = Array.from(output.qualities.keys())[0];
          const currentLevel = output.qualities.get(primaryQuality)!;
          const newLevel = Math.min(5, currentLevel + totalQualityBonus); // Cap at level 5
          output.qualities.set(primaryQuality, newLevel);
        }

        // Trait inheritance: Combine all traits from all ingredients, taking max level
        if (traitMaps.length > 0) {
          const allTraitTypes = new Set<string>();
          for (const traitMap of traitMaps) {
            for (const traitType of traitMap.keys()) {
              allTraitTypes.add(traitType);
            }
          }

          // For each trait type, take the max level from ingredients
          for (const traitType of allTraitTypes) {
            let maxLevel = 0;
            for (const traitMap of traitMaps) {
              const level = traitMap.get(traitType) || 0;
              if (level > maxLevel) {
                maxLevel = level;
              }
            }
            if (maxLevel > 0) {
              output.traits.set(traitType, maxLevel);
            }
          }
        }
      }

      // Create item instance using itemService with 'crafted' context
      // This allows traits to be validated against trait applicableCategories
      // rather than item allowedTraits, enabling trait inheritance from ingredients
      const itemInstance = itemService.createItemInstance(
        output.itemId,
        output.quantity,
        output.qualities,
        output.traits,
        'crafted'
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
