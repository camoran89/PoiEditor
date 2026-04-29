export class StepDecimalsCounter {
  count(step: number): number {
    if (step >= 1) {
      return 0;
    }
    const text = step.toString();
    const dot = text.indexOf('.');
    return dot < 0 ? 0 : text.length - dot - 1;
  }
}
