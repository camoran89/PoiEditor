import { describe, it, expect, vi } from 'vitest';
import { MapReleaser } from './map-releaser.helper';
import { MapDisposer } from './map-disposer.helper';

describe('MapReleaser', () => {
  it('calls MapDisposer.dispose when map is not null', () => {
    const disposeSpy = vi.spyOn(MapDisposer.prototype, 'dispose').mockImplementation(() => undefined);
    const releaser = new MapReleaser();
    const map = {} as never;
    releaser.release(map);
    expect(disposeSpy).toHaveBeenCalledWith(map);
    vi.restoreAllMocks();
  });

  it('does nothing when map is null', () => {
    const disposeSpy = vi.spyOn(MapDisposer.prototype, 'dispose').mockImplementation(() => undefined);
    const releaser = new MapReleaser();
    releaser.release(null);
    expect(disposeSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
