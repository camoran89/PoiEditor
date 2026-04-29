import { describe, it, expect } from 'vitest';
import { CategoryLabelPipe } from './category-label.pipe';

describe('CategoryLabelPipe', () => {
  const pipe = new CategoryLabelPipe();

  it('capitalises the first word', () => {
    expect(pipe.transform('landmark')).toBe('Landmark');
  });

  it('replaces underscores with spaces and capitalises each word', () => {
    expect(pipe.transform('some_category')).toBe('Some Category');
  });

  it('replaces hyphens with spaces and capitalises each word', () => {
    expect(pipe.transform('fast-food')).toBe('Fast Food');
  });

  it('returns empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('handles already-capitalised input', () => {
    expect(pipe.transform('Museum')).toBe('Museum');
  });
});
