import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FETCH_RECIPES, SetRecipes, STORE_RECIPES } from './recipe.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(FETCH_RECIPES),
      switchMap(() =>
        this.http.get<Recipe[]>(
          'https://learn-angular-udemy-course-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        )
      ),
      map((recipes) => {
        const mappedRecipes = recipes.map((recipe) => ({
          ...recipe,
          ingredients: recipe.ingredients || [],
        }));

        return new SetRecipes(mappedRecipes);
      })
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([_action, { recipes }]) =>
          this.http.put(
            'https://learn-angular-udemy-course-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipes
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
