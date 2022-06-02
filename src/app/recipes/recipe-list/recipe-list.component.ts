import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  @Output()
  recipeSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
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

  onRecipeSelected(recipe: Recipe) {
    this.recipeSelected.emit(recipe);
  }
}
