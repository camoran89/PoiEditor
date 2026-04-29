import { describe, it, expect } from 'vitest';
import { GeoJsonStringifier } from './geojson-stringifier.helper';
import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeatureCollection } from '../interfaces/poi-feature-collection.interface';

describe('GeoJsonStringifier', () => {
  const stringifier = new GeoJsonStringifier();

  const collection: PoiFeatureCollection = {
    type: GeoJsonType.FeatureCollection,
    features: [],
  };

  it('produces valid JSON', () => {
    expect(() => JSON.parse(stringifier.stringify(collection))).not.toThrow();
  });

  it('round-trips a collection', () => {
    const result = JSON.parse(stringifier.stringify(collection));
    expect(result.type).toBe(GeoJsonType.FeatureCollection);
    expect(result.features).toEqual([]);
  });

  it('uses indentation (pretty-print)', () => {
    const str = stringifier.stringify(collection);
    expect(str).toContain('\n');
  });
});
