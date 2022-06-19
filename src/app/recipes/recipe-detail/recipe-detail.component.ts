import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddIngredients } from '../../shopping-list/store/shopping-list.actions';
import { AppState } from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { DeleteRecipe } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: number;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(
        map((params) => Number(params.id)),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(({ recipes }) => recipes[this.id])
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
