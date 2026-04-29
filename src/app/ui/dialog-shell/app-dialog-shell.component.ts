import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-shell',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './app-dialog-shell.component.html',
  styleUrl: './app-dialog-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDialogShellComponent {
  readonly title = input.required<string>();
}
