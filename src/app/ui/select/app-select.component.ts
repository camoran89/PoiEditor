import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SelectOption } from '../interfaces/select-option.interface';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './app-select.component.html',
  styleUrl: './app-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSelectComponent<T extends string = string> {
  readonly label = input.required<string>();
  readonly value = input<T | ''>('');
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly required = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select…');

  readonly valueChanged = output<T>();

  protected onSelectionChange(value: T): void {
    this.valueChanged.emit(value);
  }
}
