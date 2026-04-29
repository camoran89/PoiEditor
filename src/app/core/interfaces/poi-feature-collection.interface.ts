import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeature } from './poi-feature.interface';

export interface PoiFeatureCollection {
  readonly type: GeoJsonType.FeatureCollection;
  readonly features: readonly PoiFeature[];
}
