import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './app-chip.component.html',
  styleUrl: './app-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppChipComponent {
  readonly label = input.required<string>();
}
