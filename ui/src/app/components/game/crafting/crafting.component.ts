import { Component, OnInit, Input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { CraftingService } from '../../../services/crafting.service';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { Recipe } from '../../../models/recipe.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, ItemMiniComponent],
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
  message = signal<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  selectedIngredients = signal<Map<string, string[]>>(new Map()); // itemId -> instanceId[]
  autoRestartEnabled = signal<boolean>(false); // Auto-restart crafting flag
  lastCraftedRecipeId = signal<string | null>(null); // Track last crafted recipe for auto-restart
  isRestarting = signal<boolean>(false); // Prevent multiple simultaneous restart attempts
  craftingLog: Array<{
    timestamp: Date;
    recipeName: string;
    experience: number;
    skill: string;
    output: {
      itemId: string;
      quantity: number;
      qualities?: { [key: string]: number };
      traits?: { [key: string]: number };
    };
  }> = [];

  // Computed values
  filteredRecipes = computed(() => {
    return this.recipeService.recipes().filter(r => r.skill === this.skill);
  });

  playerSkills = computed(() => this.authService.currentPlayer()?.skills);
  playerInventory = computed(() => this.inventoryService.inventory());

  // Get the current active recipe for progress calculation
  activeRecipe = computed(() => {
    const activeCrafting = this.craftingService.activeCrafting();
    if (!activeCrafting) return null;
    return this.recipeService.getRecipe(activeCrafting.recipeId);
  });

  // Calculate progress percentage (0-100)
  craftingProgress = computed(() => {
    const recipe = this.activeRecipe();
    const remaining = this.craftingService.remainingTime();
    if (!recipe || remaining <= 0) return 100;

    const elapsed = recipe.duration - remaining;
    return (elapsed / recipe.duration) * 100;
  });

  // Get selected ingredient items for display
  activeIngredientItems = computed(() => {
    const activeCrafting = this.craftingService.activeCrafting();
    if (!activeCrafting || !activeCrafting.selectedIngredients) return [];

    const items: any[] = [];
    // Explicitly read from inventoryService to ensure reactivity
    const inventory = this.inventoryService.inventory();
    if (!inventory) return [];

    // Group ingredients by itemId
    const ingredientGroups: { [itemId: string]: { itemId: string; instances: any[] } } = {};

    for (const [itemId, instanceIds] of Object.entries(activeCrafting.selectedIngredients)) {
      if (!ingredientGroups[itemId]) {
        ingredientGroups[itemId] = { itemId, instances: [] };
      }

      // Count instances
      const instanceCounts: { [instanceId: string]: number } = {};
      for (const instanceId of instanceIds) {
        instanceCounts[instanceId] = (instanceCounts[instanceId] || 0) + 1;
      }

      // Find instances in inventory (they may have been consumed)
      for (const [instanceId, count] of Object.entries(instanceCounts)) {
        const item = inventory.find(i => i.instanceId === instanceId);
        if (item) {
          // Show current quantity in inventory as "remaining"
          // This represents what's available right now, before this craft consumes it
          ingredientGroups[itemId].instances.push({
            ...item,
            usedQuantity: count,
            remainingQuantity: item.quantity
          });
        }
      }
    }

    return Object.values(ingredientGroups);
  });

  constructor(
    public recipeService: RecipeService,
    public craftingService: CraftingService,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    // Setup auto-restart watcher in constructor (injection context)
    effect(() => {
      const lastResult = this.craftingService.lastResult();
      const autoRestart = this.autoRestartEnabled();
      const isCrafting = this.craftingService.isCrafting();
      const isRestarting = this.isRestarting();

      // If we just completed crafting and auto-restart is enabled, and we're not already restarting
      if (lastResult && autoRestart && !isCrafting && !isRestarting) {
        // Add to crafting log
        this.craftingLog.unshift({
          timestamp: new Date(),
          recipeName: lastResult.recipe.name,
          experience: lastResult.experience.xp,
          skill: lastResult.experience.skill,
          output: {
            itemId: lastResult.output.itemId,
            quantity: lastResult.output.quantity,
            qualities: lastResult.output.qualities,
            traits: lastResult.output.traits
          }
        });

        // Keep only the last 10 entries
        if (this.craftingLog.length > 10) {
          this.craftingLog = this.craftingLog.slice(0, 10);
        }

        const recipeId = lastResult.recipe.recipeId;
        const recipe = this.recipeService.getRecipe(recipeId);

        if (recipe) {
          // Check if we can still craft this recipe
          const check = this.canCraft(recipe);
          if (check.canCraft) {
            // Set restarting flag to prevent duplicate triggers
            this.isRestarting.set(true);

            // Try to reuse the same ingredient instances if possible
            const reused = this.reuseIngredientSelection(recipe);

            if (!reused) {
              // Can't reuse, try auto-selecting new instances
              this.autoSelectBestQuality(recipe);
            }

            // Check if we have enough selected
            if (this.hasSelectedEnough(recipe)) {
              // Small delay to let the UI update
              setTimeout(() => {
                this.restartCrafting(recipe);
              }, 500);
            } else {
              // Not enough ingredients, disable auto-restart
              this.autoRestartEnabled.set(false);
              this.isRestarting.set(false);
              this.showMessage('Auto-restart stopped: Not enough ingredients', 'info');
            }
          } else {
            // Can't craft anymore, disable auto-restart
            this.autoRestartEnabled.set(false);
            this.showMessage('Auto-restart stopped: ' + check.message, 'info');
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
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

    // Clear the last result to avoid triggering the watcher again
    this.craftingService.clearResult();

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).subscribe({
      next: (response) => {
        // Silent restart - no message or UI change
        // Reset restarting flag now that craft has started
        this.isRestarting.set(false);
      },
      error: (error) => {
        console.error('Error restarting crafting:', error);
        this.autoRestartEnabled.set(false);
        this.isRestarting.set(false);
        this.showMessage('Auto-restart failed: ' + (error.error?.message || 'Unknown error'), 'error');
      }
    });
  }

  /**
   * Load recipes for this skill
   */
  loadRecipes(): void {
    this.recipeService.getRecipesBySkill(this.skill).subscribe({
      next: () => {
        console.log(`Loaded ${this.filteredRecipes().length} ${this.skill} recipes`);
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
    this.selectedRecipe.set(recipe);
    this.message.set(null);
    // Auto-select best quality ingredients
    this.autoSelectBestQuality(recipe);
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
    const hasSelection = this.hasSelectedEnough(recipe);
    if (!hasSelection) {
      this.showMessage('Please select ingredients to craft with', 'error');
      return;
    }

    // Convert selected ingredients to object format
    const selectedIngredients: { [itemId: string]: string[] } = {};
    this.selectedIngredients().forEach((instanceIds, itemId) => {
      selectedIngredients[itemId] = instanceIds;
    });

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).subscribe({
      next: (response) => {
        this.showMessage(`Started crafting ${recipe.name}`, 'success');
        this.lastCraftedRecipeId.set(recipe.recipeId);
        // Enable auto-restart by default
        this.autoRestartEnabled.set(true);
        this.selectedRecipe.set(null);
        // Don't clear selection - keep it for auto-restart
      },
      error: (error) => {
        console.error('Error starting crafting:', error);
        this.showMessage(error.error?.message || 'Failed to start crafting', 'error');
      }
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
    this.craftingService.cancelCrafting().subscribe({
      next: () => {
        this.autoRestartEnabled.set(false);
        this.clearSelection();
        this.showMessage('Crafting cancelled', 'info');
      },
      error: (error) => {
        console.error('Error cancelling crafting:', error);
        this.showMessage('Failed to cancel crafting', 'error');
      }
    });
  }

  /**
   * Complete crafting (called automatically by service when time is up)
   */
  completeCrafting(): void {
    this.craftingService.completeCrafting().subscribe({
      next: (response) => {
        this.showMessage(`Crafted ${response.recipe.name}!`, 'success');
        // Refresh inventory
        this.inventoryService.getInventory().subscribe();
      },
      error: (error) => {
        console.error('Error completing crafting:', error);
        this.showMessage(error.error?.message || 'Failed to complete crafting', 'error');
      }
    });
  }

  /**
   * Get ingredient availability display
   */
  getIngredientDisplay(itemId: string, required: number): string {
    const inventory = this.playerInventory();
    if (!inventory) return `0/${required}`;

    const available = inventory
      .filter(item => item.itemId === itemId)
      .reduce((sum, item) => sum + item.quantity, 0);

    return `${available}/${required}`;
  }

  /**
   * Check if player has enough of an ingredient
   */
  hasEnoughIngredient(itemId: string, required: number): boolean {
    const inventory = this.playerInventory();
    if (!inventory) return false;

    const available = inventory
      .filter(item => item.itemId === itemId)
      .reduce((sum, item) => sum + item.quantity, 0);

    return available >= required;
  }

  /**
   * Get available instances of an ingredient
   */
  getAvailableInstances(itemId: string): any[] {
    const inventory = this.playerInventory();
    if (!inventory) return [];

    return inventory
      .filter(item => item.itemId === itemId && !item.equipped)
      .sort((a, b) => {
        // Sort by quality score (higher quality first)
        const aQuality = this.getQualityScore(a);
        const bQuality = this.getQualityScore(b);
        return bQuality - aQuality;
      });
  }

  /**
   * Calculate quality score for sorting
   */
  getQualityScore(item: any): number {
    if (!item.qualities) return 0;
    const qualities = Object.values(item.qualities) as number[];
    return qualities.reduce((sum, level) => sum + level, 0);
  }

  /**
   * Get selected quantity for an instance
   */
  getSelectedQuantity(instanceId: string): number {
    const selected = this.selectedIngredients();
    for (const [_, instanceIds] of selected.entries()) {
      const count = instanceIds.filter(id => id === instanceId).length;
      if (count > 0) return count;
    }
    return 0;
  }

  /**
   * Toggle instance selection
   */
  toggleInstanceSelection(itemId: string, instanceId: string, maxQuantity: number, required: number): void {
    const selected = new Map(this.selectedIngredients());
    const instanceIds = selected.get(itemId) || [];

    // Count how many of this instance are already selected
    const currentCount = instanceIds.filter(id => id === instanceId).length;

    // Count total selected for this itemId
    const totalSelected = instanceIds.length;

    if (currentCount > 0) {
      // Remove one instance
      const index = instanceIds.indexOf(instanceId);
      if (index > -1) {
        instanceIds.splice(index, 1);
      }
    } else {
      // Add one instance
      if (totalSelected < required) {
        // Room available, just add
        instanceIds.push(instanceId);
      } else {
        // Already at capacity, replace the first (oldest) selection
        instanceIds.shift();
        instanceIds.push(instanceId);
      }
    }

    selected.set(itemId, instanceIds);
    this.selectedIngredients.set(selected);
  }

  /**
   * Get total selected count for an ingredient
   */
  getTotalSelected(itemId: string): number {
    const selected = this.selectedIngredients();
    const instanceIds = selected.get(itemId) || [];
    return instanceIds.length;
  }

  /**
   * Check if we have selected enough ingredients
   */
  hasSelectedEnough(recipe: Recipe): boolean {
    for (const ingredient of recipe.ingredients) {
      const selected = this.getTotalSelected(ingredient.itemId);
      if (selected < ingredient.quantity) {
        return false;
      }
    }
    return true;
  }

  /**
   * Try to reuse the same ingredient instances from the previous selection
   * Returns true if successful, false if we need to reselect
   */
  reuseIngredientSelection(recipe: Recipe): boolean {
    const currentSelection = this.selectedIngredients();
    if (currentSelection.size === 0) {
      return false; // No previous selection to reuse
    }

    const inventory = this.playerInventory();
    if (!inventory) return false;

    const newSelection = new Map<string, string[]>();

    // Try to reuse the same instances for each ingredient
    for (const ingredient of recipe.ingredients) {
      const previousInstanceIds = currentSelection.get(ingredient.itemId) || [];
      const instanceIds: string[] = [];
      let remaining = ingredient.quantity;

      // Count how many times each instance was used previously
      const instanceCounts: { [instanceId: string]: number } = {};
      for (const instanceId of previousInstanceIds) {
        instanceCounts[instanceId] = (instanceCounts[instanceId] || 0) + 1;
      }

      // Try to reuse the same instances in the same order
      for (const [instanceId, prevCount] of Object.entries(instanceCounts)) {
        if (remaining <= 0) break;

        // Find this instance in current inventory
        const item = inventory.find(i => i.instanceId === instanceId && !i.equipped);
        if (item) {
          // Use as many as we need and as many as are available
          const available = Math.min(item.quantity, remaining, prevCount);
          for (let i = 0; i < available; i++) {
            instanceIds.push(instanceId);
          }
          remaining -= available;
        }
      }

      // If we couldn't fulfill the requirement with the same instances, fail
      if (remaining > 0) {
        return false;
      }

      newSelection.set(ingredient.itemId, instanceIds);
    }

    // Successfully reused all instances
    this.selectedIngredients.set(newSelection);
    return true;
  }

  /**
   * Auto-select best quality instances
   */
  autoSelectBestQuality(recipe: Recipe): void {
    const selected = new Map<string, string[]>();

    for (const ingredient of recipe.ingredients) {
      const instances = this.getAvailableInstances(ingredient.itemId);
      const instanceIds: string[] = [];

      let remaining = ingredient.quantity;
      for (const instance of instances) {
        if (remaining <= 0) break;

        const available = Math.min(instance.quantity, remaining);
        for (let i = 0; i < available; i++) {
          instanceIds.push(instance.instanceId);
        }
        remaining -= available;
      }

      selected.set(ingredient.itemId, instanceIds);
    }

    this.selectedIngredients.set(selected);
  }

  /**
   * Clear ingredient selection
   */
  clearSelection(): void {
    this.selectedIngredients.set(new Map());
  }

  /**
   * Create item object for display with custom quantity
   */
  createItemForDisplay(instance: any, usedQuantity: number): any {
    return {
      ...instance,
      quantity: usedQuantity
    };
  }

  /**
   * Format time remaining
   */
  formatTime(seconds: number): string {
    if (seconds <= 0) return '0s';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }

  /**
   * Show message to user
   */
  private showMessage(text: string, type: 'success' | 'error' | 'info'): void {
    this.message.set({ text, type });
    setTimeout(() => this.message.set(null), 5000);
  }

  /**
   * Clear last result message
   */
  clearResult(): void {
    this.craftingService.clearResult();
  }
}
