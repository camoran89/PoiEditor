import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PoiCategoryOptionsFactory } from '../../core/helpers/poi-category-options-factory.helper';
import { PoiCategory } from '../../core/types/poi-category.type';
import { PoiUpdateInput } from '../../core/interfaces/poi-update-input.interface';
import { CoordinatesPipe } from '../../pipes/coordinates.pipe';
import { AppButtonComponent } from '../../ui/button/app-button.component';
import { AppDialogShellComponent } from '../../ui/dialog-shell/app-dialog-shell.component';
import { AppSelectComponent } from '../../ui/select/app-select.component';
import { AppTextFieldComponent } from '../../ui/text-field/app-text-field.component';
import { ButtonVariant } from '../../ui/enums/button-variant.enum';
import { SelectOption } from '../../ui/interfaces/select-option.interface';
import { PoiEditorDialogData } from './poi-editor-dialog-data.interface';

@Component({
  selector: 'app-poi-editor',
  standalone: true,
  imports: [
    AppDialogShellComponent,
    AppTextFieldComponent,
    AppSelectComponent,
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

  private readonly categoryOptionsFactory = new PoiCategoryOptionsFactory();
  protected readonly categoryOptions: readonly SelectOption<PoiCategory>[] =
    this.categoryOptionsFactory.build();

  protected readonly primaryVariant = ButtonVariant.Primary;
  protected readonly name = signal<string>(this.data.initialName);
  protected readonly category = signal<PoiCategory | ''>(
    this.data.initialCategory as PoiCategory | ''
  );
  protected readonly canSubmit = computed(
    () => this.name().trim().length > 0 && this.category().length > 0
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
      category: this.category() as PoiCategory,
    });
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
