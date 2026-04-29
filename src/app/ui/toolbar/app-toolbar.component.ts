import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './app-toolbar.component.html',
  styleUrl: './app-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {
  readonly title = input<string | null>(null);
}
