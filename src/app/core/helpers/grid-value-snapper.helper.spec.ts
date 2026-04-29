import { describe, it, expect } from 'vitest';
import { GridValueSnapper } from './grid-value-snapper.helper';

describe('GridValueSnapper', () => {
  const snapper = new GridValueSnapper();

  it('snaps a value to the nearest step', () => {
    expect(snapper.snap(-70.64831, 0.0001)).toBe(-70.6483);
  });

  it('returns the value unchanged when already on grid', () => {
    expect(snapper.snap(-70.6483, 0.0001)).toBe(-70.6483);
  });

  it('snaps to integer step', () => {
    expect(snapper.snap(3.7, 1)).toBe(4);
  });

  it('snaps to 0.5 step', () => {
    expect(snapper.snap(1.3, 0.5)).toBe(1.5);
    expect(snapper.snap(1.2, 0.5)).toBe(1.0);
  });

  it('handles negative values', () => {
    expect(snapper.snap(-33.45694, 0.0001)).toBe(-33.4569);
  });
});
