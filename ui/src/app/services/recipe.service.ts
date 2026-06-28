import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe } from '@shared/types';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/crafting`;
  private inventoryService = inject(InventoryService);

  // Signals for reactive state
  recipes = signal<Recipe[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
   * Get all recipes
   */
  getAllRecipes(): Observable<any> {
    this.loading.set(true);
    return this.http.get<any>(`${this.apiUrl}/recipes`).pipe(
      tap(response => {
        this.recipes.set(response.recipes || []);
        this.loading.set(false);
      })
    );
  }

  /**
   * Get recipes for a specific skill
   */
  getRecipesBySkill(skill: string): Observable<any> {
    this.loading.set(true);
    return this.http.get<any>(`${this.apiUrl}/recipes/${skill}`).pipe(
      tap(response => {
        this.recipes.set(response.recipes || []);
        this.loading.set(false);
      })
    );
  }

  /**
   * Get recipe by ID from loaded recipes
   */
  getRecipe(recipeId: string): Recipe | undefined {
    return this.recipes().find(r => r.recipeId === recipeId);
  }

  /**
   * Check if player meets recipe requirements
   */
  canCraft(recipe: Recipe, playerSkills: any, playerInventory: any[]): { canCraft: boolean; message: string } {
    // Check skill level
    const playerSkill = playerSkills[recipe.skill];
    if (!playerSkill || playerSkill.level < recipe.requiredLevel) {
      return {
        canCraft: false,
        message: `Requires ${recipe.skill} level ${recipe.requiredLevel}`
      };
    }

    // Check ingredients
    for (const ingredient of recipe.ingredients) {
      let totalQuantity = 0;
      let ingredientName = '';

      if (ingredient.itemId) {
        // Specific item requirement
        const matchingItems = playerInventory.filter(item => item.itemId === ingredient.itemId);
        totalQuantity = matchingItems.reduce((sum, item) => sum + item.quantity, 0);
        // Get name from inventory item definition, or lookup from item service
        const itemDef = matchingItems[0]?.definition || this.inventoryService.getItemDefinitionSync(ingredient.itemId);
        ingredientName = itemDef?.name || ingredient.itemId;
      } else if (ingredient.subcategory) {
        // Subcategory requirement (e.g., "any herb")
        totalQuantity = playerInventory
          .filter(item => item.definition?.subcategories?.includes(ingredient.subcategory))
          .reduce((sum, item) => sum + item.quantity, 0);
        // Capitalize first letter for display
        ingredientName = ingredient.subcategory.charAt(0).toUpperCase() + ingredient.subcategory.slice(1);
      }

      if (totalQuantity < ingredient.quantity) {
        return {
          canCraft: false,
          message: `Requires ${ingredient.quantity}x ${ingredientName} (have ${totalQuantity})`
        };
      }
    }

    return {
      canCraft: true,
      message: 'Requirements met'
    };
  }

  /**
   * Check if a recipe is locked for the given player
   */
  isRecipeLocked(recipe: Recipe, player: any): boolean {
    // If no unlock conditions, it's unlocked by default
    if (!recipe.unlockConditions) return false;

    // If discoveredByDefault is explicitly false, check if player has unlocked it
    if (recipe.unlockConditions.discoveredByDefault === false) {
      if (!player || !player.unlockedRecipes) return true;
      return !player.unlockedRecipes.includes(recipe.recipeId);
    }

    // Otherwise it's unlocked by default
    return false;
  }

  /**
   * Get an unlock hint describing how to unlock a locked recipe
   */
  getUnlockHint(recipe: Recipe): string {
    if (!recipe.unlockConditions) return '';

    const hints: string[] = [];

    if (recipe.unlockConditions.requiredRecipes && recipe.unlockConditions.requiredRecipes.length > 0) {
      const requiredNames = recipe.unlockConditions.requiredRecipes
        .map(recipeId => {
          const req = this.getRecipe(recipeId);
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
