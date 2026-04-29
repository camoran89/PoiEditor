import { describe, it, expect, vi } from 'vitest';
import { MapCollectionApplier } from './map-collection-applier.helper';
import { GeoJsonType } from '../../../core/enums/geojson-type.enum';
import { PoiFeatureCollection } from '../../../core/interfaces/poi-feature-collection.interface';
import { POI_SOURCE_ID } from '../../../core/constants/poi-source-id.const';

describe('MapCollectionApplier', () => {
  const applier = new MapCollectionApplier();

  const collection: PoiFeatureCollection = {
    type: GeoJsonType.FeatureCollection,
    features: [{
      type: GeoJsonType.Feature,
      id: 'poi-1',
      geometry: { type: GeoJsonType.Point, coordinates: [-70.6, -33.4] },
      properties: { name: 'Test', category: 'park' },
    }],
  };

  it('calls setData on the source with a FeatureCollection', () => {
    const setData = vi.fn();
    const map = { getSource: (_id: string) => ({ setData }) } as never;
    applier.apply(map, collection);
    expect(setData).toHaveBeenCalledOnce();
    expect(setData.mock.calls[0][0].type).toBe('FeatureCollection');
  });

  it('passes feature ids to the source data', () => {
    const setData = vi.fn();
    const map = { getSource: (_id: string) => ({ setData }) } as never;
    applier.apply(map, collection);
    expect(setData.mock.calls[0][0].features[0].id).toBe('poi-1');
  });

  it('does nothing when the source is not found', () => {
    const map = { getSource: (_id: string) => undefined } as never;
    expect(() => applier.apply(map, collection)).not.toThrow();
  });

  it('queries the POI source by id', () => {
    const getSource = vi.fn().mockReturnValue({ setData: vi.fn() });
    const map = { getSource } as never;
    applier.apply(map, collection);
    expect(getSource).toHaveBeenCalledWith(POI_SOURCE_ID);
  });
});
