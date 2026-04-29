import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonType } from '../enums/button-type.enum';
import { ButtonVariant } from '../enums/button-variant.enum';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, NgTemplateOutlet],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  readonly variant = input<ButtonVariant>(ButtonVariant.Primary);
  readonly type = input<ButtonType>(ButtonType.Button);
  readonly disabled = input<boolean>(false);
  readonly ariaPressed = input<boolean | null>(null);
  readonly clicked = output<MouseEvent>();
}
