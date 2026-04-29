import { GeoJsonType } from '../enums/geojson-type.enum';
import { Coordinates } from '../types/coordinates.type';

export interface PoiGeometry {
  readonly type: GeoJsonType.Point;
  readonly coordinates: Coordinates;
}
