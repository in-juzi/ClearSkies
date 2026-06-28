import { Injectable } from '@angular/core';
import { Recipe, RecipeIngredient } from '@shared/types';
import { calculateItemScore } from '../utils/item-sort.utils';

// Extended item instance with crafting-specific properties (any for flexibility with ItemDetails)
type CraftingItemInstance = any;

// Map of ingredient lookupKey (itemId or subcategory) -> selected instanceId[]
export type IngredientSelection = Map<string, string[]>;

/**
 * Pure ingredient-selection logic for crafting.
 *
 * All methods are side-effect free: they take the current inventory and/or
 * selection and return new values. The component owns the selection signal and
 * applies the results — keeping this logic testable and out of the component.
 */
@Injectable({
  providedIn: 'root'
})
export class CraftingSelectionService {

  /**
   * Get the lookup key for an ingredient (itemId or subcategory).
   */
  getIngredientLookupKey(ingredient: RecipeIngredient): string {
    return ingredient.itemId || ingredient.subcategory || '';
  }

  /**
   * Quality + trait score used to rank instances (traits weighted higher for crafting).
   */
  getQualityScore(item: CraftingItemInstance): number {
    return calculateItemScore(item, 10);
  }

  /**
   * Get available (non-equipped) instances for an ingredient, best quality first.
   * Supports both specific itemId and subcategory ingredients.
   */
  getAvailableInstancesByIngredient(ingredient: RecipeIngredient, inventory: CraftingItemInstance[]): CraftingItemInstance[] {
    let items: CraftingItemInstance[];
    if (ingredient.subcategory) {
      items = inventory.filter(item =>
        !item.equipped && item.definition?.subcategories?.includes(ingredient.subcategory!)
      );
    } else {
      items = inventory.filter(item =>
        item.itemId === ingredient.itemId && !item.equipped
      );
    }

    return items.sort((a, b) => this.getQualityScore(b) - this.getQualityScore(a));
  }

  /**
   * Total number of selected instances for a lookup key.
   */
  getTotalSelected(selection: IngredientSelection, lookupKey: string): number {
    return (selection.get(lookupKey) || []).length;
  }

  /**
   * Whether the selection satisfies every ingredient's required quantity.
   */
  hasSelectedEnough(recipe: Recipe, selection: IngredientSelection): boolean {
    for (const ingredient of recipe.ingredients) {
      const lookupKey = this.getIngredientLookupKey(ingredient);
      if (this.getTotalSelected(selection, lookupKey) < ingredient.quantity) {
        return false;
      }
    }
    return true;
  }

  /**
   * Build a selection that picks the best-quality available instances for each ingredient.
   */
  autoSelectBestQuality(recipe: Recipe, inventory: CraftingItemInstance[]): IngredientSelection {
    const selected: IngredientSelection = new Map();

    for (const ingredient of recipe.ingredients) {
      const lookupKey = this.getIngredientLookupKey(ingredient);
      const instances = this.getAvailableInstancesByIngredient(ingredient, inventory);
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

    return selected;
  }

  /**
   * Try to rebuild the previous selection using the same instances (for auto-restart).
   * Returns the new selection, or null if the same instances can no longer satisfy the recipe.
   */
  reuseIngredientSelection(
    recipe: Recipe,
    inventory: CraftingItemInstance[],
    currentSelection: IngredientSelection
  ): IngredientSelection | null {
    if (currentSelection.size === 0) {
      return null; // No previous selection to reuse
    }

    const newSelection: IngredientSelection = new Map();

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
        return null;
      }

      newSelection.set(lookupKey, instanceIds);
    }

    return newSelection;
  }

  /**
   * Toggle an instance in the selection, cycling 0 -> 1 -> ... -> maxQuantity -> 0
   * while respecting the ingredient's required total. Returns a new selection map.
   */
  toggleInstanceSelection(
    selection: IngredientSelection,
    lookupKey: string,
    instanceId: string,
    maxQuantity: number,
    required: number
  ): IngredientSelection {
    const selected = new Map(selection);
    const instanceIds = selected.get(lookupKey) || [];

    // Count how many of this instance are already selected
    const currentCount = instanceIds.filter(id => id === instanceId).length;

    // Count total selected for this lookupKey
    const totalSelected = instanceIds.length;

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

    return selected;
  }
}
