import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapDragBinder } from './map-drag-binder.helper';
import { MapDragEvent } from './map-drag-event.interface';
import { MapMouseDragBinder } from './map-mouse-drag-binder.helper';
import { MapTouchDragBinder } from './map-touch-drag-binder.helper';

describe('MapDragBinder', () => {
  let binder: MapDragBinder;
  let mapStub: object;
  let onDragEnd: (event: MapDragEvent) => void;
  let mouseSpy: ReturnType<typeof vi.spyOn>;
  let touchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    mouseSpy = vi.spyOn(MapMouseDragBinder.prototype, 'bind').mockImplementation(() => undefined);
    touchSpy = vi.spyOn(MapTouchDragBinder.prototype, 'bind').mockImplementation(() => undefined);
    binder = new MapDragBinder();
    mapStub = {};
    onDragEnd = vi.fn() as unknown as (event: MapDragEvent) => void;
  });

  it('delegates to MapMouseDragBinder.bind', () => {
    binder.bind(mapStub as never, onDragEnd);
    expect(mouseSpy).toHaveBeenCalledWith(mapStub, onDragEnd);
  });

  it('delegates to MapTouchDragBinder.bind', () => {
    binder.bind(mapStub as never, onDragEnd);
    expect(touchSpy).toHaveBeenCalledWith(mapStub, onDragEnd);
  });

  it('calls both binders on every bind call', () => {
    binder.bind(mapStub as never, onDragEnd);
    expect(mouseSpy).toHaveBeenCalledOnce();
    expect(touchSpy).toHaveBeenCalledOnce();
  });
});


