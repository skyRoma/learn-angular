import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AppState } from '../store/app.reducer';
import { LoginStart, SignupStart } from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;

  private subscription = new Subscription();

  @ViewChild(PlaceholderDirective)
  alertHost: PlaceholderDirective;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('auth').subscribe(({ loading, authError }) => {
        this.isLoading = loading;
        if (authError) {
          this.showErrorAlert(authError);
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;

    if (this.isLoginMode) {
      this.store.dispatch(new LoginStart({ email, password }));
    } else {
      this.store.dispatch(new SignupStart({ email, password }));
    }

    form.reset();
  }

  private showErrorAlert(errorMsg: string) {
    const viewContainerRef = this.alertHost.viewContainerRef;
    viewContainerRef.clear();
    const alertComponentRef = viewContainerRef.createComponent(AlertComponent);
    alertComponentRef.instance.message = errorMsg;
    this.subscription.add(
      alertComponentRef.instance.close.subscribe(() => {
        this.subscription.unsubscribe();
        viewContainerRef.clear();
      })
    );
  }
}
