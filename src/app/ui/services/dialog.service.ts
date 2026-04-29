import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogOpenOptions } from '../interfaces/dialog-open-options.interface';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly matDialog = inject(MatDialog);

  open<TData, TResult>(options: DialogOpenOptions<TData>): Observable<TResult | undefined> {
    const ref = this.matDialog.open<unknown, TData, TResult>(options.component, {
      data: options.data,
      width: options.width ?? '420px',
      autoFocus: 'first-tabbable',
    });
    return ref.afterClosed();
  }

  closeAll(): void {
    this.matDialog.closeAll();
  }
}
