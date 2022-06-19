import { Recipe } from '../recipe.model';
import {
  ADD_RECIPE,
  DELETE_RECIPE,
  RecipeAction,
  SET_RECIPES,
  UPDATE_RECIPE,
} from './recipe.actions';

export interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipeAction
): RecipesState {
  switch (action.type) {
    case SET_RECIPES:
      return { ...state, recipes: [...action.payload] };

    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };

    case UPDATE_RECIPE:
      const newRecipes = [...state.recipes];

      newRecipes[action.payload.index] = {
        ...newRecipes[action.payload.index],
        ...action.payload.newRecipe,
      };

      return {
        ...state,
        recipes: newRecipes,
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((_recipe, i) => i !== action.payload),
      };

    default:
      return state;
  }
}
