import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

Injectable();
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://www.cookingclassy.com/wp-content/uploads/2022/05/bolognese-2-1024x1536.jpg'
    ),
    new Recipe(
      'Another Recipe',
      'This is simply a test',
      'https://www.cookingclassy.com/wp-content/uploads/2022/05/bolognese-2-1024x1536.jpg'
    ),
  ];

  getRecipes() {
    return this.recipes.slice();
  }
}
