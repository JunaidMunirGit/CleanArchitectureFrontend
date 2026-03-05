import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { publicGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'pos',
    loadComponent: () =>
      import('./features/pos/layout/pos-shell/pos-shell.component').then((m) => m.PosShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/pos/pages/pos-analytics-page/pos-analytics-page.component').then((m) => m.PosAnalyticsPageComponent),
      },
      {
        path: 'withdrawal',
        loadComponent: () =>
          import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent),
      },
      {
        path: 'dishes',
        loadComponent: () =>
          import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent),
      },
      {
        path: 'payment',
        loadComponent: () =>
          import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent),
      },
      {
        path: 'tables',
        children: [
          { path: 'booked', loadComponent: () => import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent) },
          { path: 'actived', loadComponent: () => import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent) },
          { path: 'running', loadComponent: () => import('./features/pos/pages/pos-placeholder/pos-placeholder.component').then((m) => m.PosPlaceholderComponent) },
        ],
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
      },
      {
        path: 'branches',
        loadChildren: () =>
          import('./features/branches/branches.routes').then((m) => m.BRANCHES_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
