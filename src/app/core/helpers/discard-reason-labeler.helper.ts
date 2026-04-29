import { DiscardReason } from '../enums/discard-reason.enum';

export class DiscardReasonLabeler {
  label(reason: DiscardReason): string {
    switch (reason) {
      case DiscardReason.NotAFeature:
        return 'not a Feature';
      case DiscardReason.GeometryNotPoint:
        return 'geometry is not Point';
      case DiscardReason.InvalidCoordinates:
        return 'invalid coordinates';
      case DiscardReason.CoordinatesOutOfRange:
        return 'coordinates out of range';
      case DiscardReason.MissingProperties:
        return 'missing properties';
      case DiscardReason.InvalidName:
        return 'invalid name';
      case DiscardReason.InvalidCategory:
        return 'invalid category';
    }
  }
}
