import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AlertSeverity } from '../enums/alert-severity.enum';
import { AppIconComponent } from '../icon/app-icon.component';
import { AppIconButtonComponent } from '../icon-button/app-icon-button.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [AppIconComponent, AppIconButtonComponent],
  templateUrl: './app-alert.component.html',
  styleUrl: './app-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAlertComponent {
  readonly severity = input<AlertSeverity>(AlertSeverity.Info);
  readonly title = input<string | null>(null);
  readonly dismissible = input<boolean>(false);
  readonly dismissed = output<void>();

  protected readonly severityClass = computed(() => `app-alert--${this.severity()}`);
  protected readonly iconName = computed(() => {
    switch (this.severity()) {
      case AlertSeverity.Success:
        return 'check_circle';
      case AlertSeverity.Warning:
        return 'warning';
      case AlertSeverity.Error:
        return 'error';
      case AlertSeverity.Info:
      default:
        return 'info';
    }
  });
}
