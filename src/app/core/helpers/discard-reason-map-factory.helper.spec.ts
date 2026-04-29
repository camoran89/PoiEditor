import { describe, it, expect } from 'vitest';
import { DiscardReasonMapFactory } from './discard-reason-map-factory.helper';
import { DiscardReason } from '../enums/discard-reason.enum';

describe('DiscardReasonMapFactory', () => {
  const factory = new DiscardReasonMapFactory();

  it('creates a map with all DiscardReason keys set to 0', () => {
    const map = factory.create();
    for (const reason of Object.values(DiscardReason)) {
      expect(map[reason]).toBe(0);
    }
  });

  it('returns a fresh object each time (no shared reference)', () => {
    const a = factory.create();
    const b = factory.create();
    a[DiscardReason.NotAFeature] = 5;
    expect(b[DiscardReason.NotAFeature]).toBe(0);
  });
});
