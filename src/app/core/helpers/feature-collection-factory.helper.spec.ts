import { describe, it, expect } from 'vitest';
import { FeatureCollectionFactory } from './feature-collection-factory.helper';
import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeature } from '../interfaces/poi-feature.interface';

describe('FeatureCollectionFactory', () => {
  const factory = new FeatureCollectionFactory();

  const feature: PoiFeature = {
    type: GeoJsonType.Feature,
    id: 'poi-1',
    geometry: { type: GeoJsonType.Point, coordinates: [0, 0] },
    properties: { name: 'Test', category: 'park' },
  };

  it('creates a FeatureCollection with the correct type', () => {
    const result = factory.create([feature]);
    expect(result.type).toBe(GeoJsonType.FeatureCollection);
  });

  it('includes the provided features array', () => {
    const result = factory.create([feature]);
    expect(result.features).toHaveLength(1);
    expect(result.features[0]).toBe(feature);
  });

  it('creates an empty FeatureCollection from an empty array', () => {
    const result = factory.create([]);
    expect(result.features).toHaveLength(0);
  });
});
