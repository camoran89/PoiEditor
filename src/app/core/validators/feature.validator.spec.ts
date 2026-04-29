import { describe, expect, it } from 'vitest';
import { DiscardReason } from '../enums/discard-reason.enum';
import { GeoJsonType } from '../enums/geojson-type.enum';
import { FeatureValidator } from './feature.validator';

describe('FeatureValidator', () => {
  const validator = new FeatureValidator();

  const validFeature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-70.6483, -33.4569] },
    properties: { name: 'Plaza de Armas', category: 'landmark' },
  };

  it('accepts a well-formed Point feature and assigns an id', () => {
    const result = validator.validate(validFeature);
    expect(typeof result === 'object' && 'type' in result).toBe(true);
    if (typeof result === 'string') {
      throw new Error('Expected feature to be valid');
    }
    expect(result.type).toBe(GeoJsonType.Feature);
    expect(typeof result.id).toBe('string');
    expect(result.properties.name).toBe('Plaza de Armas');
    expect(result.properties.category).toBe('landmark');
  });

  it('preserves an existing string id', () => {
    const result = validator.validate({ ...validFeature, id: 'fixed-id' });
    if (typeof result === 'string') {
      throw new Error('Expected feature to be valid');
    }
    expect(result.id).toBe('fixed-id');
  });

  it('reports invalid coordinates as CoordinatesOutOfRange', () => {
    const result = validator.validate({
      ...validFeature,
      geometry: { type: 'Point', coordinates: [-200, 0] },
    });
    expect(result).toBe(DiscardReason.CoordinatesOutOfRange);
  });

  it('reports non-point geometry as GeometryNotPoint', () => {
    const result = validator.validate({
      ...validFeature,
      geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
    });
    expect(result).toBe(DiscardReason.GeometryNotPoint);
  });

  it('reports missing properties', () => {
    const result = validator.validate({
      type: 'Feature',
      geometry: validFeature.geometry,
    });
    expect(result).toBe(DiscardReason.MissingProperties);
  });

  it('reports invalid name', () => {
    const result = validator.validate({
      ...validFeature,
      properties: { name: 42, category: 'landmark' },
    });
    expect(result).toBe(DiscardReason.InvalidName);
  });

  it('reports invalid category', () => {
    const result = validator.validate({
      ...validFeature,
      properties: { name: 'x', category: null },
    });
    expect(result).toBe(DiscardReason.InvalidCategory);
  });

  it('rejects non-Feature objects', () => {
    expect(validator.validate(null)).toBe(DiscardReason.NotAFeature);
    expect(validator.validate({ type: 'Point' })).toBe(DiscardReason.NotAFeature);
  });
});
