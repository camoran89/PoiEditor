import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';

export class MapInteractionsBinder {
  bind(map: MapLibreMap, onClick: (event: MapMouseEvent) => void): void {
    map.on('click', onClick);
    for (const layerId of [POI_LAYER_ID, CLUSTER_CIRCLES_LAYER_ID]) {
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }
}
