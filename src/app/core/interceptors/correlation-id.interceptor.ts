import { HttpInterceptorFn } from '@angular/common/http';

function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: { 'X-Correlation-Id': generateCorrelationId() },
  });
  return next(req);
};
