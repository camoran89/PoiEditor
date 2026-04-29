import { MAX_LONGITUDE } from '../constants/max-longitude.const';
import { MIN_LONGITUDE } from '../constants/min-longitude.const';
import { Longitude } from '../types/longitude.type';

export class LongitudeValidator {
  isValid(value: unknown): value is Longitude {
    return typeof value === 'number'
      && Number.isFinite(value)
      && value >= MIN_LONGITUDE
      && value <= MAX_LONGITUDE;
  }
}
