import { Routes } from '@angular/router';
import { noAuthGuard } from '@/core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: () => '',
  },
];
