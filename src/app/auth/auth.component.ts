import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMsg: string = null;

  constructor(private authService: AuthService, private router: Router) {}

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
        this.errorMsg = null;
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.errorMsg = errorMsg;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
