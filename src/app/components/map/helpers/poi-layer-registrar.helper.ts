import type { Map as MapLibreMap } from 'maplibre-gl';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';
import { CLUSTER_COUNT_LAYER_ID } from '../../../core/constants/cluster-count-layer-id.const';
import { CLUSTER_MAX_ZOOM } from '../../../core/constants/cluster-max-zoom.const';
import { CLUSTER_RADIUS } from '../../../core/constants/cluster-radius.const';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';

export class PoiLayerRegistrar {
  register(map: MapLibreMap): void {
    map.addSource(POI_SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: CLUSTER_MAX_ZOOM,
      clusterRadius: CLUSTER_RADIUS,
    });
    map.addLayer({
      id: CLUSTER_CIRCLES_LAYER_ID,
      type: 'circle',
      source: POI_SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#42a5f5',
          10,
          '#1e88e5',
          50,
          '#1565c0',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 22, 50, 28],
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });
    map.addLayer({
      id: CLUSTER_COUNT_LAYER_ID,
      type: 'symbol',
      source: POI_SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
    map.addLayer({
      id: POI_LAYER_ID,
      type: 'circle',
      source: POI_SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': 7,
        'circle-color': '#1976d2',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });
  }
}
