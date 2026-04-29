import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';
import { PoiFeatureCollection } from '../../../core/interfaces/poi-feature-collection.interface';

export class MapCollectionApplier {
  apply(map: MapLibreMap, collection: PoiFeatureCollection): void {
    const source = map.getSource(POI_SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) {
      return;
    }
    source.setData({
      type: 'FeatureCollection',
      features: collection.features.map((feature) => ({
        type: 'Feature',
        id: feature.id,
        geometry: {
          type: 'Point',
          coordinates: [...feature.geometry.coordinates],
        },
        properties: { ...feature.properties },
      })),
    });
  }
}
