import { describe, expect, it } from 'vitest';
import { LatitudeValidator } from './latitude.validator';

describe('LatitudeValidator', () => {
  const validator = new LatitudeValidator();

  it('accepts numbers within [-90, 90]', () => {
    expect(validator.isValid(0)).toBe(true);
    expect(validator.isValid(-90)).toBe(true);
    expect(validator.isValid(90)).toBe(true);
    expect(validator.isValid(-33.45)).toBe(true);
  });

  it('rejects out-of-range values', () => {
    expect(validator.isValid(-91)).toBe(false);
    expect(validator.isValid(91)).toBe(false);
  });

  it('rejects non-finite or non-numeric values', () => {
    expect(validator.isValid(Number.NaN)).toBe(false);
    expect(validator.isValid('0')).toBe(false);
    expect(validator.isValid(null)).toBe(false);
  });
});
