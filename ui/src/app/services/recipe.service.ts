import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/crafting`;

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
        totalQuantity = playerInventory
          .filter(item => item.itemId === ingredient.itemId)
          .reduce((sum, item) => sum + item.quantity, 0);
        ingredientName = ingredient.itemId;
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
}
