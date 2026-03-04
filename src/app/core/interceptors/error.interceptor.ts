import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  type?: string;
  errors?: Record<string, string[]>;
}

function toMessage(err: HttpErrorResponse): string {
  const body = err.error as ProblemDetails | null;
  if (body?.detail) return body.detail;
  if (body?.title) return body.title;
  if (err.status === 0) return 'Network error. Please check your connection.';
  if (err.status >= 500) return 'Server error. Please try again later.';
  return err.message || 'An error occurred.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = toMessage(err);
      notification.error(message);
      return throwError(() => err);
    })
  );
};
