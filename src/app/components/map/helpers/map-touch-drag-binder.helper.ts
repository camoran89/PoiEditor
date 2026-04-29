import type { Map as MapLibreMap, MapTouchEvent } from 'maplibre-gl';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { MapDragEvent } from './map-drag-event.interface';

export class MapTouchDragBinder {
  bind(map: MapLibreMap, onDragEnd: (event: MapDragEvent) => void): void {
    map.on('touchstart', POI_LAYER_ID, (e) => {
      if (e.originalEvent.touches.length !== 1) {
        return;
      }
      const feature = e.features?.[0];
      if (!feature || typeof feature.id !== 'string') {
        return;
      }
      const featureId = feature.id;
      e.preventDefault();

      let dragged = false;
      map.dragPan.disable();

      const onTouchMove = (): void => {
        dragged = true;
      };

      const onTouchEnd = (endEvent: MapTouchEvent): void => {
        map.off('touchmove', onTouchMove);
        map.off('touchend', onTouchEnd);
        map.dragPan.enable();

        if (!dragged) {
          return;
        }
        onDragEnd({
          featureId,
          coordinates: [endEvent.lngLat.lng, endEvent.lngLat.lat],
        });
      };

      map.on('touchmove', onTouchMove);
      map.on('touchend', onTouchEnd);
    });
  }
}
