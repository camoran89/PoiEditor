import { FEATURE_ID_PREFIX } from '../constants/feature-id-prefix.const';
import { FeatureId } from '../types/feature-id.type';

export class FeatureIdGenerator {
  generate(): FeatureId {
    const random = Math.random().toString(36).slice(2, 10);
    const timestamp = Date.now().toString(36);
    return `${FEATURE_ID_PREFIX}-${timestamp}-${random}`;
  }
}
