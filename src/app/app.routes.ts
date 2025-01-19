import { Routes } from '@angular/router';
import { noAuthGuard } from '@/core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: '**',
    redirectTo: () => 'home',
  },
];
