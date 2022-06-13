import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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
export class AuthService {
  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBrTg6e1RhKO1WncX9C4GlrSN2BkQSkoSI',
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handlerError),
        tap(({ email, localId, idToken, expiresIn }) =>
          this.handleAuthentication(email, localId, idToken, expiresIn)
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBrTg6e1RhKO1WncX9C4GlrSN2BkQSkoSI',
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handlerError),
        tap(({ email, localId, idToken, expiresIn }) =>
          this.handleAuthentication(email, localId, idToken, expiresIn)
        )
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - Date.now();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    idToken: string,
    expiresIn: string
  ) {
    const expirationDate = new Date(
      new Date().getTime() + Number(expiresIn) * 1000
    );
    const user = new User(email, userId, idToken, expirationDate);

    this.user.next(user);
    this.autoLogout(Number(expiresIn) * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handlerError(errorResponse: HttpErrorResponse) {
    const defaultErrorMsg = 'An unknown error occurred';

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(defaultErrorMsg);
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        return throwError(
          'The email address is already in use by another account.'
        );
      case 'OPERATION_NOT_ALLOWED':
        return throwError('Password sign-in is disabled for this project.');
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return throwError(
          'We have blocked all requests from this device due to unusual activity. Try again later.'
        );
      case 'EMAIL_NOT_FOUND':
        return throwError(
          'There is no user record corresponding to this identifier. The user may have been deleted.'
        );
      case 'INVALID_PASSWORD':
        return throwError(
          'The password is invalid or the user does not have a password.'
        );
      case 'USER_DISABLED':
        return throwError(
          'The user account has been disabled by an administrator.'
        );
      default:
        return throwError(defaultErrorMsg);
    }
  }
}
