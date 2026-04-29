import type { Map as MapLibreMap } from 'maplibre-gl';
import { PoiFeatureCollection } from '../../../core/interfaces/poi-feature-collection.interface';
import { MapCollectionApplier } from './map-collection-applier.helper';

export class DeferredCollectionApplier {
  private readonly applier = new MapCollectionApplier();

  async apply(
    ready: Promise<void>,
    getMap: () => MapLibreMap | null,
    collection: PoiFeatureCollection
  ): Promise<void> {
    await ready;
    const map = getMap();
    if (map === null) {
      return;
    }
    this.applier.apply(map, collection);
  }
}
