import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './app-icon.component.html',
  styleUrl: './app-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIconComponent {
  readonly name = input.required<string>();
}
