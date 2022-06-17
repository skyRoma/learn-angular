import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutoLogin } from './auth/store/auth.actions';
import { LoggingService } from './logging.service';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }
}
