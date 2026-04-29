import { SNAP_GRID_STEP } from '../constants/snap-grid-step.const';
import { Coordinates } from '../types/coordinates.type';

export class CoordinatesSnapper {
  private readonly step: number;

  constructor(step: number = SNAP_GRID_STEP) {
    this.step = step;
  }

  snap(coordinates: Coordinates): Coordinates {
    return [this.snapValue(coordinates[0]), this.snapValue(coordinates[1])];
  }

  private snapValue(value: number): number {
    const rounded = Math.round(value / this.step) * this.step;
    const decimals = this.decimals(this.step);
    return Number(rounded.toFixed(decimals));
  }

  private decimals(step: number): number {
    if (step >= 1) {
      return 0;
    }
    const text = step.toString();
    const dot = text.indexOf('.');
    return dot < 0 ? 0 : text.length - dot - 1;
  }
}
