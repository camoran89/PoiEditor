import { GeoJsonType } from '../enums/geojson-type.enum';
import { DiscardReason } from '../enums/discard-reason.enum';
import { PoiFeature } from '../interfaces/poi-feature.interface';
import { PoiProperties } from '../interfaces/poi-properties.interface';
import { FeatureIdGenerator } from '../helpers/feature-id-generator.helper';
import { GeometryFailureClassifier } from '../helpers/geometry-failure-classifier.helper';
import { PointGeometryValidator } from './point-geometry.validator';
import { StringFieldValidator } from './string-field.validator';

export class FeatureValidator {
  private readonly geometryValidator = new PointGeometryValidator();
  private readonly stringValidator = new StringFieldValidator();
  private readonly idGenerator = new FeatureIdGenerator();
  private readonly geometryFailureClassifier = new GeometryFailureClassifier();

  validate(value: unknown): PoiFeature | DiscardReason {
    if (value === null || typeof value !== 'object') {
      return DiscardReason.NotAFeature;
    }
    const candidate = value as {
      type?: unknown;
      id?: unknown;
      geometry?: unknown;
      properties?: unknown;
    };
    if (candidate.type !== GeoJsonType.Feature) {
      return DiscardReason.NotAFeature;
    }
    if (!this.geometryValidator.isValid(candidate.geometry)) {
      return this.geometryFailureClassifier.classify(candidate.geometry);
    }
    if (candidate.properties === null || typeof candidate.properties !== 'object') {
      return DiscardReason.MissingProperties;
    }
    const props = candidate.properties as { name?: unknown; category?: unknown };
    if (!this.stringValidator.isValid(props.name)) {
      return DiscardReason.InvalidName;
    }
    if (!this.stringValidator.isValid(props.category)) {
      return DiscardReason.InvalidCategory;
    }
    const id = typeof candidate.id === 'string' && candidate.id.length > 0
      ? candidate.id
      : this.idGenerator.generate();
    const properties: PoiProperties = {
      ...(candidate.properties as Record<string, unknown>),
      name: props.name,
      category: props.category,
    };
    return {
      type: GeoJsonType.Feature,
      id,
      geometry: candidate.geometry,
      properties,
    };
  }
}
