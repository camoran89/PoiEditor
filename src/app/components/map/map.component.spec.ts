import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MapComponent } from './map.component';
import { MapStyleProviderService } from '../../services/map-style-provider.service';
import { MapInitializer } from './helpers/map-initializer.helper';
import { GeoJsonType } from '../../core/enums/geojson-type.enum';

const emptyCollection = { type: GeoJsonType.FeatureCollection, features: [] };

describe('MapComponent', () => {
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    vi.spyOn(MapInitializer.prototype, 'initialize').mockReturnValue({
      on: vi.fn(),
      getCanvas: vi.fn().mockReturnValue({ style: {} }),
      remove: vi.fn(),
    } as never);

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MapStyleProviderService, useValue: { build: vi.fn().mockReturnValue({}) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MapComponent);
    fixture.componentRef.setInput('collection', emptyCollection);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('defaults addModeEnabled to false', () => {
    expect(fixture.componentInstance.addModeEnabled()).toBe(false);
  });

  it('declares mapClicked output', () => {
    expect(fixture.componentInstance.mapClicked).toBeDefined();
  });

  it('declares featureClicked output', () => {
    expect(fixture.componentInstance.featureClicked).toBeDefined();
  });

  it('declares featureMoved output', () => {
    expect(fixture.componentInstance.featureMoved).toBeDefined();
  });
});
