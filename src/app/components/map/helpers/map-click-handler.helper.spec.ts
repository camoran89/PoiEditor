import { describe, it, expect } from 'vitest';
import { MapClickHandler } from './map-click-handler.helper';
import { MapClickIntentType } from './map-click-intent-type.enum';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';

function makeMapMock(clustersResult: unknown[], featuresResult: unknown[]) {
  return {
    queryRenderedFeatures: (_point: unknown, opts: { layers: string[] }) => {
      if (opts.layers.includes(CLUSTER_CIRCLES_LAYER_ID)) return clustersResult;
      if (opts.layers.includes(POI_LAYER_ID)) return featuresResult;
      return [];
    },
  };
}

const point = { x: 100, y: 100 };
const lngLat = { lng: -70.6, lat: -33.4 };
const event = { point, lngLat } as never;

describe('MapClickHandler', () => {
  const handler = new MapClickHandler();

  it('returns ClusterClicked when a cluster is hit', () => {
    const map = makeMapMock([{ id: 42 }], []);
    const intent = handler.handle(map as never, event, false);
    expect(intent.type).toBe(MapClickIntentType.ClusterClicked);
    expect(intent.clusterId).toBe(42);
    expect(intent.coordinates).toEqual([-70.6, -33.4]);
  });

  it('sets clusterId to undefined when cluster id is not a number', () => {
    const map = makeMapMock([{ id: 'not-a-number' }], []);
    const intent = handler.handle(map as never, event, false);
    expect(intent.clusterId).toBeUndefined();
  });

  it('returns FeatureSelected when a POI is hit', () => {
    const map = makeMapMock([], [{ id: 'poi-1' }]);
    const intent = handler.handle(map as never, event, false);
    expect(intent.type).toBe(MapClickIntentType.FeatureSelected);
    expect(intent.featureId).toBe('poi-1');
  });

  it('returns None when no feature is hit and add mode is off', () => {
    const map = makeMapMock([], []);
    const intent = handler.handle(map as never, event, false);
    expect(intent.type).toBe(MapClickIntentType.None);
  });

  it('returns AddPointRequested when no feature is hit and add mode is on', () => {
    const map = makeMapMock([], []);
    const intent = handler.handle(map as never, event, true);
    expect(intent.type).toBe(MapClickIntentType.AddPointRequested);
    expect(intent.coordinates).toEqual([-70.6, -33.4]);
  });

  it('ignores POI features with non-string ids', () => {
    const map = makeMapMock([], [{ id: 123 }]);
    const intent = handler.handle(map as never, event, false);
    expect(intent.type).toBe(MapClickIntentType.None);
  });
});
