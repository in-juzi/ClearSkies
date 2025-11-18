import { Component, Input, Output, EventEmitter, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe, RecipeIngredient } from '@shared/types';
import { RecipeService } from '../../../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent {
  private recipeService = inject(RecipeService);

  @Input() skill: string = '';
  @Input() recipes: Recipe[] = [];
  @Input() loading: boolean = false;
  @Input() playerSkills: any;
  @Input() playerInventory: any[] = [];

  @Output() recipeSelected = new EventEmitter<Recipe>();

  // Filter state
  searchQuery = signal<string>('');
  showCraftableOnly = signal<boolean>(false);
  sortBy = signal<'level' | 'name' | 'xp'>('level');

  // Computed filtered recipes
  filteredRecipes = computed(() => {
    let filtered = [...this.recipes];

    // Apply search filter
    const search = this.searchQuery().toLowerCase();
    if (search) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search)
      );
    }

    // Apply craftable filter
    if (this.showCraftableOnly()) {
      filtered = filtered.filter(r => this.canCraft(r).canCraft);
    }

    // Apply sorting
    const sortBy = this.sortBy();
    if (sortBy === 'level') {
      filtered = filtered.sort((a, b) => a.requiredLevel - b.requiredLevel);
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'xp') {
      filtered = filtered.sort((a, b) => b.experience - a.experience);
    }

    return filtered;
  });

  hasActiveFilters(): boolean {
    return this.searchQuery() !== '' || this.showCraftableOnly();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.showCraftableOnly.set(false);
  }

  selectRecipe(recipe: Recipe): void {
    if (!this.isRecipeLocked(recipe)) {
      this.recipeSelected.emit(recipe);
    }
  }

  isRecipeLocked(recipe: Recipe): boolean {
    if (!this.playerSkills) return true;
    const skillLevel = this.playerSkills[recipe.skill]?.level || 0;
    return skillLevel < recipe.requiredLevel;
  }

  getUnlockHint(recipe: Recipe): string {
    if (!this.playerSkills) return '';
    const skillLevel = this.playerSkills[recipe.skill]?.level || 0;
    const levelsNeeded = recipe.requiredLevel - skillLevel;
    return `Unlock at ${recipe.skill} level ${recipe.requiredLevel} (+${levelsNeeded} levels)`;
  }

  canCraft(recipe: Recipe): { canCraft: boolean; message: string } {
    // Delegate to RecipeService for centralized validation logic
    return this.recipeService.canCraft(recipe, this.playerSkills, this.playerInventory);
  }

  getIngredientLookupKey(ingredient: RecipeIngredient): string {
    return ingredient.itemId || ingredient.subcategory || 'unknown';
  }

  getIngredientLabel(ingredient: RecipeIngredient): string {
    if (ingredient.itemId) {
      // Specific item - find in inventory to get display name
      const inventoryItem = this.playerInventory.find(item => item.itemId === ingredient.itemId);
      return inventoryItem?.definition?.name || ingredient.itemId;
    } else if (ingredient.subcategory) {
      // Subcategory - display formatted subcategory name
      return `Any ${ingredient.subcategory.replace(/_/g, ' ')}`;
    }
    return 'Unknown';
  }

  getIngredientDisplayByLookupKey(lookupKey: string, ingredient: RecipeIngredient, required: number): string {
    const available = this.getTotalAvailableByLookupKey(lookupKey, ingredient);
    return `${available}/${required}`;
  }

  hasEnoughIngredientByLookupKey(lookupKey: string, ingredient: RecipeIngredient, required: number): boolean {
    const available = this.getTotalAvailableByLookupKey(lookupKey, ingredient);
    return available >= required;
  }

  private getTotalAvailableByLookupKey(lookupKey: string, ingredient: RecipeIngredient): number {
    if (ingredient.itemId) {
      return this.playerInventory
        .filter(item => !item.equipped && item.itemId === ingredient.itemId)
        .reduce((sum, item) => sum + item.quantity, 0);
    } else if (ingredient.subcategory) {
      return this.playerInventory
        .filter(item => !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory!))
        .reduce((sum, item) => sum + item.quantity, 0);
    }
    return 0;
  }
}
