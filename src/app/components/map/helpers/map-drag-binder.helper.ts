import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapDragEvent } from './map-drag-event.interface';
import { MapMouseDragBinder } from './map-mouse-drag-binder.helper';
import { MapTouchDragBinder } from './map-touch-drag-binder.helper';

export class MapDragBinder {
  private readonly mouseBinder = new MapMouseDragBinder();
  private readonly touchBinder = new MapTouchDragBinder();

  bind(map: MapLibreMap, onDragEnd: (event: MapDragEvent) => void): void {
    this.mouseBinder.bind(map, onDragEnd);
    this.touchBinder.bind(map, onDragEnd);
  }
}

