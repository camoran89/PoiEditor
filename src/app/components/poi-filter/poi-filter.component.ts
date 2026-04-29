import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppChipComponent } from '../../ui/chip/app-chip.component';
import { AppTextFieldComponent } from '../../ui/text-field/app-text-field.component';

@Component({
  selector: 'app-poi-filter',
  standalone: true,
  imports: [AppChipComponent, AppTextFieldComponent],
  templateUrl: './poi-filter.component.html',
  styleUrl: './poi-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiFilterComponent {
  readonly query = input<string>('');
  readonly category = input<string>('');
  readonly categories = input.required<readonly string[]>();

  readonly queryChanged = output<string>();
  readonly categoryChanged = output<string>();

  protected readonly categoriesWithAll = computed<readonly string[]>(() => ['', ...this.categories()]);

  protected isSelected(category: string): boolean {
    return this.category() === category;
  }

  protected labelFor(category: string): string {
    return category.length === 0 ? 'All' : category;
  }

  protected onCategoryClicked(category: string): void {
    this.categoryChanged.emit(this.isSelected(category) ? '' : category);
  }
}
