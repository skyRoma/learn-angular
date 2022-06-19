import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store/auth.reducer';
import { recipeReducer, RecipesState } from '../recipes/store/recipe.reducer';
import {
  shoppingListReducer,
  ShoppingListState,
} from '../shopping-list/store/shopping-list.reducer';

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipes: RecipesState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipes: recipeReducer,
};
