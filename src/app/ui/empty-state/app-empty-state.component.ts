import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIconComponent } from '../icon/app-icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './app-empty-state.component.html',
  styleUrl: './app-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEmptyStateComponent {
  readonly message = input.required<string>();
  readonly icon = input<string | null>(null);
}
