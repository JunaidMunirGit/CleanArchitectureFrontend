import { Routes } from '@angular/router';

export const BRANCHES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./branches-placeholder.component').then((m) => m.BranchesPlaceholderComponent) },
];
