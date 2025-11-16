import { Request, Response } from 'express';
import Player from '../models/Player';
import recipeService from '../services/recipeService';
import itemService from '../services/itemService';

// ============================================================================
// Type Definitions for Request Bodies
// ============================================================================

interface StartCraftingRequest {
  recipeId: string;
  selectedIngredients?: Record<string, string[]>;
}

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * GET /api/crafting/recipes
 * Get all available recipes
 */
export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipes = recipeService.getAllRecipes();

    res.json({
      recipes,
      count: recipes.length
    });
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({
      message: 'Error retrieving recipes',
      error: (error as Error).message
    });
  }
};

/**
 * GET /api/crafting/recipes/:skill
 * Get recipes for specific skill
 */
export const getRecipesBySkill = async (
  req: Request<{ skill: string }>,
  res: Response
): Promise<void> => {
  try {
    const { skill } = req.params;
    const recipes = recipeService.getRecipesBySkill(skill);

    res.json({
      skill,
      recipes,
      count: recipes.length
    });
  } catch (error) {
    console.error('Error getting recipes by skill:', error);
    res.status(500).json({
      message: 'Error retrieving recipes',
      error: (error as Error).message
    });
  }
};

/**
 * POST /api/crafting/start
 * Start crafting a recipe
 * Body: { recipeId, selectedIngredients?: { [itemId]: instanceId[] } }
 */
export const startCrafting = async (
  req: Request<{}, {}, StartCraftingRequest>,
  res: Response
): Promise<void> => {
  try {
    const { recipeId, selectedIngredients } = req.body;
    const userId = req.user!._id;

    if (!recipeId) {
      res.status(400).json({ message: 'Recipe ID is required' });
      return;
    }

    const player = await Player.findOne({ userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if player already has active crafting
    if (player.activeCrafting && player.activeCrafting.recipeId) {
      const now = new Date();
      const endTime = player.activeCrafting.endTime;
      if (endTime && now < new Date(endTime)) {
        res.status(400).json({
          message: 'Already crafting',
          activeCrafting: player.activeCrafting
        });
        return;
      }
    }

    // Get recipe
    const recipe = recipeService.getRecipe(recipeId);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    // Check if recipe is unlocked
    if (!recipeService.isRecipeUnlocked(player, recipeId)) {
      res.status(403).json({
        message: 'Recipe not yet discovered',
        hint: 'This recipe must be unlocked through progression'
      });
      return;
    }

    // Validate requirements
    const validation = recipeService.validateRecipeRequirements(player, recipe, selectedIngredients);
    if (!validation.valid) {
      res.status(400).json({ message: validation.message });
      return;
    }

    // Store selected ingredients in active crafting
    const now = new Date();
    const endTime = new Date(now.getTime() + recipe.duration * 1000);

    // Convert selectedIngredients to Map for Mongoose
    const ingredientsMap = new Map<string, string[]>();
    if (selectedIngredients) {
      for (const [key, value] of Object.entries(selectedIngredients)) {
        ingredientsMap.set(key, value);
      }
    }

    player.activeCrafting = {
      recipeId: recipe.recipeId,
      startTime: now,
      endTime: endTime,
      selectedIngredients: ingredientsMap
    };

    await player.save();

    res.json({
      message: `Started crafting ${recipe.name}`,
      activeCrafting: {
        recipeId: player.activeCrafting.recipeId,
        startTime: player.activeCrafting.startTime,
        endTime: player.activeCrafting.endTime,
        selectedIngredients: selectedIngredients || {}
      },
      recipe: {
        recipeId: recipe.recipeId,
        name: recipe.name,
        duration: recipe.duration,
        endTime: endTime
      }
    });
  } catch (error) {
    console.error('Error starting crafting:', error);
    res.status(500).json({
      message: 'Error starting crafting',
      error: (error as Error).message
    });
  }
};

/**
 * POST /api/crafting/complete
 * Complete active crafting
 */
export const completeCrafting = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const player = await Player.findOne({ userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    // Check if player has active crafting
    if (!player.activeCrafting || !player.activeCrafting.recipeId) {
      res.status(400).json({ message: 'No active crafting' });
      return;
    }

    const now = new Date();
    const endTime = new Date(player.activeCrafting.endTime!);

    // Check if crafting is complete
    if (now < endTime) {
      res.status(400).json({
        message: 'Crafting not yet complete',
        remainingTime: Math.ceil((endTime.getTime() - now.getTime()) / 1000),
        endTime: endTime
      });
      return;
    }

    // Get recipe
    const recipe = recipeService.getRecipe(player.activeCrafting.recipeId);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    // Gather ingredient instances for quality calculation
    const ingredientInstances: any[] = [];
    const selectedIngredients = player.activeCrafting.selectedIngredients;

    for (const ingredient of recipe.ingredients) {
      // Determine the lookup key for selectedIngredients Map
      const lookupKey = ingredient.itemId || ingredient.subcategory;

      // selectedIngredients is a Mongoose Map, so we need to use .get() method
      const instanceIds = selectedIngredients.get
        ? selectedIngredients.get(lookupKey)
        : (selectedIngredients as any)[lookupKey];

      // Check if specific instances were selected
      if (instanceIds && instanceIds.length > 0) {
        // Use selected instances
        for (const instanceId of instanceIds) {
          const item = player.getItem(instanceId);

          if (!item) {
            res.status(400).json({
              message: `Selected ingredient instance not found: ${instanceId}`
            });
            return;
          }

          // Store instance for quality calculation (before removal)
          ingredientInstances.push(item);

          // Remove one of this instance
          player.removeItem(instanceId, 1);
        }
      } else {
        // Auto-select instances (original behavior)
        let items: any[] = [];

        if (ingredient.itemId) {
          // Specific item requirement
          items = player.getItemsByItemId(ingredient.itemId);
        } else if (ingredient.subcategory) {
          // Subcategory requirement - get all items matching subcategory
          items = player.inventory.filter((item: any) => {
            const itemDef = itemService.getItemDefinition(item.itemId);
            return itemDef?.subcategories?.includes(ingredient.subcategory);
          });
        }

        if (items.length === 0) {
          const ingredientName = ingredient.itemId || ingredient.subcategory;
          res.status(400).json({
            message: `Missing ingredient: ${ingredientName}`
          });
          return;
        }

        let remaining = ingredient.quantity;

        for (const item of items) {
          if (remaining <= 0) break;

          const toRemove = Math.min(remaining, item.quantity);

          // Store instance for quality calculation (before removal)
          if (ingredientInstances.length < recipe.ingredients.length) {
            ingredientInstances.push(item);
          }

          // Remove from inventory
          player.removeItem(item.instanceId, toRemove);
          remaining -= toRemove;
        }

        if (remaining > 0) {
          const ingredientName = ingredient.itemId || ingredient.subcategory;
          res.status(400).json({
            message: `Not enough ${ingredientName}`
          });
          return;
        }
      }
    }

    // Calculate crafting outcome (returns array of items)
    const playerSkillLevel = player.skills[recipe.skill].level;
    const outputItems = recipeService.calculateCraftingOutcome(
      recipe,
      ingredientInstances,
      playerSkillLevel,
      itemService,
      player  // Pass player for effect system integration
    );

    // Add all outputs to inventory
    for (const outputItem of outputItems) {
      player.addItem(outputItem);
    }

    // Award XP
    await player.addSkillExperience(recipe.skill, recipe.experience);

    // Check for newly unlocked recipes
    const newlyUnlocked = recipeService.checkRecipeUnlocks(player);
    if (newlyUnlocked.length > 0) {
      // Add newly unlocked recipes to player
      if (!player.unlockedRecipes) {
        player.unlockedRecipes = [];
      }
      player.unlockedRecipes.push(...newlyUnlocked);
    }

    // Clear active crafting
    player.activeCrafting = {
      recipeId: undefined,
      startTime: undefined,
      endTime: undefined,
      selectedIngredients: new Map()
    };

    await player.save();

    // Get enhanced item details for crafted items
    const itemDetails = outputItems.map(item => itemService.getItemDetails(item));

    // Get XP results for detailed response
    const skillResult = player.skills[recipe.skill];
    const attributeResult = player.attributes[skillResult.mainAttribute];

    res.json({
      message: `Successfully crafted ${recipe.name}`,
      outputs: itemDetails,
      experience: {
        skill: recipe.skill,
        xp: recipe.experience,
        skillResult: {
          level: skillResult.level,
          experience: skillResult.experience
        },
        attributeResult: {
          level: attributeResult.level,
          experience: attributeResult.experience
        }
      },
      recipe: {
        recipeId: recipe.recipeId,
        name: recipe.name
      },
      newlyUnlockedRecipes: newlyUnlocked.length > 0 ? newlyUnlocked : undefined
    });
  } catch (error) {
    console.error('Error completing crafting:', error);
    res.status(500).json({
      message: 'Error completing crafting',
      error: (error as Error).message
    });
  }
};

/**
 * POST /api/crafting/cancel
 * Cancel active crafting
 */
export const cancelCrafting = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const player = await Player.findOne({ userId });
    if (!player) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    if (!player.activeCrafting || !player.activeCrafting.recipeId) {
      res.status(400).json({ message: 'No active crafting to cancel' });
      return;
    }

    const recipeName = player.activeCrafting.recipeId;

    player.activeCrafting = {
      recipeId: undefined,
      startTime: undefined,
      endTime: undefined,
      selectedIngredients: new Map()
    };

    await player.save();

    res.json({
      message: `Cancelled crafting: ${recipeName}`,
      activeCrafting: null
    });
  } catch (error) {
    console.error('Error cancelling crafting:', error);
    res.status(500).json({
      message: 'Error cancelling crafting',
      error: (error as Error).message
    });
  }
};
