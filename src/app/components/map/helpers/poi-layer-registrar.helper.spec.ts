import { describe, it, expect, vi } from 'vitest';
import { PoiLayerRegistrar } from './poi-layer-registrar.helper';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';
import { CLUSTER_COUNT_LAYER_ID } from '../../../core/constants/cluster-count-layer-id.const';

describe('PoiLayerRegistrar', () => {
  function makeMap() {
    return { addSource: vi.fn(), addLayer: vi.fn() };
  }

  const registrar = new PoiLayerRegistrar();

  it('registers the GeoJSON source with clustering enabled', () => {
    const map = makeMap();
    registrar.register(map as never);
    expect(map.addSource).toHaveBeenCalledOnce();
    expect(map.addSource.mock.calls[0][0]).toBe(POI_SOURCE_ID);
    expect(map.addSource.mock.calls[0][1]).toMatchObject({ type: 'geojson', cluster: true });
  });

  it('registers exactly three layers', () => {
    const map = makeMap();
    registrar.register(map as never);
    expect(map.addLayer).toHaveBeenCalledTimes(3);
  });

  it('registers the cluster circles layer', () => {
    const map = makeMap();
    registrar.register(map as never);
    const ids = map.addLayer.mock.calls.map((c) => c[0].id);
    expect(ids).toContain(CLUSTER_CIRCLES_LAYER_ID);
  });

  it('registers the cluster count layer', () => {
    const map = makeMap();
    registrar.register(map as never);
    const ids = map.addLayer.mock.calls.map((c) => c[0].id);
    expect(ids).toContain(CLUSTER_COUNT_LAYER_ID);
  });

  it('registers the POI layer', () => {
    const map = makeMap();
    registrar.register(map as never);
    const ids = map.addLayer.mock.calls.map((c) => c[0].id);
    expect(ids).toContain(POI_LAYER_ID);
  });
});
