import { GeoJsonType } from '../enums/geojson-type.enum';
import { Coordinates } from '../types/coordinates.type';
import { FeatureId } from '../types/feature-id.type';
import { PoiFeature } from '../interfaces/poi-feature.interface';
import { PoiProperties } from '../interfaces/poi-properties.interface';
import { PoiCreationInput } from '../interfaces/poi-creation-input.interface';
import { FeatureIdGenerator } from '../helpers/feature-id-generator.helper';

export class PoiFeatureFactory {
  private readonly idGenerator = new FeatureIdGenerator();

  create(input: PoiCreationInput): PoiFeature {
    const properties: PoiProperties = {
      name: input.name,
      category: input.category,
    };
    return {
      type: GeoJsonType.Feature,
      id: this.idGenerator.generate(),
      geometry: {
        type: GeoJsonType.Point,
        coordinates: input.coordinates,
      },
      properties,
    };
  }

  withUpdatedProperties(feature: PoiFeature, name: string, category: string): PoiFeature {
    const properties: PoiProperties = {
      ...feature.properties,
      name,
      category,
    };
    return {
      ...feature,
      properties,
    };
  }

  withUpdatedCoordinates(feature: PoiFeature, coordinates: Coordinates): PoiFeature {
    return {
      ...feature,
      geometry: {
        type: GeoJsonType.Point,
        coordinates,
      },
    };
  }

  hasId(feature: PoiFeature, id: FeatureId): boolean {
    return feature.id === id;
  }
}
