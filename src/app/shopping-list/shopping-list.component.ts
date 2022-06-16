import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { StartEdit } from './store/shopping-list.actions';
import { AppState } from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<Ingredient[]>;

  constructor(
    private loggingService: LoggingService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store
      .select('shoppingList')
      .pipe(map((store) => store.ingredients));

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInt');
  }

  onEditItem(index: number) {
    this.store.dispatch(new StartEdit(index));
  }
}
