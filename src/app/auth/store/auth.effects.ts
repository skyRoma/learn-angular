import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  AuthenticateFail,
  LoginStart,
  AuthenticateSuccess,
  LOGIN_START,
  AUTHENTICATE_SUCCESS,
  SIGNUP_START,
  SignupStart,
  LOGOUT,
  AUTO_LOGIN,
} from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(SIGNUP_START),
      switchMap(({ payload }: SignupStart) =>
        this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
            {
              email: payload.email,
              password: payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => this.handleAuthentication(resData)),
            catchError((errorResponse) => this.handleError(errorResponse))
          )
      )
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(LOGIN_START),
      switchMap(({ payload }: LoginStart) =>
        this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
            {
              email: payload.email,
              password: payload.password,
              returnSecureToken: true,
            }
          ) // Check this moving this pipe on level up
          .pipe(
            map((resData) => this.handleAuthentication(resData)),
            catchError((errorResponse) => this.handleError(errorResponse))
          )
      )
    )
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - Date.now();
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthenticateSuccess({
            email: userData.email,
            userId: userData.id,
            idToken: userData._token,
            expirationDate: new Date(userData._tokenExpirationDate),
          });
        }

        return { type: 'DUMMY' };
      })
    )
  );

  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleAuthentication({
    email,
    localId,
    idToken,
    expiresIn,
  }: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + Number(expiresIn) * 1000
    );
    const user = new User(email, localId, idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(Number(expiresIn) * 1000);

    return new AuthenticateSuccess({
      email,
      userId: localId,
      idToken,
      expirationDate,
    });
  }

  private handleError(errorResponse) {
    const defaultErrorMsg = 'An unknown error occurred';

    if (!errorResponse.error || !errorResponse.error.error) {
      return of(new AuthenticateFail(defaultErrorMsg));
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        return of(
          new AuthenticateFail(
            'The email address is already in use by another account.'
          )
        );
      case 'OPERATION_NOT_ALLOWED':
        return of(
          new AuthenticateFail('Password sign-in is disabled for this project.')
        );
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return of(
          new AuthenticateFail(
            'We have blocked all requests from this device due to unusual activity. Try again later.'
          )
        );
      case 'EMAIL_NOT_FOUND':
        return of(
          new AuthenticateFail(
            'There is no user record corresponding to this identifier. The user may have been deleted.'
          )
        );
      case 'INVALID_PASSWORD':
        return of(
          new AuthenticateFail(
            'The password is invalid or the user does not have a password.'
          )
        );
      case 'USER_DISABLED':
        return of(
          new AuthenticateFail(
            'The user account has been disabled by an administrator.'
          )
        );
      default:
        return of(new AuthenticateFail(defaultErrorMsg));
    }
  }
}
