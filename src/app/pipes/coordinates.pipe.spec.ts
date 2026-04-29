import { describe, it, expect } from 'vitest';
import { CoordinatesPipe } from './coordinates.pipe';

describe('CoordinatesPipe', () => {
  const pipe = new CoordinatesPipe();

  it('formats as "lat, lon" with 5 decimal places by default', () => {
    expect(pipe.transform([-70.6, -33.4])).toBe('-33.40000, -70.60000');
  });

  it('respects a custom fractionDigits argument', () => {
    expect(pipe.transform([-70.6, -33.4], 2)).toBe('-33.40, -70.60');
  });

  it('formats zero coordinates correctly', () => {
    expect(pipe.transform([0, 0])).toBe('0.00000, 0.00000');
  });

  it('puts latitude before longitude in the output', () => {
    const [lat, lon] = pipe.transform([-70.12345, -33.98765]).split(', ');
    expect(lat).toBe('-33.98765');
    expect(lon).toBe('-70.12345');
  });
});
