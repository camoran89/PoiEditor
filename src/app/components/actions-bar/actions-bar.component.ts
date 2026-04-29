import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppButtonComponent } from '../../ui/button/app-button.component';
import { AppFilePickerComponent } from '../../ui/file-picker/app-file-picker.component';
import { ButtonVariant } from '../../ui/enums/button-variant.enum';

@Component({
  selector: 'app-actions-bar',
  standalone: true,
  imports: [AppButtonComponent, AppFilePickerComponent],
  templateUrl: './actions-bar.component.html',
  styleUrl: './actions-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsBarComponent {
  protected readonly primaryVariant = ButtonVariant.Primary;
  protected readonly secondaryVariant = ButtonVariant.Secondary;
  protected readonly dangerVariant = ButtonVariant.Danger;

  readonly addModeEnabled = input<boolean>(false);
  readonly snapEnabled = input<boolean>(false);

  readonly importRequested = output<File>();
  readonly exportRequested = output<void>();
  readonly saveRequested = output<void>();
  readonly clearRequested = output<void>();
  readonly addModeToggled = output<void>();
  readonly snapToggled = output<void>();
}
