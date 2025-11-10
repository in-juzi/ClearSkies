const fs = require('fs');
const path = require('path');

class RecipeService {
  constructor() {
    this.recipes = new Map();
    this.recipesLoaded = false;
  }

  /**
   * Load all recipe definitions from JSON files
   */
  loadRecipes() {
    if (this.recipesLoaded) {
      return;
    }

    const recipesDir = path.join(__dirname, '../data/recipes');

    // Load recipes from all skill subdirectories (cooking, smithing, etc.)
    if (!fs.existsSync(recipesDir)) {
      console.warn('Recipes directory not found');
      return;
    }

    const skillDirs = fs.readdirSync(recipesDir);

    for (const skillDir of skillDirs) {
      const skillPath = path.join(recipesDir, skillDir);
      const stats = fs.statSync(skillPath);

      if (!stats.isDirectory()) continue;

      const recipeFiles = fs.readdirSync(skillPath).filter(file => file.endsWith('.json'));

      for (const file of recipeFiles) {
        try {
          const recipePath = path.join(skillPath, file);
          const recipeData = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
          this.recipes.set(recipeData.recipeId, recipeData);
        } catch (error) {
          console.error(`Error loading recipe ${file}:`, error.message);
        }
      }
    }

    this.recipesLoaded = true;
    console.log(`Loaded ${this.recipes.size} recipes`);
  }

  /**
   * Get all recipes
   * @returns {Array} All recipe definitions
   */
  getAllRecipes() {
    this.loadRecipes();
    return Array.from(this.recipes.values());
  }

  /**
   * Get single recipe by ID
   * @param {string} recipeId
   * @returns {Object|null} Recipe definition or null
   */
  getRecipe(recipeId) {
    this.loadRecipes();
    return this.recipes.get(recipeId) || null;
  }

  /**
   * Get recipes for a specific skill
   * @param {string} skillName - e.g., 'cooking', 'smithing'
   * @returns {Array} Recipes for the skill
   */
  getRecipesBySkill(skillName) {
    this.loadRecipes();
    return Array.from(this.recipes.values()).filter(recipe => recipe.skill === skillName);
  }

  /**
   * Validate if player meets recipe requirements
   * @param {Object} player - Player document
   * @param {Object} recipe - Recipe definition
   * @param {Object} selectedIngredients - Optional map of itemId -> instanceId[] for specific instance selection
   * @returns {Object} { valid: boolean, message: string }
   */
  validateRecipeRequirements(player, recipe, selectedIngredients = null) {
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
   * @param {Object} recipe - Recipe definition
   * @param {Array} ingredientInstances - Actual ingredient items from inventory
   * @param {number} playerSkillLevel - Player's skill level
   * @param {Object} itemService - ItemService instance
   * @returns {Array} Array of output items with calculated qualities/traits
   */
  calculateCraftingOutcome(recipe, ingredientInstances, playerSkillLevel, itemService) {
    // Support both old (single output) and new (outputs array) schema
    const outputs = recipe.outputs ? recipe.outputs : [recipe.output];
    const outputItems = [];

    // Collect ingredient qualities and traits once (shared across all outputs)
    const qualityMaps = [];
    for (const ingredient of ingredientInstances) {
      if (ingredient.qualities && ingredient.qualities.size > 0) {
        qualityMaps.push(ingredient.qualities);
      }
    }

    let bestIngredient = null;
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
      const output = {
        itemId: outputDef.itemId,
        quantity: outputDef.quantity,
        qualities: new Map(),
        traits: new Map()
      };

      // Quality inheritance based on qualityModifier
      if (outputDef.qualityModifier === 'inherit' && ingredientInstances.length > 0) {
        // If we have qualities, inherit the maximum level for each quality type
        if (qualityMaps.length > 0) {
          const allQualityTypes = new Set();
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
          const currentLevel = output.qualities.get(primaryQuality);
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
   */
  reload() {
    this.recipes.clear();
    this.recipesLoaded = false;
    this.loadRecipes();
  }
}

module.exports = new RecipeService();
