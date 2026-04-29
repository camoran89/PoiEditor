import type { GeoJSONSource, Map as MapLibreMap } from 'maplibre-gl';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';
import { Coordinates } from '../../../core/types/coordinates.type';

export class ClusterZoomer {
  async zoomTo(map: MapLibreMap, coordinates: Coordinates, clusterId?: number): Promise<void> {
    let zoom: number;
    if (clusterId !== undefined) {
      const source = map.getSource(POI_SOURCE_ID) as GeoJSONSource | undefined;
      zoom = source !== undefined
        ? await source.getClusterExpansionZoom(clusterId)
        : map.getZoom() + 2;
    } else {
      zoom = map.getZoom() + 2;
    }
    map.easeTo({ center: [coordinates[0], coordinates[1]], zoom });
  }
}
