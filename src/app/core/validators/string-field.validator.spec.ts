import { describe, it, expect } from 'vitest';
import { StringFieldValidator } from './string-field.validator';

describe('StringFieldValidator', () => {
  const validator = new StringFieldValidator();

  it('returns true for a non-empty string', () => {
    expect(validator.isValid('hello')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(validator.isValid('')).toBe(false);
  });

  it('returns false for a whitespace-only string', () => {
    expect(validator.isValid('   ')).toBe(false);
  });

  it('returns false for null', () => {
    expect(validator.isValid(null)).toBe(false);
  });

  it('returns false for a number', () => {
    expect(validator.isValid(42)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(validator.isValid(undefined)).toBe(false);
  });
});
