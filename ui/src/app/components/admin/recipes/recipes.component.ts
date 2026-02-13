import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recipe, SkillName } from '@shared/types';
import { RecipeRegistry } from '@be/data/recipes/RecipeRegistry';
import { SKILL_DISPLAY_NAMES } from '../../../constants/game-data.constants';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {
  // All recipes from registry
  allRecipes: Recipe[] = [];

  // Filtered recipes for list display
  filteredRecipes = signal<Recipe[]>([]);

  // Selected recipe for detail panel
  selectedRecipe = signal<Recipe | undefined>(undefined);

  // Search and filter state
  searchTerm = signal('');
  filterSkill = signal<'all' | SkillName>('all');
  sortBy = signal<'name' | 'skill' | 'level' | 'duration' | 'xp'>('name');

  // Constants
  skillNames = SKILL_DISPLAY_NAMES;

  // Available crafting skills
  craftingSkills: SkillName[] = ['alchemy', 'cooking', 'smithing', 'construction'];

  constructor() {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.allRecipes = RecipeRegistry.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allRecipes];

    // Search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(search) ||
        recipe.recipeId.toLowerCase().includes(search) ||
        recipe.description.toLowerCase().includes(search)
      );
    }

    // Skill filter
    const skill = this.filterSkill();
    if (skill !== 'all') {
      filtered = filtered.filter(recipe => recipe.skill === skill);
    }

    // Sort
    const sortBy = this.sortBy();
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'skill':
          return a.skill.localeCompare(b.skill);
        case 'level':
          return a.requiredLevel - b.requiredLevel;
        case 'duration':
          return a.duration - b.duration;
        case 'xp':
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    this.filteredRecipes.set(filtered);
  }

  selectRecipe(recipe: Recipe): void {
    this.selectedRecipe.set(recipe);
  }

  getSkillDisplayName(skill: SkillName): string {
    return this.skillNames[skill as keyof typeof this.skillNames] || this.capitalizeFirst(skill);
  }

  getSkillColor(skill: SkillName): string {
    const colors: Record<string, string> = {
      alchemy: '#8b5cf6', // purple
      cooking: '#f97316', // orange
      smithing: '#ef4444', // red
      construction: '#10b981' // green
    };
    return colors[skill] || '#6b7280';
  }

  getIngredientDisplay(ingredient: any): string {
    if (ingredient.itemId) {
      return `${ingredient.itemId} x${ingredient.quantity}`;
    } else if (ingredient.subcategory) {
      return `Any ${ingredient.subcategory} x${ingredient.quantity}`;
    }
    return 'Unknown';
  }

  getOutputDisplay(output: any): string {
    return `${output.itemId} x${output.quantity} (${output.qualityModifier})`;
  }

  hasUnlockConditions(recipe: Recipe): boolean {
    return !!recipe.unlockConditions;
  }

  isDiscoveredByDefault(recipe: Recipe): boolean {
    return recipe.unlockConditions?.discoveredByDefault !== false;
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
