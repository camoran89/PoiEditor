import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapTouchDragBinder } from './map-touch-drag-binder.helper';
import { MapDragEvent } from './map-drag-event.interface';

// ── Minimal MapLibre mock ──────────────────────────────────────────────────────

type Listener = (...args: unknown[]) => void;

function createMapMock() {
  const layerListeners = new Map<string, Listener>();
  const globalListeners = new Map<string, Listener>();

  const dragPan = { disable: vi.fn(), enable: vi.fn() };

  const map = {
    dragPan,
    on: vi.fn((event: string, layerOrHandler: unknown, handler?: unknown) => {
      if (typeof handler === 'function') {
        layerListeners.set(event, handler as Listener);
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
    fireLayer: (event: string, payload: unknown) => {
      layerListeners.get(event)?.(payload);
    },
    fireGlobal: (event: string, payload: unknown) => {
      globalListeners.get(event)?.(payload);
    },
  };

  return map;
}

type MapMock = ReturnType<typeof createMapMock>;

function makeTouchEvent(id: string, touchCount: number, prevented = { value: false }) {
  return {
    features: [{ id, type: 'Feature' }],
    originalEvent: { touches: { length: touchCount } },
    preventDefault: () => { prevented.value = true; },
  };
}

function makeLngLatEvent(lng: number, lat: number) {
  return { lngLat: { lng, lat } };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MapTouchDragBinder', () => {
  let map: MapMock;
  let binder: MapTouchDragBinder;
  let onDragEnd: (event: MapDragEvent) => void;

  beforeEach(() => {
    map = createMapMock();
    binder = new MapTouchDragBinder();
    onDragEnd = vi.fn() as unknown as (event: MapDragEvent) => void;
    binder.bind(map as unknown as Parameters<typeof binder.bind>[0], onDragEnd);
  });

  it('registers a touchstart listener on the POI layer', () => {
    expect(map.on).toHaveBeenCalledWith('touchstart', expect.any(String), expect.any(Function));
  });

  it('ignores multi-touch events (pinch/zoom)', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 2));
    expect(map.dragPan.disable).not.toHaveBeenCalled();
  });

  it('does nothing when the touchstart has no features', () => {
    map.fireLayer('touchstart', {
      features: [],
      originalEvent: { touches: { length: 1 } },
      preventDefault: vi.fn(),
    });
    expect(map.dragPan.disable).not.toHaveBeenCalled();
  });

  it('does nothing when the feature id is not a string', () => {
    map.fireLayer('touchstart', {
      features: [{ id: 99 }],
      originalEvent: { touches: { length: 1 } },
      preventDefault: vi.fn(),
    });
    expect(map.dragPan.disable).not.toHaveBeenCalled();
  });

  it('disables dragPan on valid single-touch start over a feature', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1));
    expect(map.dragPan.disable).toHaveBeenCalledOnce();
  });

  it('calls preventDefault on the event', () => {
    const prevented = { value: false };
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1, prevented));
    expect(prevented.value).toBe(true);
  });

  it('emits MapDragEvent with correct id and coordinates after touch drag', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1));
    map.fireGlobal('touchmove', {});
    map.fireGlobal('touchend', makeLngLatEvent(-70.6, -33.4));

    expect(onDragEnd).toHaveBeenCalledOnce();
    const event: MapDragEvent = vi.mocked(onDragEnd).mock.calls[0][0];
    expect(event.featureId).toBe('poi-1');
    expect(event.coordinates).toEqual([-70.6, -33.4]);
  });

  it('does NOT emit if the touch never moved (tap, not drag)', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1));
    // no touchmove fired
    map.fireGlobal('touchend', makeLngLatEvent(0, 0));
    expect(onDragEnd).not.toHaveBeenCalled();
  });

  it('re-enables dragPan after touchend', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1));
    map.fireGlobal('touchmove', {});
    map.fireGlobal('touchend', makeLngLatEvent(0, 0));
    expect(map.dragPan.enable).toHaveBeenCalledOnce();
  });

  it('removes touchmove and touchend listeners after touchend', () => {
    map.fireLayer('touchstart', makeTouchEvent('poi-1', 1));
    map.fireGlobal('touchmove', {});
    map.fireGlobal('touchend', makeLngLatEvent(0, 0));
    expect(map.off).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(map.off).toHaveBeenCalledWith('touchend', expect.any(Function));
  });
});
