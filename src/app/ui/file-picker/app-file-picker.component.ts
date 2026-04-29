import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AppButtonComponent } from '../button/app-button.component';
import { ButtonVariant } from '../enums/button-variant.enum';

@Component({
  selector: 'app-file-picker',
  standalone: true,
  imports: [AppButtonComponent],
  templateUrl: './app-file-picker.component.html',
  styleUrl: './app-file-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppFilePickerComponent {
  readonly accept = input<string>('*/*');
  readonly variant = input<ButtonVariant>(ButtonVariant.Primary);
  readonly fileSelected = output<File>();

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected triggerPicker(): void {
    this.fileInput().nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
    target.value = '';
  }
}
