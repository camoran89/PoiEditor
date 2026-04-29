import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardAppearance, MatCardModule } from '@angular/material/card';
import { AppearanceVariant } from '../enums/appearance-variant.enum';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCardComponent {
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly appearance = input<AppearanceVariant>(AppearanceVariant.Outlined);
  readonly hasFooter = input<boolean>(false);

  protected readonly materialAppearance = computed<MatCardAppearance>(() =>
    this.appearance() === AppearanceVariant.Outlined ? 'outlined' : 'raised'
  );
}
