import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfirmDialogComponent } from '../confirm-dialog/app-confirm-dialog.component';
import { ButtonVariant } from '../enums/button-variant.enum';
import { ConfirmDialogData } from '../interfaces/confirm-dialog-data.interface';
import { DialogService } from './dialog.service';

@Injectable({ providedIn: 'root' })
export class ConfirmDestructiveService {
  private readonly dialogs = inject(DialogService);

  async confirm(title: string, message: string, confirmLabel: string): Promise<boolean> {
    const data: ConfirmDialogData = {
      title,
      message,
      confirmLabel,
      confirmVariant: ButtonVariant.Danger,
    };
    const result = await firstValueFrom(
      this.dialogs.open<ConfirmDialogData, boolean>({
        component: AppConfirmDialogComponent,
        data,
      })
    );
    return result === true;
  }
}
