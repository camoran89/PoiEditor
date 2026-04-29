import { DiscardedFeature } from '../interfaces/discarded-feature.interface';
import { ImportSummary } from '../interfaces/import-summary.interface';
import { DiscardReasonMapFactory } from './discard-reason-map-factory.helper';

export class ImportSummaryBuilder {
  private readonly reasonMapFactory = new DiscardReasonMapFactory();

  build(importedCount: number, discarded: readonly DiscardedFeature[]): ImportSummary {
    const discardedByReason = this.reasonMapFactory.create();
    for (const item of discarded) {
      discardedByReason[item.reason] = discardedByReason[item.reason] + 1;
    }
    return {
      importedCount,
      discardedCount: discarded.length,
      discardedByReason,
    };
  }
}
