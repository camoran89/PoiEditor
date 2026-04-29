import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiGeometry } from '../interfaces/poi-geometry.interface';
import { CoordinatesValidator } from './coordinates.validator';

export class PointGeometryValidator {
  private readonly coordinatesValidator = new CoordinatesValidator();

  isValid(value: unknown): value is PoiGeometry {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const candidate = value as { type?: unknown; coordinates?: unknown };
    return candidate.type === GeoJsonType.Point
      && this.coordinatesValidator.isValid(candidate.coordinates);
  }
}
