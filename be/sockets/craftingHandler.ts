import { Server, Socket } from 'socket.io';
import Player from '../models/Player';
import recipeService from '../services/recipeService';
import itemService from '../services/itemService';

// Track active crafting timers per user
const craftingTimers = new Map<string, NodeJS.Timeout>();

/**
 * Helper function to schedule crafting completion
 */
function scheduleCraftingCompletion(
  io: Server,
  userId: string,
  recipeId: string,
  duration: number
): void {
  // Clear any existing timer
  const existingTimer = craftingTimers.get(userId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  // Schedule completion event
  const timer = setTimeout(async () => {
    try {
      // Reload player to get fresh state
      const freshPlayer = await Player.findOne({ userId });
      if (!freshPlayer || !freshPlayer.activeCrafting) {
        return; // Crafting was cancelled
      }

      // Get recipe
      const recipe = recipeService.getRecipe(freshPlayer.activeCrafting.recipeId);
      if (!recipe) {
        console.error(`Recipe ${freshPlayer.activeCrafting.recipeId} not found`);
        return;
      }

      // Gather ingredient instances for quality calculation
      const ingredientInstances: any[] = [];
      const selectedIngredients = freshPlayer.activeCrafting.selectedIngredients;

      // Process ingredients
      for (const ingredient of recipe.ingredients) {
        const lookupKey = ingredient.itemId || ingredient.subcategory;
        const instanceIds = selectedIngredients.get
          ? selectedIngredients.get(lookupKey)
          : (selectedIngredients as any)[lookupKey];

        if (instanceIds && instanceIds.length > 0) {
          // Use selected instances
          for (const instanceId of instanceIds) {
            const item = freshPlayer.getItem(instanceId);
            if (item) {
              ingredientInstances.push(item);
              freshPlayer.removeItem(instanceId, 1);
            }
          }
        } else {
          // Auto-select instances
          let items: any[] = [];

          if (ingredient.itemId) {
            items = freshPlayer.getItemsByItemId(ingredient.itemId);
          } else if (ingredient.subcategory) {
            items = freshPlayer.inventory.filter((item: any) => {
              const itemDef = itemService.getItemDefinition(item.itemId);
              return itemDef?.subcategories?.includes(ingredient.subcategory!);
            });
          }

          let remaining = ingredient.quantity;
          for (const item of items) {
            if (remaining <= 0) break;
            const toRemove = Math.min(remaining, item.quantity);
            if (ingredientInstances.length < recipe.ingredients.length) {
              ingredientInstances.push(item);
            }
            freshPlayer.removeItem(item.instanceId, toRemove);
            remaining -= toRemove;
          }
        }
      }

      // Calculate crafting outcome
      const playerSkillLevel = freshPlayer.skills[recipe.skill].level;
      const outputItems = recipeService.calculateCraftingOutcome(
        recipe,
        ingredientInstances,
        playerSkillLevel,
        itemService,
        freshPlayer  // Pass player for effect system integration
      );

      // Add crafted items to inventory
      for (const output of outputItems) {
        const craftedItem = itemService.createItemInstance(
          output.itemId,
          output.quantity,
          output.qualities || {},
          output.traits || {}
        );
        freshPlayer.addItem(craftedItem);
      }

      // Award XP
      const xpResult = await freshPlayer.addSkillExperience(
        recipe.skill,
        recipe.experience
      );

      // Check for recipe unlocks
      const newRecipes = recipeService.checkRecipeUnlocks(freshPlayer);
      if (newRecipes.length > 0) {
        newRecipes.forEach((newRecipeId: string) => {
          if (!freshPlayer.unlockedRecipes.includes(newRecipeId)) {
            freshPlayer.unlockedRecipes.push(newRecipeId);
          }
        });
      }

      // Clear crafting state
      freshPlayer.activeCrafting = undefined;
      await freshPlayer.save();

      // Get updated inventory
      const inventory = freshPlayer.inventory.map((item: any) => {
        const plainItem = item.toObject ? item.toObject() : item;
        if (plainItem.qualities instanceof Map) {
          plainItem.qualities = Object.fromEntries(plainItem.qualities);
        }
        if (plainItem.traits instanceof Map) {
          plainItem.traits = Object.fromEntries(plainItem.traits);
        }
        return plainItem;
      });

      // Convert outputItems to plain objects with qualities/traits
      const plainOutputs = outputItems.map((item: any) => {
        const plainItem = item.toObject ? item.toObject() : item;
        if (plainItem.qualities instanceof Map) {
          plainItem.qualities = Object.fromEntries(plainItem.qualities);
        }
        if (plainItem.traits instanceof Map) {
          plainItem.traits = Object.fromEntries(plainItem.traits);
        }
        return plainItem;
      });

      // Emit completion event
      io.to(`user:${userId}`).emit('crafting:completed', {
        success: true,
        recipeName: recipe.name,
        result: plainOutputs[0], // First output item (legacy)
        outputs: plainOutputs, // All output items (new schema)
        xpGained: recipe.experience,
        skillUpdate: xpResult.skill,
        attributeUpdate: xpResult.attribute,
        inventory,
        newRecipes: newRecipes.map((rid: string) => recipeService.getRecipe(rid))
      });

      craftingTimers.delete(userId);
    } catch (error) {
      console.error(`Error completing crafting for user ${userId}:`, error);
      io.to(`user:${userId}`).emit('crafting:error', {
        success: false,
        message: 'Failed to complete crafting'
      });
    }
  }, duration * 1000);

  craftingTimers.set(userId, timer);
}

/**
 * Crafting Socket Handler
 * Handles real-time crafting events
 */
export default function (io: Server): void {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data?.userId || (socket as any).userId;

    socket.join(`user:${userId}`);

    console.log(`✓ User connected to crafting handler: ${userId}`);

    /**
     * Event: crafting:start
     * Client starts crafting a recipe
     */
    socket.on('crafting:start', async (data: { recipeId: string; selectedIngredients?: Record<string, string[]> }, callback?: (response: any) => void) => {
      try {
        const { recipeId, selectedIngredients } = data;

        if (!recipeId) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Recipe ID is required'
            });
          }
          return;
        }

        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        // Cancel any existing crafting (allow overwriting)
        if (player.activeCrafting) {
          // Clear crafting timer
          const craftingTimer = craftingTimers.get(userId);
          if (craftingTimer) {
            clearTimeout(craftingTimer);
            craftingTimers.delete(userId);
          }

          player.activeCrafting = undefined;
          console.log(`Crafting cancelled for user ${userId} (starting new craft)`);

          // Emit cancellation event
          io.to(`user:${userId}`).emit('crafting:cancelled', {
            success: true,
            message: 'Previous crafting cancelled',
            reason: 'new_craft'
          });
        }

        // Get recipe
        const recipe = recipeService.getRecipe(recipeId);
        if (!recipe) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Recipe not found' });
          }
          return;
        }

        // Validate recipe is unlocked
        if (!recipeService.isRecipeUnlocked(player, recipeId)) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: 'Recipe not unlocked yet'
            });
          }
          return;
        }

        // Validate requirements
        const validation = recipeService.validateRecipeRequirements(
          player,
          recipe,
          selectedIngredients || {}
        );

        if (!validation.valid) {
          if (typeof callback === 'function') {
            callback({
              success: false,
              message: validation.message
            });
          }
          return;
        }

        // Start crafting
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + recipe.duration * 1000);

        // Convert selectedIngredients to Map for Mongoose
        const selectedIngredientsMap = new Map();
        if (selectedIngredients) {
          Object.entries(selectedIngredients).forEach(([key, value]) => {
            selectedIngredientsMap.set(key, value);
          });
        }

        player.activeCrafting = {
          recipeId,
          startTime: startTime,
          endTime: endTime,
          selectedIngredients: selectedIngredientsMap
        };

        await player.save();

        // Schedule completion
        scheduleCraftingCompletion(io, userId, recipeId, recipe.duration);

        // Send success response
        if (typeof callback === 'function') {
          callback({
            success: true,
            message: `Started crafting ${recipe.name}`,
            crafting: {
              recipeId,
              recipeName: recipe.name,
              duration: recipe.duration,
              endTime
            }
          });
        }

        // Emit started event
        io.to(`user:${userId}`).emit('crafting:started', {
          recipeId,
          recipeName: recipe.name,
          duration: recipe.duration,
          endTime
        });

      } catch (error) {
        console.error('Error starting crafting:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to start crafting'
          });
        }
      }
    });

    /**
     * Event: crafting:cancel
     * Client cancels current crafting
     */
    socket.on('crafting:cancel', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.activeCrafting) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'No active crafting to cancel' });
          }
          return;
        }

        // Clear timer
        const timer = craftingTimers.get(userId);
        if (timer) {
          clearTimeout(timer);
          craftingTimers.delete(userId);
        }

        // Clear crafting
        player.activeCrafting = undefined;
        await player.save();

        if (typeof callback === 'function') {
          callback({
            success: true,
            message: 'Crafting cancelled'
          });
        }

        io.to(`user:${userId}`).emit('crafting:cancelled', {
          success: true
        });

      } catch (error) {
        console.error('Error cancelling crafting:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to cancel crafting'
          });
        }
      }
    });

    /**
     * Event: crafting:getStatus
     * Client requests current crafting status (for reconnection)
     */
    socket.on('crafting:getStatus', async (data: any, callback?: (response: any) => void) => {
      try {
        const player = await Player.findOne({ userId });
        if (!player) {
          if (typeof callback === 'function') {
            callback({ success: false, message: 'Player not found' });
          }
          return;
        }

        if (!player.activeCrafting) {
          if (typeof callback === 'function') {
            callback({
              success: true,
              active: false
            });
          }
          return;
        }

        const recipe = recipeService.getRecipe(player.activeCrafting.recipeId);
        if (!recipe) {
          player.activeCrafting = undefined;
          await player.save();

          if (typeof callback === 'function') {
            callback({
              success: true,
              active: false
            });
          }
          return;
        }

        const now = Date.now();
        const endTime = new Date(player.activeCrafting.endTime).getTime();
        const timeRemaining = Math.max(0, endTime - now);

        if (typeof callback === 'function') {
          callback({
            success: true,
            active: true,
            crafting: {
              recipeId: player.activeCrafting.recipeId,
              recipeName: recipe.name,
              startTime: player.activeCrafting.startTime,
              endTime: player.activeCrafting.endTime,
              timeRemaining: Math.ceil(timeRemaining / 1000)
            }
          });
        }

        // Restart timer if needed (server restart recovery)
        if (timeRemaining > 0 && !craftingTimers.has(userId)) {
          scheduleCraftingCompletion(io, userId, player.activeCrafting.recipeId, Math.ceil(timeRemaining / 1000));
        }

      } catch (error) {
        console.error('Error getting crafting status:', error);
        if (typeof callback === 'function') {
          callback({
            success: false,
            message: 'Failed to get crafting status'
          });
        }
      }
    });

    /**
     * Event: disconnect
     */
    socket.on('disconnect', (reason: string) => {
      console.log(`✗ User disconnected from crafting handler: ${userId} (${reason})`);
      // Timers continue running for reconnection
    });
  });
}
