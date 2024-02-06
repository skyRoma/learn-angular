import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../store/app.reducer';

@Injectable()
export class AuthGuardService {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate() {
    return this.store.select('auth').pipe(
      take(1),
      map(({ user }) => {
        return !!user || this.router.createUrlTree(['/auth']);
      })
    );
  }
}
