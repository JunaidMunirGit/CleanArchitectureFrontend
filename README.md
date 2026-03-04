# POS Frontend (Angular)

Enterprise Angular frontend for the Clean Architecture .NET backend. Consumes Product APIs under `/api/v1/products`.

## Structure

- **core** – API client, HTTP interceptors (auth, correlation id, error, loading), layout shell
- **shared** – Notification service, reusable UI (extend as needed)
- **features/products** – List (table + pagination + filters), create/edit form, bulk import, barcode lookup, branch price editor
- **features/branches** – Placeholder for future branch management

## Tech

- Angular 19, Standalone APIs
- Angular Material (table, paginator, cards, forms, snackbar)
- Reactive Forms, typed models matching backend DTOs
- Lightweight RxJS-based store per feature (no NgRx)
- Lazy-loaded feature routes

## Run

1. **Backend**  
   Run the .NET API (e.g. `dotnet run` in `src/Web.Api`). Default: `https://localhost:5001`.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   App is at `http://localhost:4200`. Proxy forwards `/api` to `https://localhost:5001`.

## Build

```bash
npm run build
```

## Auth (placeholder)

The auth interceptor sends `Authorization: Bearer <token>` if `localStorage.auth_token` is set. To test with a real token, log in via the backend (e.g. `/users/login`), then set `localStorage.setItem('auth_token', '<jwt>')` in the browser console.

## Key files

| Area | Path |
|------|------|
| Routes + shell | `src/app/app.routes.ts`, `core/layout/shell/shell.component.ts` |
| Interceptors | `core/interceptors/*.ts` |
| Product API | `features/products/data-access/products-api.service.ts` |
| Product store | `features/products/data-access/products.store.ts` |
| Product list | `features/products/pages/product-list/`, `features/products/ui/product-list-table/` |
| Product form | `features/products/pages/product-form/` |
| Bulk import | `features/products/pages/bulk-import/` |
| Barcode lookup | `features/products/pages/barcode-lookup/` |
| Branch prices | `features/products/pages/branch-price-editor/` |
