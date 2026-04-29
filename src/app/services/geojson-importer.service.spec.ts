import { describe, it, expect } from 'vitest';
import { GeoJsonImporterService } from './geojson-importer.service';
import { GeoJsonType } from '../core/enums/geojson-type.enum';
import { DiscardReason } from '../core/enums/discard-reason.enum';

describe('GeoJsonImporterService', () => {
  const service = new GeoJsonImporterService();

  const validFeature = {
    type: 'Feature',
    id: 'poi-1',
    geometry: { type: 'Point', coordinates: [-70.6, -33.4] },
    properties: { name: 'Test', category: 'park' },
  };

  const validCollection = JSON.stringify({
    type: GeoJsonType.FeatureCollection,
    features: [validFeature],
  });

  it('imports all valid features', () => {
    const result = service.importFromText(validCollection);
    expect(result.imported).toHaveLength(1);
    expect(result.discarded).toHaveLength(0);
  });

  it('throws for non-FeatureCollection JSON', () => {
    expect(() => service.importFromText('{"type":"Feature"}')).toThrow();
  });

  it('throws for invalid JSON', () => {
    expect(() => service.importFromText('{bad}')).toThrow();
  });

  it('discards invalid features and keeps valid ones', () => {
    const mixed = JSON.stringify({
      type: GeoJsonType.FeatureCollection,
      features: [validFeature, { type: 'Bogus' }],
    });
    const result = service.importFromText(mixed);
    expect(result.imported).toHaveLength(1);
    expect(result.discarded).toHaveLength(1);
    expect(result.discarded[0].reason).toBe(DiscardReason.NotAFeature);
  });

  it('records the index of discarded features', () => {
    const mixed = JSON.stringify({
      type: GeoJsonType.FeatureCollection,
      features: [{ type: 'Bad' }, validFeature],
    });
    const result = service.importFromText(mixed);
    expect(result.discarded[0].index).toBe(0);
  });
});
