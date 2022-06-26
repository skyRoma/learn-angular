import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';

const routes: Route[] = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(
        (component) => component.AboutComponent
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/routes').then((mod) => mod.routes),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
