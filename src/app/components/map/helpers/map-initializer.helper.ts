import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
import { Map as MapLibreMapClass } from 'maplibre-gl';
import { Coordinates } from '../../../core/types/coordinates.type';

export class MapInitializer {
  initialize(
    container: HTMLElement,
    style: StyleSpecification,
    center: Coordinates,
    zoom: number
  ): MapLibreMap {
    return new MapLibreMapClass({
      container,
      style,
      center: [center[0], center[1]],
      zoom,
    });
  }
}
