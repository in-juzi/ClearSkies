import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ItemModifiersComponent } from '../../../shared/item-modifiers/item-modifiers.component';
import { Recipe } from '../../../../models/recipe.model';
import { RecipeIngredient } from '@shared/types';
import { calculateItemScore } from '../../../../utils/item-sort.utils';

type CraftingItemInstance = any; // Simplified type for brevity

@Component({
  selector: 'app-ingredient-selector',
  standalone: true,
  imports: [CommonModule, IconComponent, ItemModifiersComponent],
  templateUrl: './ingredient-selector.component.html',
  styleUrls: ['./ingredient-selector.component.scss']
})
export class IngredientSelectorComponent {
  @Input() recipe: Recipe | null = null;
  @Input() skill: string = '';
  @Input() playerInventory: any[] = [];
  @Input() selectedIngredients = signal<Map<string, string[]>>(new Map());
  @Input() outputItems: any[] = [];
  @Input() canCraft: boolean = false;
  @Input() canCraftMessage: string = '';

  @Output() recipeBack = new EventEmitter<void>();
  @Output() craftingStarted = new EventEmitter<Recipe>();
  @Output() ingredientSelectionChanged = new EventEmitter<{lookupKey: string, instanceId: string, maxQuantity: number, required: number}>();
  @Output() autoSelectRequested = new EventEmitter<Recipe>();
  @Output() selectionCleared = new EventEmitter<void>();

  back(): void {
    this.recipeBack.emit();
  }

  startCrafting(): void {
    if (this.recipe && this.canCraft) {
      this.craftingStarted.emit(this.recipe);
    }
  }

  getIngredientLookupKey(ingredient: RecipeIngredient): string {
    return ingredient.itemId || ingredient.subcategory || 'unknown';
  }

  getIngredientLabel(ingredient: RecipeIngredient): string {
    if (ingredient.itemId) {
      const inventoryItem = this.playerInventory.find(item => item.itemId === ingredient.itemId);
      return inventoryItem?.definition?.name || ingredient.itemId;
    } else if (ingredient.subcategory) {
      return `Any ${ingredient.subcategory.replace(/_/g, ' ')}`;
    }
    return 'Unknown';
  }

  getTotalSelectedByLookupKey(lookupKey: string): number {
    const instanceIds = this.selectedIngredients().get(lookupKey) || [];
    return instanceIds.reduce((sum, instanceId) => {
      const item = this.playerInventory.find(i => i.instanceId === instanceId);
      return sum + (item ? this.getSelectedQuantity(instanceId) : 0);
    }, 0);
  }

  getSelectedQuantity(instanceId: string): number {
    let count = 0;
    for (const [_, instanceIds] of this.selectedIngredients().entries()) {
      count += instanceIds.filter(id => id === instanceId).length;
    }
    return count;
  }

  getAvailableInstancesByIngredient(ingredient: RecipeIngredient): CraftingItemInstance[] {
    if (ingredient.itemId) {
      return this.playerInventory
        .filter(item => !item.equipped && item.itemId === ingredient.itemId)
        .sort((a, b) => this.getQualityScore(b) - this.getQualityScore(a));
    } else if (ingredient.subcategory) {
      return this.playerInventory
        .filter(item => !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory!))
        .sort((a, b) => this.getQualityScore(b) - this.getQualityScore(a));
    }
    return [];
  }

  private getQualityScore(item: CraftingItemInstance): number {
    // Use centralized utility function for consistent scoring
    return calculateItemScore(item, 10); // trait weight = 10 for crafting (prioritize traits)
  }

  toggleInstanceSelection(lookupKey: string, instanceId: string, maxQuantity: number, required: number): void {
    this.ingredientSelectionChanged.emit({ lookupKey, instanceId, maxQuantity, required });
  }

  autoSelectBestQuality(): void {
    if (this.recipe) {
      this.autoSelectRequested.emit(this.recipe);
    }
  }

  clearSelection(): void {
    this.selectionCleared.emit();
  }
}
