import { Routes } from '@angular/router';
import { noAuthGuard } from '@/core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login - Teslo Shop',
    loadComponent: () => import('./pages/auth/auth.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    title: 'Register - Teslo Shop',
    loadComponent: () => import('./pages/register/register.component'),
    canActivate: [noAuthGuard],
  },
  {
    path: '',
    title: 'Home - Teslo Shop',
    loadComponent: () => import('./pages/home/home.component'),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: () => '',
  },
];
