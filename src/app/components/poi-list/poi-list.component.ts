import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FeatureId } from '../../core/types/feature-id.type';
import { PoiFeature } from '../../core/interfaces/poi-feature.interface';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';
import { CoordinatesPipe } from '../../pipes/coordinates.pipe';
import { AppCardComponent } from '../../ui/card/app-card.component';
import { AppChipComponent } from '../../ui/chip/app-chip.component';
import { AppEmptyStateComponent } from '../../ui/empty-state/app-empty-state.component';
import { AppIconButtonComponent } from '../../ui/icon-button/app-icon-button.component';

@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [
    CategoryLabelPipe,
    CoordinatesPipe,
    AppCardComponent,
    AppChipComponent,
    AppEmptyStateComponent,
    AppIconButtonComponent,
  ],
  templateUrl: './poi-list.component.html',
  styleUrl: './poi-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiListComponent {
  readonly features = input.required<readonly PoiFeature[]>();
  readonly editRequested = output<FeatureId>();
  readonly deleteRequested = output<FeatureId>();
}
