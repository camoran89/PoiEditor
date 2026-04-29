import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonType } from '../enums/button-type.enum';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [MatButtonModule, AppIconComponent],
  templateUrl: './app-icon-button.component.html',
  styleUrl: './app-icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconButtonComponent {
  readonly icon = input.required<string>();
  readonly ariaLabel = input.required<string>();
  readonly type = input<ButtonType>(ButtonType.Button);
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();
}
