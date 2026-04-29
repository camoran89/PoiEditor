import { describe, it, expect } from 'vitest';
import { StepDecimalsCounter } from './step-decimals-counter.helper';

describe('StepDecimalsCounter', () => {
  const counter = new StepDecimalsCounter();

  it('returns 0 for step >= 1', () => {
    expect(counter.count(1)).toBe(0);
    expect(counter.count(5)).toBe(0);
  });

  it('returns 1 for step 0.1', () => {
    expect(counter.count(0.1)).toBe(1);
  });

  it('returns 4 for step 0.0001', () => {
    expect(counter.count(0.0001)).toBe(4);
  });

  it('returns 2 for step 0.25', () => {
    expect(counter.count(0.25)).toBe(2);
  });

  it('returns 0 for integer-valued step like 10', () => {
    expect(counter.count(10)).toBe(0);
  });
});
