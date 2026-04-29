import { describe, it, expect } from 'vitest';
import { FeatureCollectionValidator } from './feature-collection.validator';
import { GeoJsonType } from '../enums/geojson-type.enum';

describe('FeatureCollectionValidator', () => {
  const validator = new FeatureCollectionValidator();

  it('returns true for a valid FeatureCollection', () => {
    expect(validator.isValid({ type: GeoJsonType.FeatureCollection, features: [] })).toBe(true);
  });

  it('returns false for null', () => {
    expect(validator.isValid(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(validator.isValid('string')).toBe(false);
  });

  it('returns false when type is wrong', () => {
    expect(validator.isValid({ type: 'Feature', features: [] })).toBe(false);
  });

  it('returns false when features is not an array', () => {
    expect(validator.isValid({ type: GeoJsonType.FeatureCollection, features: null })).toBe(false);
  });

  it('returns false when features is missing', () => {
    expect(validator.isValid({ type: GeoJsonType.FeatureCollection })).toBe(false);
  });
});
