import { describe, expect, it } from 'vitest';
import { CoordinatesSnapper } from './coordinates-snapper.helper';

describe('CoordinatesSnapper', () => {
  it('snaps coordinates to the default 0.0001 grid', () => {
    const snapper = new CoordinatesSnapper();
    expect(snapper.snap([-70.64831, -33.45694])).toEqual([-70.6483, -33.4569]);
  });

  it('uses a custom step', () => {
    const snapper = new CoordinatesSnapper(0.5);
    expect(snapper.snap([-70.65, -33.45])).toEqual([-70.5, -33.5]);
  });
});
