import { describe, it, expect } from 'vitest';
import { JsonParser } from './json-parser.helper';

describe('JsonParser', () => {
  const parser = new JsonParser();

  it('parses a valid JSON string', () => {
    expect(parser.parse('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses an array', () => {
    expect(parser.parse('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parser.parse('{invalid}')).toThrow();
  });
});
