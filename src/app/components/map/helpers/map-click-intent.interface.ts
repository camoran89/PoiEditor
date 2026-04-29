import { Coordinates } from '../../../core/types/coordinates.type';
import { FeatureId } from '../../../core/types/feature-id.type';
import { MapClickIntentType } from './map-click-intent-type.enum';

export interface MapClickIntent {
  readonly type: MapClickIntentType;
  readonly featureId?: FeatureId;
  readonly coordinates?: Coordinates;
  readonly clusterId?: number;
}
