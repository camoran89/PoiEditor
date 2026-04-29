import type { Map as MapLibreMap } from 'maplibre-gl';
import { MapDisposer } from './map-disposer.helper';

export class MapReleaser {
  private readonly disposer = new MapDisposer();

  release(map: MapLibreMap | null): void {
    if (map !== null) {
      this.disposer.dispose(map);
    }
  }
}
