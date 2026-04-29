import { describe, it, expect, vi } from 'vitest';
import { MapInteractionsBinder } from './map-interactions-binder.helper';
import { POI_LAYER_ID } from '../../../core/constants/poi-layer-id.const';
import { CLUSTER_CIRCLES_LAYER_ID } from '../../../core/constants/cluster-circles-layer-id.const';

function createMapMock() {
  const canvas = { style: { cursor: '' } };
  const listeners = new Map<string, (...args: unknown[]) => void>();
  return {
    canvas,
    getCanvas: () => canvas,
    on: vi.fn((event: string, layerOrCb: unknown, cb?: unknown) => {
      const key = typeof cb === 'function' ? `${event}:${layerOrCb}` : event;
      const handler = typeof cb === 'function' ? cb : layerOrCb;
      listeners.set(key, handler as (...args: unknown[]) => void);
    }),
    fire: (event: string, layer?: string) => {
      const key = layer ? `${event}:${layer}` : event;
      listeners.get(key)?.();
    },
    listeners,
  };
}

describe('MapInteractionsBinder', () => {
  const binder = new MapInteractionsBinder();

  it('registers a global click listener', () => {
    const map = createMapMock();
    const onClick = vi.fn();
    binder.bind(map as never, onClick);
    expect(map.on).toHaveBeenCalledWith('click', onClick);
  });

  it('sets cursor to pointer on mouseenter for POI layer', () => {
    const map = createMapMock();
    binder.bind(map as never, vi.fn());
    map.fire('mouseenter', POI_LAYER_ID);
    expect(map.canvas.style.cursor).toBe('pointer');
  });

  it('resets cursor on mouseleave for POI layer', () => {
    const map = createMapMock();
    binder.bind(map as never, vi.fn());
    map.fire('mouseenter', POI_LAYER_ID);
    map.fire('mouseleave', POI_LAYER_ID);
    expect(map.canvas.style.cursor).toBe('');
  });

  it('sets cursor to pointer on mouseenter for cluster layer', () => {
    const map = createMapMock();
    binder.bind(map as never, vi.fn());
    map.fire('mouseenter', CLUSTER_CIRCLES_LAYER_ID);
    expect(map.canvas.style.cursor).toBe('pointer');
  });

  it('resets cursor on mouseleave for cluster layer', () => {
    const map = createMapMock();
    binder.bind(map as never, vi.fn());
    map.fire('mouseenter', CLUSTER_CIRCLES_LAYER_ID);
    map.fire('mouseleave', CLUSTER_CIRCLES_LAYER_ID);
    expect(map.canvas.style.cursor).toBe('');
  });
});
