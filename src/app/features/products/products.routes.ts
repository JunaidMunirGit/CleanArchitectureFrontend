import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/product-list/product-list.component').then((m) => m.ProductListComponent) },
  { path: 'new', loadComponent: () => import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent) },
  { path: 'bulk', loadComponent: () => import('./pages/bulk-import/bulk-import.component').then((m) => m.BulkImportComponent) },
  { path: 'barcode', loadComponent: () => import('./pages/barcode-lookup/barcode-lookup.component').then((m) => m.BarcodeLookupComponent) },
  { path: ':id/edit', loadComponent: () => import('./pages/product-form/product-form.component').then((m) => m.ProductFormComponent) },
  { path: ':id/prices', loadComponent: () => import('./pages/branch-price-editor/branch-price-editor.component').then((m) => m.BranchPriceEditorComponent) },
];
