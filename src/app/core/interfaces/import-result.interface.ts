import { DiscardedFeature } from './discarded-feature.interface';
import { PoiFeature } from './poi-feature.interface';

export interface ImportResult {
  readonly imported: readonly PoiFeature[];
  readonly discarded: readonly DiscardedFeature[];
}
