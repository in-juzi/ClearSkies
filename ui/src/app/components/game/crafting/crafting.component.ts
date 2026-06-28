import { Component, OnInit, Input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { CraftingService } from '../../../services/crafting.service';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { SkillsService } from '../../../services/skills.service';
import { ChatService } from '../../../services/chat.service';
import { Recipe } from '@shared/types';
import { ActivityLogEntry } from '../../shared/activity-log/activity-log.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { CraftingProgressComponent } from './crafting-progress/crafting-progress.component';
import { IngredientSelectorComponent } from './ingredient-selector/ingredient-selector.component';
import { CraftingSelectionService } from '../../../services/crafting-selection.service';

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [CommonModule, RecipeListComponent, CraftingProgressComponent, IngredientSelectorComponent],
  templateUrl: './crafting.component.html',
  styleUrls: ['./crafting.component.scss']
})
export class CraftingComponent implements OnInit {
  @Input() skill: string = 'cooking'; // Which crafting skill to show recipes for
  @Input() facilityId: string = '';

  // Expose Object for template use
  Object = Object;

  // UI state
  selectedRecipe = signal<Recipe | null>(null);
  selectedIngredients = signal<Map<string, string[]>>(new Map()); // itemId -> instanceId[]
  autoRestartEnabled = signal<boolean>(false); // Auto-restart crafting flag
  lastCraftedRecipeId = signal<string | null>(null); // Track last crafted recipe for auto-restart
  isRestarting = signal<boolean>(false); // Prevent multiple simultaneous restart attempts
  activeOutputIcon = signal<any>(null); // Icon for the active crafting output

  // Filter state
  searchQuery = signal<string>('');
  showCraftableOnly = signal<boolean>(false);
  sortBy = signal<'level' | 'name' | 'xp'>('level');
  craftingLog: ActivityLogEntry[] = [];

  // Computed values
  filteredRecipes = computed(() => {
    let recipes = this.recipeService.recipes()
      .filter(r => r.skill === this.skill);

    // Apply search filter
    const search = this.searchQuery().toLowerCase();
    if (search) {
      recipes = recipes.filter(r =>
        r.name.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
      );
    }

    // Apply craftable filter
    if (this.showCraftableOnly()) {
      recipes = recipes.filter(r => this.canCraft(r).canCraft);
    }

    // Apply sorting
    const sortBy = this.sortBy();
    if (sortBy === 'level') {
      recipes = recipes.sort((a, b) => a.requiredLevel - b.requiredLevel);
    } else if (sortBy === 'name') {
      recipes = recipes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'xp') {
      recipes = recipes.sort((a, b) => b.experience - a.experience);
    }

    return recipes;
  });

  playerSkills = computed(() => this.authService.currentPlayer()?.skills);
  playerInventory = computed(() => this.inventoryService.inventory());

  // Recipes filtered by current skill
  recipesBySkill = computed(() => {
    return this.recipeService.recipes().filter(r => r.skill === this.skill);
  });

  // Get the current active recipe for progress calculation
  activeRecipe = computed<Recipe | null>(() => {
    const activeCrafting = this.craftingService.activeCrafting();
    if (!activeCrafting) return null;
    return this.recipeService.getRecipe(activeCrafting.recipeId) || null;
  });

  // Calculate progress percentage (0-100)
  craftingProgress = computed(() => {
    const recipe = this.activeRecipe();
    const remaining = this.craftingService.remainingTime();
    if (!recipe || remaining <= 0) return 100;

    const elapsed = recipe.duration - remaining;
    return (elapsed / recipe.duration) * 100;
  });

  // Get output item definitions for selected recipe
  selectedRecipeOutputItems = signal<any[]>([]);


  // Get selected ingredient items for display (reads signals here for reactivity, transform in service)
  activeIngredientItems = computed(() =>
    this.craftingSelection.buildActiveIngredientItems(
      this.craftingService.activeCrafting(),
      this.inventoryService.inventory()
    )
  );

  constructor(
    public recipeService: RecipeService,
    public craftingService: CraftingService,
    private inventoryService: InventoryService,
    private authService: AuthService,
    private skillsService: SkillsService,
    private chatService: ChatService,
    private craftingSelection: CraftingSelectionService
  ) {
    // Setup auto-restart watcher in constructor (injection context)
    effect(() => {
      const lastResult = this.craftingService.lastResult();
      const autoRestart = this.autoRestartEnabled();
      const isRestarting = this.isRestarting();

      // CRITICAL: Inventory must be loaded for auto-restart to work
      // This dependency ensures effect re-runs when inventory updates
      const inventory = this.playerInventory();

      // If we just completed crafting and auto-restart is enabled, and we're not already restarting
      // Note: We don't check isCrafting here since completeCrafting() doesn't clear it to prevent flicker
      if (lastResult && autoRestart && !isRestarting && inventory) {
        // Set restarting flag IMMEDIATELY to prevent UI flicker
        // This ensures the crafting panel stays visible during transition
        this.isRestarting.set(true);

        // Refresh skills to show updated XP from crafting
        this.skillsService.getSkills().subscribe();

        // Get outputs (support both old and new schema)
        const outputs = lastResult.outputs || (lastResult.output ? [lastResult.output] : []);

        // Add to crafting log (one entry per output)
        // Fetch item definitions for each output to include icons and display names
        outputs.forEach(output => {
          this.inventoryService.getItemDefinition(output.itemId).subscribe({
            next: (itemDef) => {
              // Create new array instead of mutating to ensure Angular change detection
              this.craftingLog = [this.buildCraftingLogEntry(lastResult, output, itemDef), ...this.craftingLog].slice(0, 10);
            },
            error: (error) => {
              console.warn('Could not load item definition for log:', error);
              // Add entry without definition as fallback
              this.craftingLog = [this.buildCraftingLogEntry(lastResult, output), ...this.craftingLog].slice(0, 10);
            }
          });
        });

        const recipeId = lastResult.recipe.recipeId;
        const recipe = this.recipeService.getRecipe(recipeId);

        if (recipe) {
          // Check if we can still craft this recipe
          const check = this.canCraft(recipe);
          if (check.canCraft) {
            // Already set restarting flag above to prevent flicker

            // Try to reuse the same ingredient instances if possible
            const reused = this.craftingSelection.reuseIngredientSelection(
              recipe, this.playerInventory() || [], this.selectedIngredients()
            );

            if (reused) {
              this.selectedIngredients.set(reused);
            } else {
              // Can't reuse, try auto-selecting new instances
              this.autoSelectBestQuality(recipe);
            }

            // Check if we have enough selected
            if (this.craftingSelection.hasSelectedEnough(recipe, this.selectedIngredients())) {
              // Restart immediately now that inventory is confirmed updated
              this.restartCrafting(recipe);
            } else {
              // Not enough ingredients, disable auto-restart
              this.autoRestartEnabled.set(false);
              this.isRestarting.set(false);
              this.craftingService.isCrafting.set(false); // Stop showing crafting UI
              this.showMessage('Auto-restart stopped: Not enough ingredients', 'info');
            }
          } else {
            // Can't craft anymore, disable auto-restart
            this.autoRestartEnabled.set(false);
            this.isRestarting.set(false);
            this.craftingService.isCrafting.set(false); // Stop showing crafting UI
            this.showMessage('Auto-restart stopped: ' + check.message, 'info');
          }
        } else {
          // No recipe found, stop auto-restart
          this.isRestarting.set(false);
          this.craftingService.isCrafting.set(false); // Stop showing crafting UI
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
    // Load item definitions for ingredient name lookups
    this.inventoryService.getItemDefinitions().subscribe();
  }

  /**
   * Restart crafting without showing completion UI
   */
  restartCrafting(recipe: Recipe): void {
    // Convert selected ingredients to object format
    const selectedIngredients: { [itemId: string]: string[] } = {};
    this.selectedIngredients().forEach((instanceIds, itemId) => {
      selectedIngredients[itemId] = instanceIds;
    });

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).then(() => {
      // Clear result AFTER craft starts to prevent effect from retriggering during transition
      this.craftingService.clearResult();
      // Reset restarting flag now that craft has started
      this.isRestarting.set(false);
    }).catch((error: Error) => {
      console.error('Error restarting crafting:', error);
      this.craftingService.clearResult();
      this.autoRestartEnabled.set(false);
      this.isRestarting.set(false);
      this.showMessage('Auto-restart failed: ' + (error.message || 'Unknown error'), 'error');
    });
  }

  /**
   * Load recipes for this skill
   */
  loadRecipes(): void {
    this.recipeService.getRecipesBySkill(this.skill).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.showMessage('Failed to load recipes', 'error');
      }
    });
  }

  /**
   * Select a recipe to view details
   */
  selectRecipe(recipe: Recipe): void {
    // Don't allow selecting locked recipes
    if (this.recipeService.isRecipeLocked(recipe, this.authService.currentPlayer())) {
      this.showMessage('This recipe is locked: ' + this.recipeService.getUnlockHint(recipe), 'info');
      return;
    }

    this.selectedRecipe.set(recipe);
    // Auto-select best quality ingredients
    this.autoSelectBestQuality(recipe);
    // Load output item definitions
    this.loadOutputItemDefinitions(recipe);
  }

  /**
   * Load output item definitions for display
   */
  private loadOutputItemDefinitions(recipe: Recipe): void {
    const outputs = this.getRecipeOutputs(recipe);
    const loadedItems: Array<{ itemId: string; quantity: number; definition?: any; name: string }> = [];

    outputs.forEach(output => {
      this.inventoryService.getItemDefinition(output.itemId).subscribe({
        next: (itemDef) => {
          loadedItems.push({
            ...output,
            definition: itemDef,
            name: itemDef.name
          });
          // Update signal when all items are loaded
          if (loadedItems.length === outputs.length) {
            this.selectedRecipeOutputItems.set(loadedItems);
          }
        },
        error: (error) => {
          console.warn('Could not load output item definition:', error);
          loadedItems.push({
            ...output,
            name: output.itemId // Fallback to itemId
          });
          if (loadedItems.length === outputs.length) {
            this.selectedRecipeOutputItems.set(loadedItems);
          }
        }
      });
    });
  }

  /**
   * Check if player can craft this recipe
   */
  canCraft(recipe: Recipe): { canCraft: boolean; message: string } {
    const skills = this.playerSkills();
    const inventory = this.playerInventory();

    if (!skills || !inventory) {
      return { canCraft: false, message: 'Player data not loaded' };
    }

    return this.recipeService.canCraft(recipe, skills, inventory);
  }

  /**
   * Start crafting selected recipe
   */
  startCrafting(recipe: Recipe): void {
    const check = this.canCraft(recipe);
    if (!check.canCraft) {
      this.showMessage(check.message, 'error');
      return;
    }

    // Check if we have selected specific ingredients
    const hasSelection = this.craftingSelection.hasSelectedEnough(recipe, this.selectedIngredients());
    if (!hasSelection) {
      this.showMessage('Please select ingredients to craft with', 'error');
      return;
    }

    // Convert selected ingredients to object format
    const selectedIngredients: { [itemId: string]: string[] } = {};
    this.selectedIngredients().forEach((instanceIds, itemId) => {
      selectedIngredients[itemId] = instanceIds;
    });

    // Fetch the output item icon before starting
    const outputs = this.getRecipeOutputs(recipe);
    if (outputs.length > 0) {
      const outputItemId = outputs[0].itemId;
      this.inventoryService.getItemDefinition(outputItemId).subscribe({
        next: (itemDef) => {
          this.activeOutputIcon.set(itemDef.icon);
        },
        error: (error) => {
          console.warn('Could not load output icon:', error);
          this.activeOutputIcon.set(null);
        }
      });
    }

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).then(() => {
      this.showMessage(`Started crafting ${recipe.name}`, 'success');
      this.lastCraftedRecipeId.set(recipe.recipeId);
      // Enable auto-restart by default
      this.autoRestartEnabled.set(true);
      this.selectedRecipe.set(null);
      // Don't clear selection - keep it for auto-restart
    }).catch((error: Error) => {
      console.error('Error starting crafting:', error);
      this.showMessage(error.message || 'Failed to start crafting', 'error');
    });
  }

  /**
   * Toggle auto-restart
   */
  toggleAutoRestart(): void {
    this.autoRestartEnabled.set(!this.autoRestartEnabled());
  }

  /**
   * Cancel active crafting
   */
  cancelCrafting(): void {
    this.craftingService.cancelCrafting().then(() => {
      this.autoRestartEnabled.set(false);
      this.clearSelection();
      this.showMessage('Crafting cancelled', 'info');
    }).catch((error: Error) => {
      console.error('Error cancelling crafting:', error);
      this.showMessage('Failed to cancel crafting', 'error');
    });
  }

  /**
   * Toggle instance selection
   */
  toggleInstanceSelection(lookupKey: string, instanceId: string, maxQuantity: number, required: number): void {
    this.selectedIngredients.set(
      this.craftingSelection.toggleInstanceSelection(
        this.selectedIngredients(), lookupKey, instanceId, maxQuantity, required
      )
    );
  }

  /**
   * Auto-select best quality instances for the recipe
   */
  autoSelectBestQuality(recipe: Recipe): void {
    this.selectedIngredients.set(
      this.craftingSelection.autoSelectBestQuality(recipe, this.playerInventory() || [])
    );
  }

  /**
   * Clear ingredient selection
   */
  clearSelection(): void {
    this.selectedIngredients.set(new Map());
  }

  /**
   * Get recipe outputs as array (handles both old and new schema)
   */
  getRecipeOutputs(recipe: Recipe) {
    return recipe.outputs || (recipe.output ? [recipe.output] : []);
  }

  /**
   * Build an activity-log entry for a completed craft output.
   * Includes the full item definition (for icon/name) when available.
   */
  private buildCraftingLogEntry(lastResult: any, output: any, itemDef?: any): ActivityLogEntry {
    const item: any = {
      itemId: output.itemId,
      name: itemDef ? (output.name || itemDef.name) : output.name,
      quantity: output.quantity,
      qualities: output.qualities,
      traits: output.traits
    };
    if (itemDef) {
      item.definition = itemDef; // Include full definition for icon
    }

    return {
      timestamp: new Date(),
      activityName: lastResult.recipe.name,
      activityType: 'crafting',
      rewards: {
        items: [item],
        experience: [{
          skill: lastResult.experience.skill,
          xp: lastResult.experience.xp,
          leveledUp: lastResult.experience.skillResult?.leveledUp,
          newLevel: lastResult.experience.skillResult?.newLevel
        }],
        attributes: lastResult.experience.attributeResult ? [{
          attribute: lastResult.experience.attributeResult.attribute,
          xp: Math.floor(lastResult.experience.xp * 0.5), // 50% of skill XP goes to attribute
          leveledUp: lastResult.experience.attributeResult.leveledUp,
          newLevel: lastResult.experience.attributeResult.newLevel
        }] : []
      }
    };
  }

  /**
   * Show message to user via chat
   */
  private showMessage(text: string, type: 'success' | 'error' | 'info'): void {
    this.chatService.addLocalMessage({
      userId: 'system',
      username: 'Crafting',
      message: text,
      createdAt: new Date()
    });
  }

  /**
   * Clear last result message
   */
  clearResult(): void {
    this.craftingService.clearResult();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchQuery.set('');
    this.showCraftableOnly.set(false);
    this.sortBy.set('level');
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    return this.searchQuery() !== '' || this.showCraftableOnly() || this.sortBy() !== 'level';
  }

}
