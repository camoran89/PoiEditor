import { describe, it, expect, vi } from 'vitest';
import { DeferredCollectionApplier } from './deferred-collection-applier.helper';
import { MapCollectionApplier } from './map-collection-applier.helper';
import { GeoJsonType } from '../../../core/enums/geojson-type.enum';
import { PoiFeatureCollection } from '../../../core/interfaces/poi-feature-collection.interface';

describe('DeferredCollectionApplier', () => {
  const collection: PoiFeatureCollection = {
    type: GeoJsonType.FeatureCollection,
    features: [],
  };

  it('calls MapCollectionApplier.apply after ready resolves', async () => {
    const applySpy = vi.spyOn(MapCollectionApplier.prototype, 'apply').mockImplementation(() => undefined);
    const applier = new DeferredCollectionApplier();
    const map = {} as never;
    await applier.apply(Promise.resolve(), () => map, collection);
    expect(applySpy).toHaveBeenCalledWith(map, collection);
    vi.restoreAllMocks();
  });

  it('does nothing when getMap returns null', async () => {
    const applySpy = vi.spyOn(MapCollectionApplier.prototype, 'apply').mockImplementation(() => undefined);
    const applier = new DeferredCollectionApplier();
    await applier.apply(Promise.resolve(), () => null, collection);
    expect(applySpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
