import { DiscardReason } from '../enums/discard-reason.enum';
import { GeoJsonType } from '../enums/geojson-type.enum';

export class GeometryFailureClassifier {
  classify(geometry: unknown): DiscardReason {
    if (geometry === null || typeof geometry !== 'object') {
      return DiscardReason.GeometryNotPoint;
    }
    const candidate = geometry as { type?: unknown; coordinates?: unknown };
    if (candidate.type !== GeoJsonType.Point) {
      return DiscardReason.GeometryNotPoint;
    }
    if (!Array.isArray(candidate.coordinates) || candidate.coordinates.length !== 2) {
      return DiscardReason.InvalidCoordinates;
    }
    return DiscardReason.CoordinatesOutOfRange;
  }
}
