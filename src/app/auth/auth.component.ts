import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;

  private subscription: Subscription;

  @ViewChild(PlaceholderDirective)
  alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signUp(email, password);
    }

    authObservable.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.showErrorAlert(errorMsg);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  private showErrorAlert(errorMsg: string) {
    const viewContainerRef = this.alertHost.viewContainerRef;
    viewContainerRef.clear();
    const alertComponentRef = viewContainerRef.createComponent(AlertComponent);
    alertComponentRef.instance.message = errorMsg;
    this.subscription = alertComponentRef.instance.close.subscribe(() => {
      this.subscription.unsubscribe();
      viewContainerRef.clear();
    });
  }
}
