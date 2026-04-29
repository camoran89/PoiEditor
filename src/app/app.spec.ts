import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { App } from './app';
import { MapInitializer } from './components/map/helpers/map-initializer.helper';
import { PoiStoreService } from './services/poi-store.service';
import { GeoJsonImporterService } from './services/geojson-importer.service';
import { GeoJsonExporterService } from './services/geojson-exporter.service';
import { PersistenceService } from './services/persistence.service';
import { ImportSummaryService } from './services/import-summary.service';
import { DialogService } from './ui/services/dialog.service';
import { NotificationService } from './ui/services/notification.service';
import { ConfirmDestructiveService } from './ui/services/confirm-destructive.service';
import { PoiCreationDialogService } from './components/poi-editor/poi-creation-dialog.service';
import { GeoJsonType } from './core/enums/geojson-type.enum';
import { DiscardReason } from './core/enums/discard-reason.enum';
import { PoiFeature } from './core/interfaces/poi-feature.interface';

const mockFeature = (id: string, name: string): PoiFeature => ({
  type: GeoJsonType.Feature,
  id,
  geometry: { type: GeoJsonType.Point, coordinates: [-70.6, -33.4] },
  properties: { name, category: 'park' },
});

const emptySummary = {
  importedCount: 0,
  discardedCount: 0,
  discardedByReason: Object.fromEntries(Object.values(DiscardReason).map((r) => [r, 0])) as never,
};

function makeServices() {
  const mockStore = {
    features: vi.fn().mockReturnValue([]),
    count: vi.fn().mockReturnValue(0),
    collection: vi.fn().mockReturnValue({ type: GeoJsonType.FeatureCollection, features: [] }),
    setAll: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    move: vi.fn(),
    clear: vi.fn(),
    findById: vi.fn().mockReturnValue(null),
  };
  return {
    mockStore,
    mockImporter: { importFromFile: vi.fn().mockResolvedValue({ imported: [], discarded: [] }) },
    mockExporter: { export: vi.fn() },
    mockPersistence: { load: vi.fn().mockReturnValue(null), save: vi.fn(), clear: vi.fn() },
    mockSummaryService: { summarize: vi.fn().mockReturnValue(emptySummary) },
    mockDialogs: { open: vi.fn().mockReturnValue(of(undefined)), closeAll: vi.fn() },
    mockNotifications: { notify: vi.fn() },
    mockConfirm: { confirm: vi.fn().mockResolvedValue(false) },
    mockCreationDialog: { open: vi.fn().mockResolvedValue(null) },
  };
}

describe('App component', () => {
  let fixture: ComponentFixture<App>;
  let services: ReturnType<typeof makeServices>;

  beforeEach(async () => {
    vi.spyOn(MapInitializer.prototype, 'initialize').mockReturnValue({
      on: vi.fn(), getCanvas: vi.fn().mockReturnValue({ style: {} }), remove: vi.fn(),
    } as never);
    services = makeServices();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNoopAnimations(),
        { provide: PoiStoreService, useValue: services.mockStore },
        { provide: GeoJsonImporterService, useValue: services.mockImporter },
        { provide: GeoJsonExporterService, useValue: services.mockExporter },
        { provide: PersistenceService, useValue: services.mockPersistence },
        { provide: ImportSummaryService, useValue: services.mockSummaryService },
        { provide: DialogService, useValue: services.mockDialogs },
        { provide: NotificationService, useValue: services.mockNotifications },
        { provide: ConfirmDestructiveService, useValue: services.mockConfirm },
        { provide: PoiCreationDialogService, useValue: services.mockCreationDialog },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ngOnInit does nothing when persistence returns null', () => {
    expect(services.mockStore.setAll).not.toHaveBeenCalled();
  });

  it('ngOnInit restores saved features when persistence returns data', async () => {
    const feature = mockFeature('poi-1', 'Park');
    services.mockPersistence.load.mockReturnValue({ type: GeoJsonType.FeatureCollection, features: [feature] });
    await TestBed.resetTestingModule();
    services = makeServices();
    services.mockPersistence.load.mockReturnValue({
      type: GeoJsonType.FeatureCollection,
      features: [mockFeature('poi-1', 'Park')],
    });
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNoopAnimations(),
        { provide: PoiStoreService, useValue: services.mockStore },
        { provide: GeoJsonImporterService, useValue: services.mockImporter },
        { provide: GeoJsonExporterService, useValue: services.mockExporter },
        { provide: PersistenceService, useValue: services.mockPersistence },
        { provide: ImportSummaryService, useValue: services.mockSummaryService },
        { provide: DialogService, useValue: services.mockDialogs },
        { provide: NotificationService, useValue: services.mockNotifications },
        { provide: ConfirmDestructiveService, useValue: services.mockConfirm },
        { provide: PoiCreationDialogService, useValue: services.mockCreationDialog },
      ],
    }).compileComponents();
    const fix = TestBed.createComponent(App);
    fix.detectChanges();
    expect(services.mockStore.setAll).toHaveBeenCalledOnce();
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('toggleAddMode flips the addModeEnabled signal', () => {
    const comp = fixture.componentInstance as unknown as { toggleAddMode: () => void; addModeEnabled: { (): boolean } };
    expect(comp.addModeEnabled()).toBe(false);
    comp.toggleAddMode();
    expect(comp.addModeEnabled()).toBe(true);
    comp.toggleAddMode();
    expect(comp.addModeEnabled()).toBe(false);
  });

  it('toggleSnap flips the snapEnabled signal', () => {
    const comp = fixture.componentInstance as unknown as { toggleSnap: () => void; snapEnabled: { (): boolean } };
    expect(comp.snapEnabled()).toBe(false);
    comp.toggleSnap();
    expect(comp.snapEnabled()).toBe(true);
  });

  it('onSearchChanged updates the searchQuery signal', () => {
    const comp = fixture.componentInstance as unknown as { onSearchChanged: (q: string) => void; searchQuery: { (): string } };
    comp.onSearchChanged('park');
    expect(comp.searchQuery()).toBe('park');
  });

  it('onCategoryFilterChanged updates the categoryFilter signal', () => {
    const comp = fixture.componentInstance as unknown as { onCategoryFilterChanged: (c: string) => void; categoryFilter: { (): string } };
    comp.onCategoryFilterChanged('museum');
    expect(comp.categoryFilter()).toBe('museum');
  });

  it('dismissSummary sets importSummary to null', () => {
    const comp = fixture.componentInstance as unknown as { dismissSummary: () => void; importSummary: { (): unknown } };
    comp.dismissSummary();
    expect(comp.importSummary()).toBeNull();
  });

  it('onExport notifies "nothing to export" when store is empty', () => {
    services.mockStore.count.mockReturnValue(0);
    const comp = fixture.componentInstance as unknown as { onExport: () => void };
    comp.onExport();
    expect(services.mockExporter.export).not.toHaveBeenCalled();
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onExport calls exporter when store has items', () => {
    services.mockStore.count.mockReturnValue(3);
    const comp = fixture.componentInstance as unknown as { onExport: () => void };
    comp.onExport();
    expect(services.mockExporter.export).toHaveBeenCalledOnce();
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onSave calls persistence.save and notifies', () => {
    const comp = fixture.componentInstance as unknown as { onSave: () => void };
    comp.onSave();
    expect(services.mockPersistence.save).toHaveBeenCalledOnce();
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onClear does nothing when confirm returns false', async () => {
    services.mockConfirm.confirm.mockResolvedValue(false);
    const comp = fixture.componentInstance as unknown as { onClear: () => Promise<void> };
    await comp.onClear();
    expect(services.mockStore.clear).not.toHaveBeenCalled();
  });

  it('onClear clears persistence and store when confirmed', async () => {
    services.mockConfirm.confirm.mockResolvedValue(true);
    const comp = fixture.componentInstance as unknown as { onClear: () => Promise<void> };
    await comp.onClear();
    expect(services.mockPersistence.clear).toHaveBeenCalledOnce();
    expect(services.mockStore.clear).toHaveBeenCalledOnce();
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onImport sets features and summary on success', async () => {
    const feature = mockFeature('poi-1', 'Park');
    services.mockImporter.importFromFile.mockResolvedValue({ imported: [feature], discarded: [] });
    services.mockSummaryService.summarize.mockReturnValue({ ...emptySummary, importedCount: 1 });
    const comp = fixture.componentInstance as unknown as { onImport: (f: File) => Promise<void>; importSummary: { (): unknown } };
    await comp.onImport(new File(['{}'], 'f.geojson'));
    expect(services.mockStore.setAll).toHaveBeenCalledWith([feature]);
    expect(comp.importSummary()).toMatchObject({ importedCount: 1 });
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onImport notifies on import error', async () => {
    services.mockImporter.importFromFile.mockRejectedValue(new Error('parse error'));
    const comp = fixture.componentInstance as unknown as { onImport: (f: File) => Promise<void> };
    await comp.onImport(new File([''], 'f.geojson'));
    expect(services.mockNotifications.notify).toHaveBeenCalledOnce();
  });

  it('onFeatureMoved calls store.move', () => {
    const comp = fixture.componentInstance as unknown as { onFeatureMoved: (e: { featureId: string; coordinates: [number, number] }) => void };
    comp.onFeatureMoved({ featureId: 'poi-1', coordinates: [-70.0, -33.0] });
    expect(services.mockStore.move).toHaveBeenCalledWith('poi-1', [-70.0, -33.0]);
  });

  it('onMapClicked opens creation dialog and adds POI on success', async () => {
    services.mockCreationDialog.open.mockResolvedValue({ coordinates: [-70.6, -33.4], name: 'New', category: 'park' });
    const comp = fixture.componentInstance as unknown as { onMapClicked: (c: [number, number]) => Promise<void>; addModeEnabled: { set: (v: boolean) => void; (): boolean } };
    await comp.onMapClicked([-70.6, -33.4]);
    expect(services.mockStore.add).toHaveBeenCalledOnce();
    expect(comp.addModeEnabled()).toBe(false);
  });

  it('onMapClicked does nothing when creation dialog is cancelled', async () => {
    services.mockCreationDialog.open.mockResolvedValue(null);
    const comp = fixture.componentInstance as unknown as { onMapClicked: (c: [number, number]) => Promise<void> };
    await comp.onMapClicked([-70.6, -33.4]);
    expect(services.mockStore.add).not.toHaveBeenCalled();
  });

  it('onFeatureClicked opens edit dialog and updates store when result given', async () => {
    const feature = mockFeature('poi-1', 'Park');
    services.mockStore.findById.mockReturnValue(feature);
    services.mockDialogs.open.mockReturnValue(of({ name: 'Updated', category: 'museum' }));
    const comp = fixture.componentInstance as unknown as { onFeatureClicked: (id: string) => Promise<void> };
    await comp.onFeatureClicked('poi-1');
    expect(services.mockStore.update).toHaveBeenCalledWith('poi-1', { name: 'Updated', category: 'museum' });
  });

  it('onFeatureClicked does nothing when feature is not found', async () => {
    services.mockStore.findById.mockReturnValue(null);
    const comp = fixture.componentInstance as unknown as { onFeatureClicked: (id: string) => Promise<void> };
    await comp.onFeatureClicked('missing');
    expect(services.mockDialogs.open).not.toHaveBeenCalled();
  });

  it('onDeleteRequested removes feature when confirmed', async () => {
    const feature = mockFeature('poi-1', 'Park');
    services.mockStore.findById.mockReturnValue(feature);
    services.mockConfirm.confirm.mockResolvedValue(true);
    const comp = fixture.componentInstance as unknown as { onDeleteRequested: (id: string) => Promise<void> };
    await comp.onDeleteRequested('poi-1');
    expect(services.mockStore.remove).toHaveBeenCalledWith('poi-1');
  });

  it('onDeleteRequested does not remove when cancelled', async () => {
    const feature = mockFeature('poi-1', 'Park');
    services.mockStore.findById.mockReturnValue(feature);
    services.mockConfirm.confirm.mockResolvedValue(false);
    const comp = fixture.componentInstance as unknown as { onDeleteRequested: (id: string) => Promise<void> };
    await comp.onDeleteRequested('poi-1');
    expect(services.mockStore.remove).not.toHaveBeenCalled();
  });
});
