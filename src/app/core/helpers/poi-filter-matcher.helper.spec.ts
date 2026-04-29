import { describe, expect, it } from 'vitest';
import { PoiFilterMatcher } from './poi-filter-matcher.helper';
import { GeoJsonType } from '../enums/geojson-type.enum';
import { PoiFeature } from '../interfaces/poi-feature.interface';

describe('PoiFilterMatcher', () => {
    const featureFor = (id: string, name: string, category: string): PoiFeature => ({
        type: GeoJsonType.Feature,
        id,
        geometry: { type: GeoJsonType.Point, coordinates: [0, 0] },
        properties: { name, category },
    });
    
    const matcher = new PoiFilterMatcher();
    const features: readonly PoiFeature[] = [
        featureFor('a', 'Plaza de Armas', 'landmark'),
        featureFor('b', 'Parque Bicentenario', 'park'),
        featureFor('c', 'Cerro San Cristobal', 'landmark'),
    ];

    it('returns all features for an empty filter', () => {
        expect(matcher.apply(features, { query: '', category: '' })).toHaveLength(3);
    });

    it('filters by query against name', () => {
        expect(matcher.apply(features, { query: 'plaza', category: '' }).map((f) => f.id)).toEqual(['a']);
    });

    it('filters by query against category', () => {
        expect(matcher.apply(features, { query: 'park', category: '' }).map((f) => f.id)).toEqual(['b']);
    });

    it('filters by exact category', () => {
        expect(matcher.apply(features, { query: '', category: 'landmark' }).map((f) => f.id)).toEqual(['a', 'c']);
    });

    it('combines query and category filters', () => {
        expect(
            matcher.apply(features, { query: 'cerro', category: 'landmark' }).map((f) => f.id)
        ).toEqual(['c']);
    });
});
