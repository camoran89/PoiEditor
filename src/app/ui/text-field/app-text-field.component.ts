import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldType } from '../enums/text-field-type.enum';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './app-text-field.component.html',
  styleUrl: './app-text-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTextFieldComponent {
  readonly label = input.required<string>();
  readonly value = input<string>('');
  readonly type = input<TextFieldType>(TextFieldType.Text);
  readonly hint = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  readonly valueChanged = output<string>();
  readonly blurred = output<void>();

  protected onInput(event: Event): void {
    this.valueChanged.emit((event.target as HTMLInputElement).value);
  }
}
