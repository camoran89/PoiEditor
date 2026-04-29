import { DiscardReason } from '../enums/discard-reason.enum';

export interface DiscardedFeature {
  readonly index: number;
  readonly reason: DiscardReason;
}
