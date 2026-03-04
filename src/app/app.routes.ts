import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
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
  { path: '**', redirectTo: 'products' },
];
