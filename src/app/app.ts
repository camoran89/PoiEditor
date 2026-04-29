import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CoordinatesSnapper } from './core/helpers/coordinates-snapper.helper';
import { FeatureCollectionFactory } from './core/helpers/feature-collection-factory.helper';
import { PoiCategoriesExtractor } from './core/helpers/poi-categories-extractor.helper';
import { PoiFilterMatcher } from './core/helpers/poi-filter-matcher.helper';
import { Coordinates } from './core/types/coordinates.type';
import { FeatureId } from './core/types/feature-id.type';
import { ImportSummary } from './core/interfaces/import-summary.interface';
import { PoiUpdateInput } from './core/interfaces/poi-update-input.interface';
import { ActionsBarComponent } from './components/actions-bar/actions-bar.component';
import { ImportSummaryComponent } from './components/import-summary/import-summary.component';
import { MapComponent } from './components/map/map.component';
import { PoiCreationDialogService } from './components/poi-editor/poi-creation-dialog.service';
import { PoiEditorComponent } from './components/poi-editor/poi-editor.component';
import { PoiEditorDialogData } from './components/poi-editor/poi-editor-dialog-data.interface';
import { PoiFilterComponent } from './components/poi-filter/poi-filter.component';
import { PoiListComponent } from './components/poi-list/poi-list.component';
import { GeoJsonExporterService } from './services/geojson-exporter.service';
import { GeoJsonImporterService } from './services/geojson-importer.service';
import { ImportSummaryService } from './services/import-summary.service';
import { PersistenceService } from './services/persistence.service';
import { PoiStoreService } from './services/poi-store.service';
import { AppToolbarComponent } from './ui/toolbar/app-toolbar.component';
import { ConfirmDestructiveService } from './ui/services/confirm-destructive.service';
import { DialogService } from './ui/services/dialog.service';
import { NotificationService } from './ui/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AppToolbarComponent,
    ActionsBarComponent,
    MapComponent,
    PoiFilterComponent,
    PoiListComponent,
    ImportSummaryComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly store = inject(PoiStoreService);
  private readonly importer = inject(GeoJsonImporterService);
  private readonly exporter = inject(GeoJsonExporterService);
  private readonly persistence = inject(PersistenceService);
  private readonly summaryService = inject(ImportSummaryService);
  private readonly dialogs = inject(DialogService);
  private readonly notifications = inject(NotificationService);
  private readonly confirmService = inject(ConfirmDestructiveService);
  private readonly creationDialog = inject(PoiCreationDialogService);

  private readonly filterMatcher = new PoiFilterMatcher();
  private readonly categoriesExtractor = new PoiCategoriesExtractor();
  private readonly collectionFactory = new FeatureCollectionFactory();
  private readonly snapper = new CoordinatesSnapper();

  protected readonly addModeEnabled = signal<boolean>(false);
  protected readonly snapEnabled = signal<boolean>(false);
  protected readonly searchQuery = signal<string>('');
  protected readonly categoryFilter = signal<string>('');
  protected readonly importSummary = signal<ImportSummary | null>(null);

  protected readonly categories = computed<readonly string[]>(() =>
    this.categoriesExtractor.extract(this.store.features())
  );

  protected readonly filteredFeatures = computed(() =>
    this.filterMatcher.apply(this.store.features(), {
      query: this.searchQuery(),
      category: this.categoryFilter(),
    })
  );

  protected readonly filteredCollection = computed(() =>
    this.collectionFactory.create(this.filteredFeatures())
  );

  ngOnInit(): void {
    const restored = this.persistence.load();
    if (restored !== null && restored.features.length > 0) {
      this.store.setAll(restored.features);
      this.notifications.notify(`Restored ${restored.features.length} saved point(s).`);
    }
  }

  protected toggleAddMode(): void {
    this.addModeEnabled.update((value) => !value);
  }

  protected toggleSnap(): void {
    this.snapEnabled.update((value) => !value);
  }

  protected onSearchChanged(query: string): void {
    this.searchQuery.set(query);
  }

  protected onCategoryFilterChanged(category: string): void {
    this.categoryFilter.set(category);
  }

  protected dismissSummary(): void {
    this.importSummary.set(null);
  }

  protected async onImport(file: File): Promise<void> {
    try {
      const result = await this.importer.importFromFile(file);
      this.store.setAll(result.imported);
      this.importSummary.set(this.summaryService.summarize(result));
      this.notifications.notify(`Imported ${result.imported.length} point(s).`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import file.';
      this.notifications.notify(message);
    }
  }

  protected onExport(): void {
    if (this.store.count() === 0) {
      this.notifications.notify('Nothing to export.');
      return;
    }
    this.exporter.export(this.store.collection());
    this.notifications.notify('GeoJSON exported.');
  }

  protected onSave(): void {
    this.persistence.save(this.store.collection());
    this.notifications.notify('State saved locally.');
  }

  protected async onClear(): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      'Clear local state',
      'This removes all points and clears the saved state. Continue?',
      'Clear'
    );
    if (!confirmed) {
      return;
    }
    this.persistence.clear();
    this.store.clear();
    this.importSummary.set(null);
    this.notifications.notify('Local state cleared.');
  }

  protected async onMapClicked(coordinates: Coordinates): Promise<void> {
    const target = this.snapEnabled() ? this.snapper.snap(coordinates) : coordinates;
    const input = await this.creationDialog.open(target);
    if (input !== null) {
      this.store.add(input);
      this.addModeEnabled.set(false);
    }
  }

  protected async onFeatureClicked(id: FeatureId): Promise<void> {
    const feature = this.store.findById(id);
    if (!feature) {
      return;
    }
    const data: PoiEditorDialogData = {
      coordinates: feature.geometry.coordinates,
      initialName: feature.properties.name,
      initialCategory: feature.properties.category,
      isCreation: false,
    };
    const result = await firstValueFrom(
      this.dialogs.open<PoiEditorDialogData, PoiUpdateInput>({
        component: PoiEditorComponent,
        data,
      })
    );
    if (result) {
      this.store.update(id, result);
    }
  }

  protected async onDeleteRequested(id: FeatureId): Promise<void> {
    const feature = this.store.findById(id);
    if (!feature) {
      return;
    }
    const confirmed = await this.confirmService.confirm(
      'Delete point',
      `Delete "${feature.properties.name}"?`,
      'Delete'
    );
    if (confirmed) {
      this.store.remove(id);
    }
  }
}
