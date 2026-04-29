import { describe, expect, it } from 'vitest';
import { CoordinatesValidator } from './coordinates.validator';

describe('CoordinatesValidator', () => {
  const validator = new CoordinatesValidator();

  it('accepts a [lon, lat] tuple inside WGS84 bounds', () => {
    expect(validator.isValid([-70.65, -33.45])).toBe(true);
    expect(validator.isValid([0, 0])).toBe(true);
  });

  it('rejects arrays of wrong length', () => {
    expect(validator.isValid([0])).toBe(false);
    expect(validator.isValid([0, 0, 0])).toBe(false);
  });

  it('rejects values outside the valid ranges', () => {
    expect(validator.isValid([200, 0])).toBe(false);
    expect(validator.isValid([0, 100])).toBe(false);
  });

  it('rejects non-array inputs', () => {
    expect(validator.isValid(null)).toBe(false);
    expect(validator.isValid('coords')).toBe(false);
    expect(validator.isValid({ 0: 0, 1: 0, length: 2 })).toBe(false);
  });
});
