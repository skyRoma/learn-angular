import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';
import { FetchRecipes, SET_RECIPES } from './store/recipe.actions';

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve() {
    return this.store.select('recipes').pipe(
      take(1),
      switchMap(({ recipes }) => {
        if (recipes.length === 0) {
          this.store.dispatch(new FetchRecipes());
          // wait for set recipes and then navigate
          return this.actions$.pipe(ofType(SET_RECIPES), take(1));
        }

        return of(recipes);
      })
    );
  }
}
