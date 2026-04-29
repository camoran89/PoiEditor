import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PersistenceService } from './persistence.service';
import { STORAGE_DRIVER } from '../core/tokens/storage-driver.token';
import { StorageDriver } from '../core/interfaces/storage-driver.interface';
import { GeoJsonType } from '../core/enums/geojson-type.enum';
import { PoiFeatureCollection } from '../core/interfaces/poi-feature-collection.interface';

describe('PersistenceService', () => {
  let service: PersistenceService;
  let fakeStorage: Record<string, string>;

  const inMemoryDriver: StorageDriver = {
    read: (key: string) => fakeStorage[key] ?? null,
    write: (key: string, value: string) => { fakeStorage[key] = value; },
    remove: (key: string) => { delete fakeStorage[key]; },
  };

  const collection: PoiFeatureCollection = {
    type: GeoJsonType.FeatureCollection,
    features: [{
      type: GeoJsonType.Feature,
      id: 'poi-1',
      geometry: { type: GeoJsonType.Point, coordinates: [-70.6, -33.4] },
      properties: { name: 'Test', category: 'park' },
    }],
  };

  beforeEach(() => {
    fakeStorage = {};
    TestBed.configureTestingModule({
      providers: [{ provide: STORAGE_DRIVER, useValue: inMemoryDriver }],
    });
    service = TestBed.inject(PersistenceService);
  });

  it('returns null when nothing is saved', () => {
    expect(service.load()).toBeNull();
  });

  it('save and load round-trips a valid collection', () => {
    service.save(collection);
    const loaded = service.load();
    expect(loaded?.features).toHaveLength(1);
    expect(loaded?.features[0].properties.name).toBe('Test');
  });

  it('returns null when stored JSON is invalid', () => {
    inMemoryDriver.write('poi_editor_state', '{bad json}');
    expect(service.load()).toBeNull();
  });

  it('returns null when stored JSON is not a FeatureCollection', () => {
    inMemoryDriver.write('poi_editor_state', '{"type":"Feature"}');
    expect(service.load()).toBeNull();
  });

  it('skips invalid features in stored collection', () => {
    const withInvalid = JSON.stringify({
      type: GeoJsonType.FeatureCollection,
      features: [
        collection.features[0],
        { type: 'Bogus' },
      ],
    });
    inMemoryDriver.write('poi_editor_state', withInvalid);
    const loaded = service.load();
    expect(loaded?.features).toHaveLength(1);
  });

  it('clear removes the stored entry', () => {
    service.save(collection);
    service.clear();
    expect(service.load()).toBeNull();
  });
});
