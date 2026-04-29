import { Injectable } from '@angular/core';
import type { StyleSpecification } from 'maplibre-gl';
import { OSM_TILE_ATTRIBUTION } from '../core/constants/osm-tile-attribution.const';
import { OSM_TILE_URL } from '../core/constants/osm-tile-url.const';

@Injectable({ providedIn: 'root' })
export class MapStyleProviderService {
  build(): StyleSpecification {
    return {
      version: 8,
      sources: {
        'osm-raster': {
          type: 'raster',
          tiles: [OSM_TILE_URL],
          tileSize: 256,
          attribution: OSM_TILE_ATTRIBUTION,
        },
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm-raster',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }
}
