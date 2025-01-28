import { Routes } from '@angular/router';
import { noAuthGuard } from '@/core/guards/no-auth.guard';
import { authGuard } from '@/core/guards/auth.guard';

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
    path: 'cart',
    title: 'Cart - Teslo Shop',
    loadComponent: () => import('./pages/cart/cart.component'),
    canActivate: [authGuard],
  },
  {
    path: ':slug',
    loadComponent: () => import('./pages/product/product.component'),
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
