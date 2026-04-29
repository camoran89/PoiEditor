import { describe, it, expect } from 'vitest';
import { FeatureIdGenerator } from './feature-id-generator.helper';
import { FEATURE_ID_PREFIX } from '../constants/feature-id-prefix.const';

describe('FeatureIdGenerator', () => {
  const generator = new FeatureIdGenerator();

  it('generates an id that starts with the prefix', () => {
    expect(generator.generate()).toMatch(new RegExp(`^${FEATURE_ID_PREFIX}-`));
  });

  it('generates unique ids on successive calls', () => {
    const ids = Array.from({ length: 20 }, () => generator.generate());
    expect(new Set(ids).size).toBe(20);
  });

  it('generates a non-empty string', () => {
    expect(generator.generate().length).toBeGreaterThan(0);
  });
});
