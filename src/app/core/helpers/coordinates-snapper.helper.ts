import { SNAP_GRID_STEP } from '../constants/snap-grid-step.const';
import { Coordinates } from '../types/coordinates.type';
import { GridValueSnapper } from './grid-value-snapper.helper';

export class CoordinatesSnapper {
  private readonly valueSnapper = new GridValueSnapper();
  private readonly step: number;

  constructor(step: number = SNAP_GRID_STEP) {
    this.step = step;
  }

  snap(coordinates: Coordinates): Coordinates {
    return [
      this.valueSnapper.snap(coordinates[0], this.step),
      this.valueSnapper.snap(coordinates[1], this.step),
    ];
  }
}
