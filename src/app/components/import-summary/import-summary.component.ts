import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DISCARD_REASON_DISPLAY_ORDER } from '../../core/constants/discard-reason-display-order.const';
import { DiscardBreakdownItem } from '../../core/interfaces/discard-breakdown-item.interface';
import { ImportSummary } from '../../core/interfaces/import-summary.interface';
import { DiscardReasonLabeler } from '../../core/helpers/discard-reason-labeler.helper';
import { AppAlertComponent } from '../../ui/alert/app-alert.component';
import { AppChipComponent } from '../../ui/chip/app-chip.component';
import { AlertSeverity } from '../../ui/enums/alert-severity.enum';

@Component({
  selector: 'app-import-summary',
  standalone: true,
  imports: [AppAlertComponent, AppChipComponent],
  templateUrl: './import-summary.component.html',
  styleUrl: './import-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSummaryComponent {
  private readonly labeler = new DiscardReasonLabeler();

  readonly summary = input.required<ImportSummary>();
  readonly dismissed = output<void>();

  protected readonly severity = computed<AlertSeverity>(() =>
    this.summary().discardedCount === 0 ? AlertSeverity.Success : AlertSeverity.Warning
  );

  protected readonly breakdown = computed<readonly DiscardBreakdownItem[]>(() => {
    const map = this.summary().discardedByReason;
    const items: DiscardBreakdownItem[] = [];
    for (const reason of DISCARD_REASON_DISPLAY_ORDER) {
      const count = map[reason];
      if (count > 0) {
        items.push({ label: this.labeler.label(reason), count });
      }
    }
    return items;
  });
}
