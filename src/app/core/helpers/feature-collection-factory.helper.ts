import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeature } from '../interfaces/poi-feature.interface';
import { PoiFeatureCollection } from '../interfaces/poi-feature-collection.interface';

export class FeatureCollectionFactory {
  create(features: readonly PoiFeature[]): PoiFeatureCollection {
    return {
      type: GeoJsonType.FeatureCollection,
      features,
    };
  }
}
