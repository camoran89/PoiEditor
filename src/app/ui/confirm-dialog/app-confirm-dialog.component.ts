import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent } from '../button/app-button.component';
import { AppDialogShellComponent } from '../dialog-shell/app-dialog-shell.component';
import { ButtonVariant } from '../enums/button-variant.enum';
import { ConfirmDialogData } from '../interfaces/confirm-dialog-data.interface';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [AppDialogShellComponent, AppButtonComponent],
  templateUrl: './app-confirm-dialog.component.html',
  styleUrl: './app-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<AppConfirmDialogComponent, boolean>>(MatDialogRef);

  protected get confirmVariant(): ButtonVariant {
    return this.data.confirmVariant ?? ButtonVariant.Primary;
  }

  protected onConfirm(): void {
    this.dialogRef.close(true);
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
