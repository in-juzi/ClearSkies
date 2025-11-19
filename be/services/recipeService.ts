import { Recipe } from '@shared/types';
import { RecipeRegistry } from '../data/recipes/RecipeRegistry';
import itemService from './itemService';
import effectEvaluator from './effectEvaluator';
import playerInventoryService from './playerInventoryService';

/**
 * Validation result for recipe requirements
 */
interface ValidationResult {
  valid: boolean;
  message: string;
}

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
   * Validate player's skill level for recipe
   */
  private validateSkillLevel(player: any, recipe: Recipe): ValidationResult {
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

    return { valid: true, message: '' };
  }

  /**
   * Validate a single selected item instance
   */
  private validateSelectedInstance(
    player: any,
    instanceId: string,
    ingredient: any
  ): ValidationResult {
    const item = playerInventoryService.getItem(player, instanceId);
    if (!item) {
      return {
        valid: false,
        message: `Selected instance not found`
      };
    }

    // For itemId: exact match
    if (ingredient.itemId) {
      if (item.itemId !== ingredient.itemId) {
        return {
          valid: false,
          message: `Invalid instance selected for ${ingredient.itemId}`
        };
      }
    }

    // For subcategory: check if item has that subcategory
    if (ingredient.subcategory) {
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

    return { valid: true, message: '' };
  }

  /**
   * Validate selected ingredient instances
   */
  private validateSelectedIngredients(
    player: any,
    ingredient: any,
    selectedInstanceIds: string[]
  ): ValidationResult {
    if (selectedInstanceIds.length < ingredient.quantity) {
      const displayName = ingredient.itemId || `any ${ingredient.subcategory}`;
      return {
        valid: false,
        message: `Please select ${ingredient.quantity}x ${displayName} (selected ${selectedInstanceIds.length})`
      };
    }

    // Verify all selected instances
    for (const instanceId of selectedInstanceIds) {
      const result = this.validateSelectedInstance(player, instanceId, ingredient);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true, message: '' };
  }

  /**
   * Count available quantity of an ingredient in inventory
   */
  private countAvailableIngredients(player: any, ingredient: any): number {
    let totalQuantity = 0;

    if (ingredient.itemId) {
      // Specific item: use existing method
      totalQuantity = playerInventoryService.getInventoryItemQuantity(player, ingredient.itemId);
    } else if (ingredient.subcategory) {
      // Subcategory: count all matching items
      for (const item of player.inventory) {
        if (!item.equipped) {
          const itemDef = this.itemService.getItemDefinition(item.itemId);
          if (itemDef?.subcategories?.includes(ingredient.subcategory)) {
            totalQuantity += item.quantity || 1;
          }
        }
      }
    }

    return totalQuantity;
  }

  /**
   * Validate ingredient availability
   */
  private validateIngredient(
    player: any,
    ingredient: any,
    selectedIngredients: Record<string, string[]> | null
  ): ValidationResult {
    const lookupKey = ingredient.itemId || ingredient.subcategory;
    if (!lookupKey) {
      return {
        valid: false,
        message: 'Invalid recipe: ingredient must have itemId or subcategory'
      };
    }

    // If specific instances selected, validate those
    if (selectedIngredients?.[lookupKey]) {
      return this.validateSelectedIngredients(
        player,
        ingredient,
        selectedIngredients[lookupKey]
      );
    }

    // No specific selection, check total quantity available
    const available = this.countAvailableIngredients(player, ingredient);
    if (available < ingredient.quantity) {
      const displayName = ingredient.itemId || `any ${ingredient.subcategory}`;
      return {
        valid: false,
        message: `Requires ${ingredient.quantity}x ${displayName} (have ${available})`
      };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate if player meets recipe requirements
   * Orchestrates smaller validation functions for better testability
   */
  validateRecipeRequirements(
    player: any,
    recipe: Recipe,
    selectedIngredients: Record<string, string[]> | null = null
  ): ValidationResult {
    // 1. Check skill level
    const skillCheck = this.validateSkillLevel(player, recipe);
    if (!skillCheck.valid) {
      return skillCheck;
    }

    // 2. Check each ingredient
    for (const ingredient of recipe.ingredients) {
      const ingredientCheck = this.validateIngredient(player, ingredient, selectedIngredients);
      if (!ingredientCheck.valid) {
        return ingredientCheck;
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
          itemId => playerInventoryService.hasInventoryItem(player, itemId, 1)
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
   * Process complete crafting workflow with ingredient consumption
   * This is the single source of truth for crafting completion
   *
   * @param player - Player crafting the recipe
   * @param recipe - Recipe being crafted
   * @param selectedIngredients - Map of ingredient key to instance IDs (optional)
   * @returns Crafting result with output items, XP rewards, and consumed ingredients
   */
  async processCrafting(
    player: any,
    recipe: any,
    selectedIngredients?: Map<string, string[]>
  ): Promise<{
    outputItems: any[];
    xpRewards: any;
    consumedIngredients: any[];
  }> {
    const itemService = require('./itemService').default;
    const consumedIngredients: any[] = [];

    // 1. Process ingredients - consume from inventory and gather for quality calculation
    for (const ingredient of recipe.ingredients) {
      const lookupKey = ingredient.itemId || ingredient.subcategory;
      const instanceIds = selectedIngredients?.get
        ? selectedIngredients.get(lookupKey)
        : selectedIngredients ? (selectedIngredients as any)[lookupKey] : undefined;

      if (instanceIds && instanceIds.length > 0) {
        // Use player-selected instances
        for (const instanceId of instanceIds) {
          const item = playerInventoryService.getItem(player, instanceId);
          if (item) {
            consumedIngredients.push(item);
            playerInventoryService.removeItem(player, instanceId, 1);
          }
        }
      } else {
        // Auto-select instances based on itemId or subcategory
        let items: any[] = [];

        if (ingredient.itemId) {
          items = playerInventoryService.getItemsByItemId(player, ingredient.itemId);
        } else if (ingredient.subcategory) {
          items = player.inventory.filter((item: any) => {
            const itemDef = itemService.getItemDefinition(item.itemId);
            return itemDef?.subcategories?.includes(ingredient.subcategory!);
          });
        }

        let remaining = ingredient.quantity;
        for (const item of items) {
          if (remaining <= 0) break;
          const toRemove = Math.min(remaining, item.quantity);

          // Add to consumed list (only once per ingredient type)
          if (consumedIngredients.length < recipe.ingredients.length) {
            consumedIngredients.push(item);
          }

          playerInventoryService.removeItem(player, item.instanceId, toRemove);
          remaining -= toRemove;
        }
      }
    }

    // 2. Calculate crafting outcome (quality/traits from ingredients)
    const playerSkillLevel = player.skills.get(recipe.skill)?.level || 1;
    const outputs = this.calculateCraftingOutcome(
      recipe,
      consumedIngredients,
      playerSkillLevel,
      itemService,
      player
    );

    // 3. Create item instances and add to inventory using service
    const outputItems: any[] = [];
    for (const output of outputs) {
      const craftedItem = itemService.createItemInstance(
        output.itemId,
        output.quantity,
        output.qualities || {},
        output.traits || {},
        'crafted'
      );
      playerInventoryService.addItem(player, craftedItem);
      outputItems.push(craftedItem);
    }

    // 4. Award XP
    const xpRewards = await player.addSkillExperience(recipe.skill, recipe.experience);

    // 5. Save player
    await player.save();

    // 6. Update quest progress (lazy load to avoid circular dependency)
    const questService = require('./questService');
    await questService.onRecipeCrafted(player, recipe.recipeId);

    console.log(`[Crafting] ${player.characterName} crafted ${recipe.name} - awarded ${recipe.experience} ${recipe.skill} XP`);

    return {
      outputItems,
      xpRewards,
      consumedIngredients
    };
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
