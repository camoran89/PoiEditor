import { describe, it, expect } from 'vitest';
import { PoiFeatureFactory } from './poi-feature-factory.helper';
import { GeoJsonType } from '../enums/geojson-type.enum';

describe('PoiFeatureFactory', () => {
  const factory = new PoiFeatureFactory();

  const input = { coordinates: [-70.6, -33.4] as [number, number], name: 'Test', category: 'park' };

  it('creates a Feature with correct type', () => {
    expect(factory.create(input).type).toBe(GeoJsonType.Feature);
  });

  it('creates a Point geometry', () => {
    expect(factory.create(input).geometry.type).toBe(GeoJsonType.Point);
  });

  it('sets name and category from input', () => {
    const { properties } = factory.create(input);
    expect(properties.name).toBe('Test');
    expect(properties.category).toBe('park');
  });

  it('sets coordinates from input', () => {
    expect(factory.create(input).geometry.coordinates).toEqual([-70.6, -33.4]);
  });

  it('generates a non-empty string id', () => {
    expect(typeof factory.create(input).id).toBe('string');
    expect((factory.create(input).id as string).length).toBeGreaterThan(0);
  });

  it('generates unique ids for different calls', () => {
    expect(factory.create(input).id).not.toBe(factory.create(input).id);
  });

  describe('withUpdatedProperties', () => {
    const base = factory.create(input);

    it('returns a new feature with updated name and category', () => {
      const updated = factory.withUpdatedProperties(base, 'New Name', 'museum');
      expect(updated.properties.name).toBe('New Name');
      expect(updated.properties.category).toBe('museum');
    });

    it('preserves id and geometry', () => {
      const updated = factory.withUpdatedProperties(base, 'X', 'cafe');
      expect(updated.id).toBe(base.id);
      expect(updated.geometry).toEqual(base.geometry);
    });
  });

  describe('withUpdatedCoordinates', () => {
    const base = factory.create(input);

    it('returns a new feature with updated coordinates', () => {
      const updated = factory.withUpdatedCoordinates(base, [1, 2]);
      expect(updated.geometry.coordinates).toEqual([1, 2]);
    });

    it('preserves id and properties', () => {
      const updated = factory.withUpdatedCoordinates(base, [1, 2]);
      expect(updated.id).toBe(base.id);
      expect(updated.properties).toEqual(base.properties);
    });
  });

  describe('hasId', () => {
    it('returns true when id matches', () => {
      const feature = factory.create(input);
      expect(factory.hasId(feature, feature.id as string)).toBe(true);
    });

    it('returns false when id does not match', () => {
      const feature = factory.create(input);
      expect(factory.hasId(feature, 'other-id')).toBe(false);
    });
  });
});
