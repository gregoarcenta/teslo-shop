import { Routes } from '@angular/router';
import { noAuthGuard } from '@/core/guards/no-auth.guard';
import { authGuard } from '@/core/guards/auth.guard';
import { paymentSessionSuccessGuard } from '@/core/guards/payment-session-success.guard';

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
    path: 'orders',
    title: 'Orders - Teslo Shop',
    loadComponent: () => import('./pages/orders/orders.component'),
    canActivate: [authGuard],
  },
  {
    path: 'payment-success',
    title: 'Payment success - Teslo Shop',
    loadComponent: () => import('./pages/pay-success/pay-success.component'),
    canActivate: [paymentSessionSuccessGuard],
  },
  {
    path: '404',
    title: 'Page not found - Teslo Shop',
    loadComponent: () => import('./pages/not-found/not-found.component'),
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
    redirectTo: () => '404',
  },
];
