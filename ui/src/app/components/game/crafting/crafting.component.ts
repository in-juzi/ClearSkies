import { Component, OnInit, Input, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../../services/recipe.service';
import { CraftingService } from '../../../services/crafting.service';
import { InventoryService } from '../../../services/inventory.service';
import { AuthService } from '../../../services/auth.service';
import { SkillsService } from '../../../services/skills.service';
import { Recipe } from '../../../models/recipe.model';
import { ItemModifiersComponent } from '../../shared/item-modifiers/item-modifiers.component';
import { ItemMiniComponent } from '../../shared/item-mini/item-mini.component';
import { XpMiniComponent } from '../../shared/xp-mini/xp-mini.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-crafting',
  standalone: true,
  imports: [CommonModule, ItemModifiersComponent, ItemMiniComponent, XpMiniComponent, IconComponent],
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
  activeOutputIcon = signal<any>(null); // Icon for the active crafting output

  // Filter state
  searchQuery = signal<string>('');
  showCraftableOnly = signal<boolean>(false);
  sortBy = signal<'level' | 'name' | 'xp'>('level');
  craftingLog: Array<{
    timestamp: Date;
    recipeName: string;
    experience: number;
    skill: string;
    output: {
      itemId: string;
      name?: string; // Display name of the item
      quantity: number;
      qualities?: { [key: string]: number };
      traits?: { [key: string]: number };
      definition?: any; // Item definition for icon display
    };
  }> = [];

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

  // Get output item definitions for selected recipe
  selectedRecipeOutputItems = signal<any[]>([]);


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
    private authService: AuthService,
    private skillsService: SkillsService
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
              const newEntry = {
                timestamp: new Date(),
                recipeName: lastResult.recipe.name,
                experience: lastResult.experience.xp,
                skill: lastResult.experience.skill,
                output: {
                  itemId: output.itemId,
                  name: output.name || itemDef.name, // Use output name or definition name
                  quantity: output.quantity,
                  qualities: output.qualities,
                  traits: output.traits,
                  definition: itemDef // Include full definition for icon
                }
              };

              // Create new array instead of mutating to ensure Angular change detection
              this.craftingLog = [newEntry, ...this.craftingLog].slice(0, 10);
            },
            error: (error) => {
              console.warn('Could not load item definition for log:', error);
              // Add entry without definition as fallback
              const newEntry = {
                timestamp: new Date(),
                recipeName: lastResult.recipe.name,
                experience: lastResult.experience.xp,
                skill: lastResult.experience.skill,
                output: {
                  itemId: output.itemId,
                  name: output.name,
                  quantity: output.quantity,
                  qualities: output.qualities,
                  traits: output.traits
                }
              };
              this.craftingLog = [newEntry, ...this.craftingLog].slice(0, 10);
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
            const reused = this.reuseIngredientSelection(recipe);

            if (!reused) {
              // Can't reuse, try auto-selecting new instances
              this.autoSelectBestQuality(recipe);
            }

            // Check if we have enough selected
            if (this.hasSelectedEnough(recipe)) {
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

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).then((response: any) => {
      // Clear result AFTER craft starts to prevent effect from retriggering during transition
      this.craftingService.clearResult();
      // Reset restarting flag now that craft has started
      this.isRestarting.set(false);
    }).catch((error: any) => {
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
    // Don't allow selecting locked recipes
    if (this.isRecipeLocked(recipe)) {
      this.showMessage('This recipe is locked: ' + this.getUnlockHint(recipe), 'info');
      return;
    }

    this.selectedRecipe.set(recipe);
    this.message.set(null);
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
    const loadedItems: any[] = [];

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

    this.craftingService.startCrafting(recipe.recipeId, selectedIngredients).then((response: any) => {
      this.showMessage(`Started crafting ${recipe.name}`, 'success');
      this.lastCraftedRecipeId.set(recipe.recipeId);
      // Enable auto-restart by default
      this.autoRestartEnabled.set(true);
      this.selectedRecipe.set(null);
      // Don't clear selection - keep it for auto-restart
    }).catch((error: any) => {
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
    }).catch((error: any) => {
      console.error('Error cancelling crafting:', error);
      this.showMessage('Failed to cancel crafting', 'error');
    });
  }

  /**
   * Get lookupKey for an ingredient (itemId or subcategory)
   */
  getIngredientLookupKey(ingredient: any): string {
    return ingredient.itemId || ingredient.subcategory || '';
  }

  /**
   * Get display label for an ingredient
   */
  getIngredientLabel(ingredient: any): string {
    if (ingredient.subcategory) {
      // Capitalize first letter for display
      return ingredient.subcategory.charAt(0).toUpperCase() + ingredient.subcategory.slice(1);
    }
    // For specific itemId, look up the item definition to get the display name
    if (ingredient.itemId) {
      const itemDef = this.inventoryService.getItemDefinitionSync(ingredient.itemId);
      return itemDef?.name || ingredient.itemId;
    }
    return 'Unknown';
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
   * Get ingredient availability display (supports subcategory)
   */
  getIngredientDisplayByLookupKey(lookupKey: string, ingredient: any, required: number): string {
    const inventory = this.playerInventory();
    if (!inventory) return `0/${required}`;

    let available = 0;
    if (ingredient.subcategory) {
      // Count items matching subcategory
      available = inventory
        .filter(item => !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory))
        .reduce((sum, item) => sum + item.quantity, 0);
    } else {
      // Count specific itemId
      available = inventory
        .filter(item => item.itemId === lookupKey)
        .reduce((sum, item) => sum + item.quantity, 0);
    }

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
   * Check if player has enough of an ingredient (supports subcategory)
   */
  hasEnoughIngredientByLookupKey(lookupKey: string, ingredient: any, required: number): boolean {
    const inventory = this.playerInventory();
    if (!inventory) return false;

    let available = 0;
    if (ingredient.subcategory) {
      // Count items matching subcategory
      available = inventory
        .filter(item => !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory))
        .reduce((sum, item) => sum + item.quantity, 0);
    } else {
      // Count specific itemId
      available = inventory
        .filter(item => item.itemId === lookupKey)
        .reduce((sum, item) => sum + item.quantity, 0);
    }

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
   * Get available instances for an ingredient (supports subcategory)
   */
  getAvailableInstancesByIngredient(ingredient: any): any[] {
    const inventory = this.playerInventory();
    if (!inventory) return [];

    let items: any[];
    if (ingredient.subcategory) {
      // Filter by subcategory
      items = inventory.filter(item =>
        !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory)
      );
    } else {
      // Filter by specific itemId
      items = inventory.filter(item =>
        item.itemId === ingredient.itemId && !item.equipped
      );
    }

    // Sort by quality score (higher quality first)
    return items.sort((a, b) => {
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
  toggleInstanceSelection(lookupKey: string, instanceId: string, maxQuantity: number, required: number): void {
    const selected = new Map(this.selectedIngredients());
    const instanceIds = selected.get(lookupKey) || [];

    // Count how many of this instance are already selected
    const currentCount = instanceIds.filter(id => id === instanceId).length;

    // Count total selected for this lookupKey
    const totalSelected = instanceIds.length;

    // Left click adds, right-click or shift-click would remove
    // For now, we cycle: 0 -> 1 -> 2 -> ... -> maxQuantity -> 0
    if (currentCount >= maxQuantity || (currentCount > 0 && totalSelected >= required)) {
      // At max for this instance OR at required total, remove all of this instance
      const filtered = instanceIds.filter(id => id !== instanceId);
      selected.set(lookupKey, filtered);
    } else {
      // Add one more instance
      if (totalSelected < required) {
        // Room available, just add
        instanceIds.push(instanceId);
        selected.set(lookupKey, instanceIds);
      } else {
        // At capacity but can replace oldest different instance
        // Find the first instance that's not this one
        const indexToReplace = instanceIds.findIndex(id => id !== instanceId);
        if (indexToReplace > -1) {
          instanceIds.splice(indexToReplace, 1);
          instanceIds.push(instanceId);
          selected.set(lookupKey, instanceIds);
        } else {
          // All selected are this instance already at max, cycle back to 0
          selected.set(lookupKey, []);
        }
      }
    }

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
   * Get total selected count for an ingredient by lookupKey
   */
  getTotalSelectedByLookupKey(lookupKey: string): number {
    const selected = this.selectedIngredients();
    const instanceIds = selected.get(lookupKey) || [];
    return instanceIds.length;
  }

  /**
   * Check if we have selected enough ingredients
   */
  hasSelectedEnough(recipe: Recipe): boolean {
    for (const ingredient of recipe.ingredients) {
      const lookupKey = this.getIngredientLookupKey(ingredient);
      const selected = this.getTotalSelectedByLookupKey(lookupKey);
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
      const lookupKey = this.getIngredientLookupKey(ingredient);
      const previousInstanceIds = currentSelection.get(lookupKey) || [];
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
          // Validate it matches the ingredient requirement
          if (ingredient.subcategory) {
            if (!item.definition?.subcategories?.includes(ingredient.subcategory)) {
              continue; // Skip items that don't match subcategory
            }
          } else {
            if (item.itemId !== ingredient.itemId) {
              continue; // Skip items with different itemId
            }
          }

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

      newSelection.set(lookupKey, instanceIds);
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
      const lookupKey = this.getIngredientLookupKey(ingredient);
      const instances = this.getAvailableInstancesByIngredient(ingredient);
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

      selected.set(lookupKey, instanceIds);
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
   * Get recipe outputs as array (handles both old and new schema)
   */
  getRecipeOutputs(recipe: Recipe) {
    return recipe.outputs || (recipe.output ? [recipe.output] : []);
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

  /**
   * Check if a recipe is locked
   */
  isRecipeLocked(recipe: Recipe): boolean {
    // If no unlock conditions, it's unlocked by default
    if (!recipe.unlockConditions) return false;

    // If discoveredByDefault is explicitly false, check if player has unlocked it
    if (recipe.unlockConditions.discoveredByDefault === false) {
      const player = this.authService.currentPlayer();
      if (!player || !player.unlockedRecipes) return true;
      return !player.unlockedRecipes.includes(recipe.recipeId);
    }

    // Otherwise it's unlocked by default
    return false;
  }

  /**
   * Get unlock hint for a locked recipe
   */
  getUnlockHint(recipe: Recipe): string {
    if (!recipe.unlockConditions) return '';

    const hints: string[] = [];

    if (recipe.unlockConditions.requiredRecipes && recipe.unlockConditions.requiredRecipes.length > 0) {
      const requiredNames = recipe.unlockConditions.requiredRecipes
        .map(recipeId => {
          const req = this.recipeService.getRecipe(recipeId);
          return req ? req.name : recipeId;
        })
        .join(', ');
      hints.push(`Craft: ${requiredNames}`);
    }

    if (recipe.unlockConditions.requiredItems && recipe.unlockConditions.requiredItems.length > 0) {
      hints.push(`Requires: ${recipe.unlockConditions.requiredItems.join(', ')}`);
    }

    if (recipe.unlockConditions.questRequired) {
      hints.push(`Complete quest: ${recipe.unlockConditions.questRequired}`);
    }

    return hints.length > 0 ? hints.join(' | ') : 'Unlock through progression';
  }
}
