import { Coordinates } from '../types/coordinates.type';
import { LatitudeValidator } from './latitude.validator';
import { LongitudeValidator } from './longitude.validator';

export class CoordinatesValidator {
  private readonly longitudeValidator = new LongitudeValidator();
  private readonly latitudeValidator = new LatitudeValidator();

  isValid(value: unknown): value is Coordinates {
    if (!Array.isArray(value) || value.length !== 2) {
      return false;
    }
    const [lon, lat] = value as readonly unknown[];
    return this.longitudeValidator.isValid(lon) && this.latitudeValidator.isValid(lat);
  }
}
