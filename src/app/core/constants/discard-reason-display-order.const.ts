import { DiscardReason } from '../enums/discard-reason.enum';

export const DISCARD_REASON_DISPLAY_ORDER: readonly DiscardReason[] = [
  DiscardReason.NotAFeature,
  DiscardReason.GeometryNotPoint,
  DiscardReason.InvalidCoordinates,
  DiscardReason.CoordinatesOutOfRange,
  DiscardReason.MissingProperties,
  DiscardReason.InvalidName,
  DiscardReason.InvalidCategory,
];
