import { Ingredient } from '../../shared/ingredient.model';
import {
  ADD_INGREDIENT,
  ADD_INGREDIENTS,
  DELETE_INGREDIENT,
  ShoppingListAction,
  START_EDIT,
  STOP_EDIT,
  UPDATE_INGREDIENT,
} from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListAction
): ShoppingListState {
  switch (action.type) {
    case ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case UPDATE_INGREDIENT:
      const newIngredients = [...state.ingredients];

      newIngredients[state.editedIngredientIndex] = {
        ...state.ingredients[state.editedIngredientIndex],
        ...action.payload,
      };

      return {
        ...state,
        ingredients: newIngredients,
        editedIngredientIndex: -1,
      };

    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (_ingredient, i) => i !== state.editedIngredientIndex
        ),
        editedIngredientIndex: -1,
      };

    case START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
      };

    case STOP_EDIT:
      return {
        ...state,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
}
