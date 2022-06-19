import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { RecipesResolverService } from './recipes/recipes-resolver.service';

@NgModule({
  providers: [
    RecipesResolverService,
    AuthService,
    AuthGuardService,
    LoggingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {}
