import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  notify(message: string, durationMs = 3500): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: durationMs,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
