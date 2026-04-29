import { describe, it, expect, vi } from 'vitest';
import { MapDisposer } from './map-disposer.helper';

describe('MapDisposer', () => {
  const disposer = new MapDisposer();

  it('calls map.remove()', () => {
    const remove = vi.fn();
    const map = { remove } as never;
    disposer.dispose(map);
    expect(remove).toHaveBeenCalledOnce();
  });
});
