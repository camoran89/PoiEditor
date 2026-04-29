import { DiscardReason } from '../enums/discard-reason.enum';

export interface ImportSummary {
  readonly importedCount: number;
  readonly discardedCount: number;
  readonly discardedByReason: Readonly<Record<DiscardReason, number>>;
}
