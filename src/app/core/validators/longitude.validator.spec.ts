import { describe, expect, it } from 'vitest';
import { LongitudeValidator } from './longitude.validator';

describe('LongitudeValidator', () => {
  const validator = new LongitudeValidator();

  it('accepts numbers within [-180, 180]', () => {
    expect(validator.isValid(0)).toBe(true);
    expect(validator.isValid(-180)).toBe(true);
    expect(validator.isValid(180)).toBe(true);
    expect(validator.isValid(-70.65)).toBe(true);
  });

  it('rejects out-of-range values', () => {
    expect(validator.isValid(-181)).toBe(false);
    expect(validator.isValid(181)).toBe(false);
  });

  it('rejects non-finite or non-numeric values', () => {
    expect(validator.isValid(Number.NaN)).toBe(false);
    expect(validator.isValid(Number.POSITIVE_INFINITY)).toBe(false);
    expect(validator.isValid('0')).toBe(false);
    expect(validator.isValid(null)).toBe(false);
    expect(validator.isValid(undefined)).toBe(false);
  });
});
