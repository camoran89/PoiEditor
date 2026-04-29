import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { Coordinates } from '../../../core/types/coordinates.type';
import { MapClickIntent } from './map-click-intent.interface';
import { MapClickIntentType } from './map-click-intent-type.enum';

export class MapClickHandler {
  handle(map: MapLibreMap, event: MapMouseEvent, addModeEnabled: boolean): MapClickIntent {
    const clusters = map.queryRenderedFeatures(event.point, { layers: [CLUSTER_CIRCLES_LAYER_ID] });
    if (clusters.length > 0) {
      const coordinates: Coordinates = [event.lngLat.lng, event.lngLat.lat];
      const clusterId = typeof clusters[0].id === 'number' ? clusters[0].id : undefined;
      return { type: MapClickIntentType.ClusterClicked, coordinates, clusterId };
    }
    const features = map.queryRenderedFeatures(event.point, { layers: [POI_LAYER_ID] });
    if (features.length > 0) {
      const featureId = features[0].id;
      if (typeof featureId === 'string') {
        return { type: MapClickIntentType.FeatureSelected, featureId };
      }
    }
    if (!addModeEnabled) {
      return { type: MapClickIntentType.None };
    }
    const coordinates: Coordinates = [event.lngLat.lng, event.lngLat.lat];
    return { type: MapClickIntentType.AddPointRequested, coordinates };
  }
}
