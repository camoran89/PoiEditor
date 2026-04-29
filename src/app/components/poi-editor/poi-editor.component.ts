import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoiUpdateInput } from '../../core/interfaces/poi-update-input.interface';
import { CoordinatesPipe } from '../../pipes/coordinates.pipe';
import { AppButtonComponent } from '../../ui/button/app-button.component';
import { AppDialogShellComponent } from '../../ui/dialog-shell/app-dialog-shell.component';
import { AppTextFieldComponent } from '../../ui/text-field/app-text-field.component';
import { ButtonVariant } from '../../ui/enums/button-variant.enum';
import { PoiEditorDialogData } from './poi-editor-dialog-data.interface';

@Component({
  selector: 'app-poi-editor',
  standalone: true,
  imports: [
    AppDialogShellComponent,
    AppTextFieldComponent,
    AppButtonComponent,
    CoordinatesPipe,
  ],
  templateUrl: './poi-editor.component.html',
  styleUrl: './poi-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiEditorComponent {
  protected readonly data = inject<PoiEditorDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<PoiEditorComponent, PoiUpdateInput>>(MatDialogRef);

  protected readonly primaryVariant = ButtonVariant.Primary;
  protected readonly name = signal<string>(this.data.initialName);
  protected readonly category = signal<string>(this.data.initialCategory);
  protected readonly canSubmit = computed(
    () => this.name().trim().length > 0 && this.category().trim().length > 0
  );

  protected get title(): string {
    return this.data.isCreation ? 'New point' : 'Edit point';
  }

  protected onSubmit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.dialogRef.close({
      name: this.name().trim(),
      category: this.category().trim(),
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
