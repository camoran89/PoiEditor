import { GeoJsonType } from '../enums/geojson-type.enum';

export class FeatureCollectionValidator {
  isValid(value: unknown): value is { type: GeoJsonType.FeatureCollection; features: readonly unknown[] } {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const candidate = value as { type?: unknown; features?: unknown };
    return candidate.type === GeoJsonType.FeatureCollection && Array.isArray(candidate.features);
  }
}
