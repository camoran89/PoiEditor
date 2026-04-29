import { describe, it, expect } from 'vitest';
import { PoiCategoriesExtractor } from './poi-categories-extractor.helper';
import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeature } from '../interfaces/poi-feature.interface';

describe('PoiCategoriesExtractor', () => {
  const extractor = new PoiCategoriesExtractor();

  const feature = (id: string, category: string): PoiFeature => ({
    type: GeoJsonType.Feature,
    id,
    geometry: { type: GeoJsonType.Point, coordinates: [0, 0] },
    properties: { name: 'X', category },
  });

  it('returns empty array for empty input', () => {
    expect(extractor.extract([])).toEqual([]);
  });

  it('deduplicates categories', () => {
    const features = [feature('a', 'park'), feature('b', 'park'), feature('c', 'landmark')];
    expect(extractor.extract(features)).toHaveLength(2);
  });

  it('returns categories sorted alphabetically', () => {
    const features = [feature('a', 'park'), feature('b', 'landmark'), feature('c', 'cafe')];
    expect(extractor.extract(features)).toEqual(['cafe', 'landmark', 'park']);
  });

  it('includes every distinct category', () => {
    const features = [feature('a', 'museum'), feature('b', 'hotel')];
    const result = extractor.extract(features);
    expect(result).toContain('museum');
    expect(result).toContain('hotel');
  });
});
