import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { MapDragEvent } from './map-drag-event.interface';

export class MapMouseDragBinder {
  bind(map: MapLibreMap, onDragEnd: (event: MapDragEvent) => void): void {
    map.on('mousedown', POI_LAYER_ID, (e) => {
      const feature = e.features?.[0];
      if (!feature || typeof feature.id !== 'string') {
        return;
      }
      const featureId = feature.id;
      e.preventDefault();

      let dragged = false;
      const canvas = map.getCanvas();
      canvas.style.cursor = 'grabbing';
      map.dragPan.disable();

      const onMove = (): void => {
        dragged = true;
      };

      const onUp = (upEvent: MapMouseEvent): void => {
        map.off('mousemove', onMove);
        map.off('mouseup', onUp);
        map.dragPan.enable();
        canvas.style.cursor = '';

        if (!dragged) {
          return;
        }
        onDragEnd({
          featureId,
          coordinates: [upEvent.lngLat.lng, upEvent.lngLat.lat],
        });
      };

      map.on('mousemove', onMove);
      map.on('mouseup', onUp);
    });
  }
}
