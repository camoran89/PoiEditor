import { describe, it, expect } from 'vitest';
import { MapStyleProviderService } from './map-style-provider.service';
import { OSM_TILE_URL } from '../core/constants/osm-tile-url.const';

describe('MapStyleProviderService', () => {
  const service = new MapStyleProviderService();

  it('returns a style with version 8', () => {
    expect(service.build().version).toBe(8);
  });

  it('includes an osm-raster source with the OSM tile URL', () => {
    const style = service.build();
    const source = style.sources['osm-raster'] as { tiles: string[] };
    expect(source.tiles).toContain(OSM_TILE_URL);
  });

  it('includes a raster layer', () => {
    const layers = service.build().layers;
    expect(layers.some((l) => l.type === 'raster')).toBe(true);
  });
});
