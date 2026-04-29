import { describe, it, expect } from 'vitest';
import { GeometryFailureClassifier } from './geometry-failure-classifier.helper';
import { DiscardReason } from '../enums/discard-reason.enum';
import { GeoJsonType } from '../enums/geojson-type.enum';

describe('GeometryFailureClassifier', () => {
  const classifier = new GeometryFailureClassifier();

  it('returns GeometryNotPoint for null', () => {
    expect(classifier.classify(null)).toBe(DiscardReason.GeometryNotPoint);
  });

  it('returns GeometryNotPoint for non-object', () => {
    expect(classifier.classify('string')).toBe(DiscardReason.GeometryNotPoint);
  });

  it('returns GeometryNotPoint when type is not Point', () => {
    expect(classifier.classify({ type: 'LineString', coordinates: [0, 0] })).toBe(DiscardReason.GeometryNotPoint);
  });

  it('returns InvalidCoordinates when coordinates is not an array', () => {
    expect(classifier.classify({ type: GeoJsonType.Point, coordinates: null })).toBe(DiscardReason.InvalidCoordinates);
  });

  it('returns InvalidCoordinates when coordinates array length !== 2', () => {
    expect(classifier.classify({ type: GeoJsonType.Point, coordinates: [0] })).toBe(DiscardReason.InvalidCoordinates);
  });

  it('returns CoordinatesOutOfRange when type is Point and coords are a valid 2-tuple', () => {
    expect(classifier.classify({ type: GeoJsonType.Point, coordinates: [0, 0] })).toBe(DiscardReason.CoordinatesOutOfRange);
  });
});
