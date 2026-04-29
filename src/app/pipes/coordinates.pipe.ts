import { Pipe, PipeTransform } from '@angular/core';
import { Coordinates } from '../core/types/coordinates.type';

@Pipe({ name: 'coordinates', standalone: true })
export class CoordinatesPipe implements PipeTransform {
  transform(value: Coordinates, fractionDigits = 5): string {
    const [lon, lat] = value;
    return `${lat.toFixed(fractionDigits)}, ${lon.toFixed(fractionDigits)}`;
  }
}
