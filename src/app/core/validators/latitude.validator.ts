import { MAX_LATITUDE } from '../constants/max-latitude.const';
import { MIN_LATITUDE } from '../constants/min-latitude.const';
import { Latitude } from '../types/latitude.type';

export class LatitudeValidator {
  isValid(value: unknown): value is Latitude {
    return typeof value === 'number'
      && Number.isFinite(value)
      && value >= MIN_LATITUDE
      && value <= MAX_LATITUDE;
  }
}
