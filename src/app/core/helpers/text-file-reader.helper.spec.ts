import { describe, it, expect } from 'vitest';
import { TextFileReader } from './text-file-reader.helper';

describe('TextFileReader', () => {
  const reader = new TextFileReader();

  it('resolves with the file text content', async () => {
    const file = new File(['hello world'], 'test.geojson', { type: 'application/json' });
    const result = await reader.read(file);
    expect(result).toBe('hello world');
  });

  it('resolves with empty string for an empty file', async () => {
    const file = new File([''], 'empty.geojson');
    const result = await reader.read(file);
    expect(result).toBe('');
  });

  it('resolves with JSON text', async () => {
    const json = '{"type":"FeatureCollection","features":[]}';
    const file = new File([json], 'data.geojson');
    const result = await reader.read(file);
    expect(result).toBe(json);
  });
});
