import { describe, it, expect } from 'vitest';
import { DiscardReasonLabeler } from './discard-reason-labeler.helper';
import { DiscardReason } from '../enums/discard-reason.enum';

describe('DiscardReasonLabeler', () => {
  const labeler = new DiscardReasonLabeler();

  it.each([
    [DiscardReason.NotAFeature,          'not a Feature'],
    [DiscardReason.GeometryNotPoint,     'geometry is not Point'],
    [DiscardReason.InvalidCoordinates,   'invalid coordinates'],
    [DiscardReason.CoordinatesOutOfRange,'coordinates out of range'],
    [DiscardReason.MissingProperties,    'missing properties'],
    [DiscardReason.InvalidName,          'invalid name'],
    [DiscardReason.InvalidCategory,      'invalid category'],
  ])('labels %s as "%s"', (reason, expected) => {
    expect(labeler.label(reason)).toBe(expected);
  });
});
