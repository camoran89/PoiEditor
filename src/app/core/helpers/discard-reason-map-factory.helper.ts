import { DiscardReason } from '../enums/discard-reason.enum';

export class DiscardReasonMapFactory {
  create(): Record<DiscardReason, number> {
    return {
      [DiscardReason.NotAFeature]: 0,
      [DiscardReason.GeometryNotPoint]: 0,
      [DiscardReason.InvalidCoordinates]: 0,
      [DiscardReason.CoordinatesOutOfRange]: 0,
      [DiscardReason.MissingProperties]: 0,
      [DiscardReason.InvalidName]: 0,
      [DiscardReason.InvalidCategory]: 0,
    };
  }
}
