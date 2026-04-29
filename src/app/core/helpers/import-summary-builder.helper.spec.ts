import { describe, it, expect } from 'vitest';
import { ImportSummaryBuilder } from './import-summary-builder.helper';
import { DiscardReason } from '../enums/discard-reason.enum';
import { DiscardedFeature } from '../interfaces/discarded-feature.interface';

describe('ImportSummaryBuilder', () => {
  const builder = new ImportSummaryBuilder();

  it('sets importedCount from the argument', () => {
    const summary = builder.build(5, []);
    expect(summary.importedCount).toBe(5);
  });

  it('sets discardedCount from discarded array length', () => {
    const discarded: DiscardedFeature[] = [
      { index: 0, reason: DiscardReason.InvalidName },
      { index: 1, reason: DiscardReason.NotAFeature },
    ];
    expect(builder.build(0, discarded).discardedCount).toBe(2);
  });

  it('accumulates counts per reason', () => {
    const discarded: DiscardedFeature[] = [
      { index: 0, reason: DiscardReason.InvalidCoordinates },
      { index: 1, reason: DiscardReason.InvalidCoordinates },
      { index: 2, reason: DiscardReason.InvalidName },
    ];
    const summary = builder.build(3, discarded);
    expect(summary.discardedByReason[DiscardReason.InvalidCoordinates]).toBe(2);
    expect(summary.discardedByReason[DiscardReason.InvalidName]).toBe(1);
    expect(summary.discardedByReason[DiscardReason.NotAFeature]).toBe(0);
  });

  it('returns zero counts for all reasons when no discards', () => {
    const summary = builder.build(10, []);
    for (const reason of Object.values(DiscardReason)) {
      expect(summary.discardedByReason[reason]).toBe(0);
    }
  });
});
