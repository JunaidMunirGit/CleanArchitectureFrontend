import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, { duration: 4000, panelClass: ['snack-success'] });
  }

  error(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, { duration: 6000, panelClass: ['snack-error'] });
  }
}
