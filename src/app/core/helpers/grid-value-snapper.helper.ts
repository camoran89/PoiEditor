import { StepDecimalsCounter } from './step-decimals-counter.helper';

export class GridValueSnapper {
  private readonly decimalsCounter = new StepDecimalsCounter();

  snap(value: number, step: number): number {
    const rounded = Math.round(value / step) * step;
    return Number(rounded.toFixed(this.decimalsCounter.count(step)));
  }
}
