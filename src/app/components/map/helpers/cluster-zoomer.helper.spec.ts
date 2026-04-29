import { describe, it, expect, vi } from 'vitest';
import { ClusterZoomer } from './cluster-zoomer.helper';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';

describe('ClusterZoomer', () => {
  const zoomer = new ClusterZoomer();

  function makeMap(sourceResult: unknown, currentZoom = 5) {
    return {
      getSource: vi.fn().mockReturnValue(sourceResult),
      getZoom: vi.fn().mockReturnValue(currentZoom),
      easeTo: vi.fn(),
    };
  }

  it('uses getClusterExpansionZoom when source and clusterId are present', async () => {
    const source = { getClusterExpansionZoom: vi.fn().mockResolvedValue(10) };
    const map = makeMap(source);
    await zoomer.zoomTo(map as never, [-70.6, -33.4], 42);
    expect(source.getClusterExpansionZoom).toHaveBeenCalledWith(42);
    expect(map.easeTo).toHaveBeenCalledWith(expect.objectContaining({ zoom: 10 }));
  });

  it('falls back to currentZoom + 2 when source is undefined', async () => {
    const map = makeMap(undefined, 5);
    await zoomer.zoomTo(map as never, [-70.6, -33.4], 1);
    expect(map.easeTo).toHaveBeenCalledWith(expect.objectContaining({ zoom: 7 }));
  });

  it('falls back to currentZoom + 2 when no clusterId is provided', async () => {
    const map = makeMap({}, 8);
    await zoomer.zoomTo(map as never, [-70.6, -33.4]);
    expect(map.easeTo).toHaveBeenCalledWith(expect.objectContaining({ zoom: 10 }));
  });

  it('centers easeTo on the provided coordinates', async () => {
    const map = makeMap(undefined, 5);
    await zoomer.zoomTo(map as never, [-70.6, -33.4]);
    expect(map.easeTo).toHaveBeenCalledWith(expect.objectContaining({ center: [-70.6, -33.4] }));
  });

  it('looks up the source by POI_SOURCE_ID', async () => {
    const map = makeMap(undefined, 5);
    await zoomer.zoomTo(map as never, [-70.6, -33.4], 1);
    expect(map.getSource).toHaveBeenCalledWith(POI_SOURCE_ID);
  });
});
