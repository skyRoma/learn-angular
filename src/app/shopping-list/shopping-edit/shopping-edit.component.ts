import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import {
  AddIngredient,
  DeleteIngredient,
  StopEdit,
  UpdateIngredient,
} from '../store/shopping-list.actions';
import { AppState } from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form')
  form: NgForm;

  editMode = false;
  subscription: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe(({ editedIngredientIndex, editedIngredient }) => {
        if (editedIngredientIndex > -1) {
          this.editMode = true;
          this.form.setValue({
            ingredientName: editedIngredient.name,
            ingredientAmount: editedIngredient.amount,
          });
        } else {
          this.editMode = false;
          this.form?.reset();
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.onClear();
  }

  onSubmit() {
    const { ingredientName, ingredientAmount } = this.form.value;
    const newIngredient = new Ingredient(ingredientName, ingredientAmount);
    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new AddIngredient(newIngredient));
    }
  }

  onClear() {
    this.store.dispatch(new StopEdit());
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient());
  }
}
