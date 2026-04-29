import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { GeoJsonType } from '../core/enums/geojson-type.enum';
import { PoiStoreService } from './poi-store.service';

describe('PoiStoreService', () => {
  let store: PoiStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(PoiStoreService);
  });

  it('starts empty', () => {
    expect(store.count()).toBe(0);
    expect(store.features()).toEqual([]);
  });

  it('adds a feature and returns it', () => {
    const feature = store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    expect(feature.type).toBe(GeoJsonType.Feature);
    expect(store.count()).toBe(1);
    expect(store.features()[0]).toBe(feature);
  });

  it('updates a feature by id', () => {
    const feature = store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    store.update(feature.id, { name: 'B', category: 'landmark' });
    const updated = store.findById(feature.id);
    expect(updated?.properties.name).toBe('B');
    expect(updated?.properties.category).toBe('landmark');
  });

  it('moves a feature', () => {
    const feature = store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    store.move(feature.id, [10, 20]);
    expect(store.findById(feature.id)?.geometry.coordinates).toEqual([10, 20]);
  });

  it('removes a feature by id', () => {
    const feature = store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    store.remove(feature.id);
    expect(store.count()).toBe(0);
  });

  it('clears all features', () => {
    store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    store.add({ coordinates: [1, 1], name: 'B', category: 'park' });
    store.clear();
    expect(store.count()).toBe(0);
  });

  it('exposes a FeatureCollection through computed collection()', () => {
    store.add({ coordinates: [0, 0], name: 'A', category: 'park' });
    const collection = store.collection();
    expect(collection.type).toBe('FeatureCollection');
    expect(collection.features).toHaveLength(1);
  });
});
