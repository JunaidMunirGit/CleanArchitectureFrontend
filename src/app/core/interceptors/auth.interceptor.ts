import { HttpInterceptorFn } from '@angular/common/http';

/** Placeholder: inject token from auth service when implemented. */
const getToken = (): string | null => {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
