import { Coordinates } from '../types/coordinates.type';

export interface PoiCreationInput {
  readonly coordinates: Coordinates;
  readonly name: string;
  readonly category: string;
}
