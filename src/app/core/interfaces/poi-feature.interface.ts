import { GeoJsonType } from '../enums/geojson-type.enum';
import { FeatureId } from '../types/feature-id.type';
import { PoiGeometry } from './poi-geometry.interface';
import { PoiProperties } from './poi-properties.interface';

export interface PoiFeature {
  readonly type: GeoJsonType.Feature;
  readonly id: FeatureId;
  readonly geometry: PoiGeometry;
  readonly properties: PoiProperties;
}
