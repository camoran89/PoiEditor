import { describe, it, expect } from 'vitest';
import { PointGeometryValidator } from './point-geometry.validator';
import { GeoJsonType } from '../enums/geojson-type.enum';

describe('PointGeometryValidator', () => {
  const validator = new PointGeometryValidator();

  const valid = { type: GeoJsonType.Point, coordinates: [-70.6, -33.4] };

  it('returns true for a valid Point geometry', () => {
    expect(validator.isValid(valid)).toBe(true);
  });

  it('returns false for null', () => {
    expect(validator.isValid(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(validator.isValid(42)).toBe(false);
  });

  it('returns false when type is not Point', () => {
    expect(validator.isValid({ type: 'LineString', coordinates: [0, 0] })).toBe(false);
  });

  it('returns false when coordinates are invalid', () => {
    expect(validator.isValid({ type: GeoJsonType.Point, coordinates: [0] })).toBe(false);
  });

  it('returns false for out-of-range coordinates', () => {
    expect(validator.isValid({ type: GeoJsonType.Point, coordinates: [200, 100] })).toBe(false);
  });
});
