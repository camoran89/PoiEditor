import type { Map as MapLibreMap } from 'maplibre-gl';

export class MapDisposer {
  dispose(map: MapLibreMap): void {
    map.remove();
  }
}
