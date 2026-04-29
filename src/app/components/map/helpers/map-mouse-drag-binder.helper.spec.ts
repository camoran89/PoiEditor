import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapMouseDragBinder } from './map-mouse-drag-binder.helper';
import { MapDragEvent } from './map-drag-event.interface';

// ── Minimal MapLibre mock ──────────────────────────────────────────────────────

type Listener = (...args: unknown[]) => void;

function createMapMock() {
  const layerListeners = new Map<string, Listener>();
  const globalListeners = new Map<string, Listener>();
  const canvas = { style: { cursor: '' } } as HTMLCanvasElement & { style: { cursor: string } };

  const dragPan = { disable: vi.fn(), enable: vi.fn() };

  const map = {
    dragPan,
    getCanvas: () => canvas,
    on: vi.fn((event: string, layerOrHandler: unknown, handler?: unknown) => {
      if (typeof handler === 'function') {
        layerListeners.set(`${event}`, handler as Listener);
      } else if (typeof layerOrHandler === 'function') {
        globalListeners.set(event, layerOrHandler as Listener);
      }
    }),
    off: vi.fn((event: string, handler: unknown) => {
      for (const map of [layerListeners, globalListeners]) {
        if (map.get(event) === handler) {
          map.delete(event);
        }
      }
    }),
    /** Fire a layer event (three-arg on) */
    fireLayer: (event: string, payload: unknown) => {
      layerListeners.get(event)?.(payload);
    },
    /** Fire a global event (two-arg on) */
    fireGlobal: (event: string, payload: unknown) => {
      globalListeners.get(event)?.(payload);
    },
    canvas,
  };

  return map;
}

type MapMock = ReturnType<typeof createMapMock>;

function makeFeatureEvent(id: string, prevented = { value: false }) {
  return {
    features: [{ id, type: 'Feature' }],
    preventDefault: () => { prevented.value = true; },
  };
}

function makeLngLatEvent(lng: number, lat: number) {
  return { lngLat: { lng, lat } };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MapMouseDragBinder', () => {
  let map: MapMock;
  let binder: MapMouseDragBinder;
  let onDragEnd: (event: MapDragEvent) => void;

  beforeEach(() => {
    map = createMapMock();
    binder = new MapMouseDragBinder();
    onDragEnd = vi.fn() as unknown as (event: MapDragEvent) => void;
    binder.bind(map as unknown as Parameters<typeof binder.bind>[0], onDragEnd);
  });

  it('registers a mousedown listener on the POI layer', () => {
    expect(map.on).toHaveBeenCalledWith('mousedown', expect.any(String), expect.any(Function));
  });

  it('does nothing when the mousedown has no features', () => {
    map.fireLayer('mousedown', { features: [], preventDefault: vi.fn() });
    expect(map.dragPan.disable).not.toHaveBeenCalled();
  });

  it('does nothing when the feature id is not a string', () => {
    map.fireLayer('mousedown', { features: [{ id: 123 }], preventDefault: vi.fn() });
    expect(map.dragPan.disable).not.toHaveBeenCalled();
  });

  it('disables dragPan on mousedown over a valid feature', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    expect(map.dragPan.disable).toHaveBeenCalledOnce();
  });

  it('sets cursor to grabbing on mousedown', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    expect(map.canvas.style.cursor).toBe('grabbing');
  });

  it('calls preventDefault on the event', () => {
    const prevented = { value: false };
    map.fireLayer('mousedown', makeFeatureEvent('poi-1', prevented));
    expect(prevented.value).toBe(true);
  });

  it('emits MapDragEvent with correct id and coordinates after drag', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    map.fireGlobal('mousemove', {});
    map.fireGlobal('mouseup', makeLngLatEvent(-70.6, -33.4));

    expect(onDragEnd).toHaveBeenCalledOnce();
    const event: MapDragEvent = vi.mocked(onDragEnd).mock.calls[0][0];
    expect(event.featureId).toBe('poi-1');
    expect(event.coordinates).toEqual([-70.6, -33.4]);
  });

  it('does NOT emit if the pointer never moved (click, not drag)', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    // no mousemove fired
    map.fireGlobal('mouseup', makeLngLatEvent(-70.6, -33.4));
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('re-enables dragPan and resets cursor on mouseup', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    map.fireGlobal('mousemove', {});
    map.fireGlobal('mouseup', makeLngLatEvent(0, 0));
    expect(map.dragPan.enable).toHaveBeenCalledOnce();
    expect(map.canvas.style.cursor).toBe('');
  });

  it('removes mousemove and mouseup listeners after mouseup', () => {
    map.fireLayer('mousedown', makeFeatureEvent('poi-1'));
    map.fireGlobal('mousemove', {});
    map.fireGlobal('mouseup', makeLngLatEvent(0, 0));
    expect(map.off).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(map.off).toHaveBeenCalledWith('mouseup', expect.any(Function));
  });
});
