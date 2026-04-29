import type { Map as MapLibreMap } from 'maplibre-gl';
import { ClusterZoomStepper } from '../../../core/helpers/cluster-zoom-stepper.helper';
import { Coordinates } from '../../../core/types/coordinates.type';

export class ClusterZoomer {
  private readonly stepper = new ClusterZoomStepper();

  zoomTo(map: MapLibreMap, coordinates: Coordinates): void {
    map.easeTo({
      center: [coordinates[0], coordinates[1]],
      zoom: this.stepper.next(map.getZoom()),
    });
  }
}
