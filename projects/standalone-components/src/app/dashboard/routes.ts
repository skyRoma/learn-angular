import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'today',
    loadComponent: () =>
      import('./today/today.component').then(
        (component) => component.TodayComponent
      ),
  },
];
