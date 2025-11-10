const Player = require('../models/Player');
const recipeService = require('../services/recipeService');
const itemService = require('../services/itemService');

/**
 * GET /api/crafting/recipes
 * Get all available recipes
 */
exports.getAllRecipes = async (req, res) => {
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
      error: error.message
    });
  }
};

/**
 * GET /api/crafting/recipes/:skill
 * Get recipes for specific skill
 */
exports.getRecipesBySkill = async (req, res) => {
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
      error: error.message
    });
  }
};

/**
 * POST /api/crafting/start
 * Start crafting a recipe
 * Body: { recipeId, selectedIngredients?: { [itemId]: instanceId[] } }
 */
exports.startCrafting = async (req, res) => {
  try {
    const { recipeId, selectedIngredients } = req.body;
    const userId = req.user._id;

    if (!recipeId) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if player already has active crafting
    if (player.activeCrafting && player.activeCrafting.recipeId) {
      const now = new Date();
      if (now < new Date(player.activeCrafting.endTime)) {
        return res.status(400).json({
          message: 'Already crafting',
          activeCrafting: player.activeCrafting
        });
      }
    }

    // Get recipe
    const recipe = recipeService.getRecipe(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Validate requirements
    const validation = recipeService.validateRecipeRequirements(player, recipe, selectedIngredients);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Store selected ingredients in active crafting
    const now = new Date();
    const endTime = new Date(now.getTime() + recipe.duration * 1000);

    player.activeCrafting = {
      recipeId: recipe.recipeId,
      startTime: now,
      endTime: endTime,
      selectedIngredients: selectedIngredients || {}
    };

    await player.save();

    res.json({
      message: `Started crafting ${recipe.name}`,
      activeCrafting: player.activeCrafting,
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
      error: error.message
    });
  }
};

/**
 * POST /api/crafting/complete
 * Complete active crafting
 */
exports.completeCrafting = async (req, res) => {
  try {
    const userId = req.user._id;

    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if player has active crafting
    if (!player.activeCrafting || !player.activeCrafting.recipeId) {
      return res.status(400).json({ message: 'No active crafting' });
    }

    const now = new Date();
    const endTime = new Date(player.activeCrafting.endTime);

    // Check if crafting is complete
    if (now < endTime) {
      return res.status(400).json({
        message: 'Crafting not yet complete',
        remainingTime: Math.ceil((endTime - now) / 1000),
        endTime: endTime
      });
    }

    // Get recipe
    const recipe = recipeService.getRecipe(player.activeCrafting.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Consume ingredients from inventory
    const ingredientInstances = [];
    const selectedIngredients = player.activeCrafting.selectedIngredients || {};

    for (const ingredient of recipe.ingredients) {
      // selectedIngredients is a Mongoose Map, so we need to use .get() method
      const instanceIds = selectedIngredients.get ? selectedIngredients.get(ingredient.itemId) : selectedIngredients[ingredient.itemId];

      // Check if specific instances were selected
      if (instanceIds && instanceIds.length > 0) {
        // Use selected instances
        for (const instanceId of instanceIds) {
          const item = player.getItem(instanceId);

          if (!item) {
            return res.status(400).json({
              message: `Selected ingredient instance not found: ${instanceId}`
            });
          }

          // Store instance for quality calculation (before removal)
          ingredientInstances.push(item);

          // Remove one of this instance
          player.removeItem(instanceId, 1);
        }
      } else {
        // Auto-select instances (original behavior)
        const items = player.getItemsByItemId(ingredient.itemId);

        if (items.length === 0) {
          return res.status(400).json({
            message: `Missing ingredient: ${ingredient.itemId}`
          });
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
          return res.status(400).json({
            message: `Not enough ${ingredient.itemId}`
          });
        }
      }
    }

    // Calculate crafting outcome (returns array of items)
    const playerSkillLevel = player.skills[recipe.skill].level;
    const outputItems = recipeService.calculateCraftingOutcome(
      recipe,
      ingredientInstances,
      playerSkillLevel,
      itemService
    );

    // Add all outputs to inventory
    for (const outputItem of outputItems) {
      player.addItem(outputItem);
    }

    // Award XP
    const xpResult = await player.addSkillExperience(recipe.skill, recipe.experience);

    // Clear active crafting
    player.activeCrafting = {
      recipeId: null,
      startTime: null,
      endTime: null
    };

    await player.save();

    // Convert output items to plain objects for JSON response
    const plainOutputItems = outputItems.map(outputItem => {
      const itemDef = itemService.getItemDefinition(outputItem.itemId);
      return {
        itemId: outputItem.itemId,
        name: itemDef ? itemDef.name : outputItem.itemId,
        instanceId: outputItem.instanceId,
        quantity: outputItem.quantity,
        qualities: outputItem.qualities instanceof Map ? Object.fromEntries(outputItem.qualities) : outputItem.qualities,
        traits: outputItem.traits instanceof Map ? Object.fromEntries(outputItem.traits) : outputItem.traits
      };
    });

    res.json({
      message: `Crafted ${recipe.name}`,
      outputs: plainOutputItems, // Changed from 'output' (singular) to 'outputs' (array)
      experience: {
        skill: recipe.skill,
        xp: recipe.experience,
        skillResult: xpResult.skill,
        attributeResult: xpResult.attribute
      },
      recipe: {
        recipeId: recipe.recipeId,
        name: recipe.name
      }
    });
  } catch (error) {
    console.error('Error completing crafting:', error);
    res.status(500).json({
      message: 'Error completing crafting',
      error: error.message
    });
  }
};

/**
 * POST /api/crafting/cancel
 * Cancel active crafting
 */
exports.cancelCrafting = async (req, res) => {
  try {
    const userId = req.user._id;

    const player = await Player.findOne({ userId });
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    if (!player.activeCrafting || !player.activeCrafting.recipeId) {
      return res.status(400).json({ message: 'No active crafting to cancel' });
    }

    const recipeName = player.activeCrafting.recipeId;

    player.activeCrafting = {
      recipeId: null,
      startTime: null,
      endTime: null
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
      error: error.message
    });
  }
};
