import { PoiFeatureCollection } from '../interfaces/poi-feature-collection.interface';

export class GeoJsonStringifier {
  stringify(collection: PoiFeatureCollection): string {
    return JSON.stringify(collection, null, 2);
  }
}
