import { describe, it, expect, vi, afterEach } from 'vitest';
import { MapInitializer } from './map-initializer.helper';

vi.mock('maplibre-gl', () => ({
  Map: vi.fn().mockImplementation(function (this: object, opts: unknown) {
    Object.assign(this, { _opts: opts });
  }),
}));

describe('MapInitializer', () => {
  afterEach(() => vi.clearAllMocks());

  it('constructs a MapLibreMap with the given options', async () => {
    const { Map: MapMock } = await import('maplibre-gl');
    const initializer = new MapInitializer();
    const container = document.createElement('div');
    const style = {} as never;
    initializer.initialize(container, style, [-70.6, -33.4], 12);
    expect(MapMock).toHaveBeenCalledWith(expect.objectContaining({
      container,
      zoom: 12,
      center: [-70.6, -33.4],
    }));
  });

  it('returns the created map instance', async () => {
    const { Map: MapMock } = await import('maplibre-gl');
    const initializer = new MapInitializer();
    const result = initializer.initialize(document.createElement('div'), {} as never, [0, 0], 5);
    expect(result).toBeInstanceOf(MapMock);
  });
});
